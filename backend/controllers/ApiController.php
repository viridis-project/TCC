<?php

declare(strict_types=1);

namespace Viridis\controllers;

use DateTimeImmutable;
use PDO;
use Throwable;
use Viridis\middleware\AuthMiddleware;
use Viridis\models\Missao;
use Viridis\models\Usuario;

final class ApiController extends Controller
{
    public function __construct(private PDO $db, private AuthMiddleware $auth, private array $config) {}

    public function perfil(string $method): never
    {
        $user = $this->auth->user();
        if ($method === 'GET') $this->json(['usuario' => Usuario::publicData($user)]);
        $data = $this->input();
        $allowed = ['nome', 'email', 'avatar', 'telefone', 'notificacoes_ativas', 'tema_escuro'];
        $set = []; $values = [];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                if ($field === 'email' && !filter_var($data[$field], FILTER_VALIDATE_EMAIL)) $this->json(['erro' => 'E-mail inválido'], 422);
                $set[] = "{$field}=?";
                $values[] = in_array($field, ['notificacoes_ativas','tema_escuro'], true) ? (int) (bool) $data[$field] : trim((string) $data[$field]);
            }
        }
        if ($set === []) $this->json(['erro' => 'Nenhum dado para atualizar'], 422);
        $values[] = (int) $user['id'];
        try {
            $stmt = $this->db->prepare('UPDATE usuario SET ' . implode(',', $set) . ' WHERE id=?');
            $stmt->execute($values);
        } catch (Throwable) { $this->json(['erro' => 'E-mail já cadastrado'], 409); }
        $this->json(['mensagem' => 'Perfil atualizado com sucesso!']);
    }

    public function modulos(): never
    {
        $user = $this->auth->user();
        $stmt = $this->db->prepare(
            "SELECT m.id modulo_id,m.titulo modulo_titulo,m.descricao,m.cor,m.ordem modulo_ordem,
                    l.id licao_id,l.titulo licao_titulo,l.kind,l.xp,l.ordem licao_ordem,
                    COALESCE(ulp.status, CASE WHEN m.ordem=1 AND l.ordem=1 THEN 'current' ELSE 'locked' END) status
             FROM modulo m JOIN licao l ON l.modulo_id=m.id
             LEFT JOIN usuario_licao_progresso ulp ON ulp.licao_id=l.id AND ulp.usuario_id=?
             ORDER BY m.ordem,l.ordem"
        );
        $stmt->execute([(int) $user['id']]);
        $modules = [];
        foreach ($stmt->fetchAll() as $row) {
            $id = (int) $row['modulo_id'];
            if (!isset($modules[$id])) $modules[$id] = [
                'id'=>$id,'titulo'=>$row['modulo_titulo'],'descricao'=>$row['descricao'],'cor'=>$row['cor'],
                'ordem'=>(int)$row['modulo_ordem'],'progresso'=>0,'licoes'=>[]
            ];
            $modules[$id]['licoes'][] = ['id'=>(int)$row['licao_id'],'titulo'=>$row['licao_titulo'],'kind'=>$row['kind'],'xp'=>(int)$row['xp'],'ordem'=>(int)$row['licao_ordem'],'status'=>$row['status']];
        }
        foreach ($modules as &$module) {
            $total = count($module['licoes']);
            $done = count(array_filter($module['licoes'], fn($l) => $l['status']==='completed'));
            $module['progresso'] = $total ? (int) round($done * 100 / $total) : 0;
        }
        $this->json(['modulos' => array_values($modules)]);
    }

    public function quiz(int $lessonId): never
    {
        $this->auth->user();
        $stmt = $this->db->prepare('SELECT id,texto_pergunta,explicacao,pontos_recompensa FROM pergunta_quiz WHERE licao_id=? ORDER BY id');
        $stmt->execute([$lessonId]);
        $questions = $stmt->fetchAll();
        if ($questions === []) {
            $fallback = $this->db->prepare('SELECT id,texto_pergunta,explicacao,pontos_recompensa FROM pergunta_quiz ORDER BY id LIMIT 4');
            $fallback->execute();
            $questions = $fallback->fetchAll();
        }
        $opt = $this->db->prepare('SELECT id,texto_opcao FROM opcao_quiz WHERE pergunta_id=? ORDER BY id');
        foreach ($questions as &$question) {
            $opt->execute([(int) $question['id']]);
            $question['opcoes'] = $opt->fetchAll();
            $question['pontos_recompensa'] = (int) $question['pontos_recompensa'];
        }
        if ($questions === []) $this->json(['erro' => 'Quiz não encontrado'], 404);
        $this->json(['licao_id'=>$lessonId,'perguntas'=>$questions]);
    }

    public function submitQuiz(int $lessonId): never
    {
        $user = $this->auth->user(['aluno']);
        $data = $this->input();
        $answers = $data['respostas'] ?? null;
        if (!is_array($answers) || $answers === []) $this->json(['erro' => 'Envie suas respostas'], 422);
        try {
            $this->db->beginTransaction();
            $lesson = $this->db->prepare('SELECT id,xp FROM licao WHERE id=? FOR UPDATE');
            $lesson->execute([$lessonId]);
            $lessonRow = $lesson->fetch();
            if (!$lessonRow) { $this->db->rollBack(); $this->json(['erro'=>'Lição não encontrada'],404); }
            $previous = $this->db->prepare('SELECT status FROM usuario_licao_progresso WHERE usuario_id=? AND licao_id=? FOR UPDATE');
            $previous->execute([(int)$user['id'],$lessonId]);
            $alreadyCompleted = $previous->fetchColumn() === 'completed';
            $check = $this->db->prepare(
                'SELECT pq.id pergunta_id,pq.pontos_recompensa,oq.is_correta
                 FROM pergunta_quiz pq JOIN opcao_quiz oq ON oq.pergunta_id=pq.id
                 WHERE pq.id=? AND oq.id=? AND (pq.licao_id=? OR NOT EXISTS (SELECT 1 FROM pergunta_quiz px WHERE px.licao_id=?))'
            );
            $record = $this->db->prepare('INSERT INTO progresso_quiz (aluno_id,pergunta_id,acertou) VALUES (?,?,?)');
            $correct = 0; $points = 0;
            foreach ($answers as $answer) {
                $qid = (int)($answer['pergunta_id'] ?? 0); $oid = (int)($answer['opcao_id'] ?? 0);
                $check->execute([$qid,$oid,$lessonId,$lessonId]);
                $result = $check->fetch();
                if (!$result) { $this->db->rollBack(); $this->json(['erro'=>'Resposta inválida'],422); }
                $right = (int)$result['is_correta'] === 1;
                $correct += $right ? 1 : 0;
                $points += $right ? (int)$result['pontos_recompensa'] : 0;
                $record->execute([(int)$user['id'],$qid,(int)$right]);
            }
            $accuracy = $correct / count($answers);
            $xp = $alreadyCompleted ? 0 : (int) round((int)$lessonRow['xp'] * (0.5 + 0.5 * $accuracy));
            if (!$alreadyCompleted) {
                $upsert = $this->db->prepare("INSERT INTO usuario_licao_progresso (usuario_id,licao_id,status,concluida_em) VALUES (?,?,'completed',NOW()) ON DUPLICATE KEY UPDATE status='completed',concluida_em=NOW()");
                $upsert->execute([(int)$user['id'],$lessonId]);
                $update = $this->db->prepare(
                    'UPDATE usuario SET xp=xp+?, pontos_totais=pontos_totais+?,
                     nivel=FLOOR((xp+?)/200)+1, xp_proximo_nivel=(FLOOR((xp+?)/200)+1)*200,
                     streak_dias=CASE WHEN ultima_atividade_em=CURDATE() THEN streak_dias WHEN ultima_atividade_em=DATE_SUB(CURDATE(),INTERVAL 1 DAY) THEN streak_dias+1 ELSE 1 END,
                     ultima_atividade_em=CURDATE() WHERE id=?'
                );
                $update->execute([$xp,$points,$xp,$xp,(int)$user['id']]);
                $this->unlockNextLesson((int)$user['id'],$lessonId);
                $this->checkAchievements((int)$user['id']);
            }
            $this->db->commit();
            $this->json(['mensagem'=>'Quiz concluído!','acertos'=>$correct,'total'=>count($answers),'xp_ganho'=>$xp,'pontos_ganhos'=>$alreadyCompleted?0:$points,'ja_concluida'=>$alreadyCompleted]);
        } catch (Throwable $e) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            throw $e;
        }
    }

    public function missoes(): never
    {
        $this->auth->user();
        $this->json(['missoes'=>(new Missao($this->db))->all()]);
    }

    public function createSubmission(): never
    {
        $user = $this->auth->user(['aluno']);
        $missionId = (int)($_POST['missao_id'] ?? 0);
        $description = trim((string)($_POST['descricao'] ?? ''));
        if (mb_strlen($description) < 5) $this->json(['erro'=>'Descreva sua atividade com pelo menos 5 caracteres'],422);
        if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) $this->json(['erro'=>'Envie uma foto da atividade'],422);
        $file = $_FILES['foto'];
        if ((int)$file['size'] > $this->config['upload_max_bytes']) $this->json(['erro'=>'A foto deve ter no máximo 5 MB'],422);
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $extensions = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
        if (!isset($extensions[$mime])) $this->json(['erro'=>'Use uma foto JPG, PNG ou WebP'],422);
        $mission = $this->db->prepare('SELECT id FROM missao WHERE id=?');
        $mission->execute([$missionId]);
        if (!$mission->fetchColumn()) $this->json(['erro'=>'Atividade não encontrada'],404);
        if (!is_dir($this->config['upload_dir'])) mkdir($this->config['upload_dir'],0750,true);
        $name = bin2hex(random_bytes(16)).'.'.$extensions[$mime];
        if (!move_uploaded_file($file['tmp_name'],$this->config['upload_dir'].'/'.$name)) $this->json(['erro'=>'Não foi possível salvar a foto'],500);
        $stmt = $this->db->prepare("INSERT INTO submissao_missao (aluno_id,missao_id,descricao,url_foto,status) VALUES (?,?,?,?,'pending')");
        $stmt->execute([(int)$user['id'],$missionId,$description,'/uploads/'.$name]);
        $this->json(['mensagem'=>'Atividade enviada para verificação','id'=>(int)$this->db->lastInsertId()],201);
    }

    public function submissions(): never
    {
        $this->auth->user(['professor','admin']);
        $status = $_GET['status'] ?? 'pending';
        if (!in_array($status,['pending','approved','rejected'],true)) $this->json(['erro'=>'Status inválido'],422);
        $stmt = $this->db->prepare(
            'SELECT s.id,s.descricao,s.url_foto,s.status,s.comentario_professor,s.data_envio,
                    u.id aluno_id,u.nome aluno,u.turma,m.id missao_id,m.titulo atividade,m.tipo,m.pontos_recompensa pontos
             FROM submissao_missao s JOIN usuario u ON u.id=s.aluno_id JOIN missao m ON m.id=s.missao_id
             WHERE s.status=? ORDER BY s.data_envio'
        );
        $stmt->execute([$status]);
        $this->json(['submissoes'=>$stmt->fetchAll()]);
    }

    public function reviewSubmission(int $id): never
    {
        $reviewer = $this->auth->user(['professor','admin']);
        $data = $this->input(); $status = $data['status'] ?? '';
        if (!in_array($status,['approved','rejected'],true)) $this->json(['erro'=>'Escolha aprovar ou rejeitar'],422);
        $comment = trim((string)($data['comentario'] ?? ''));
        if ($status==='rejected' && mb_strlen($comment)<3) $this->json(['erro'=>'Adicione um comentário explicando a rejeição'],422);
        try {
            $this->db->beginTransaction();
            $stmt = $this->db->prepare(
                'SELECT s.aluno_id,s.status,m.pontos_recompensa FROM submissao_missao s JOIN missao m ON m.id=s.missao_id WHERE s.id=? FOR UPDATE'
            );
            $stmt->execute([$id]); $submission=$stmt->fetch();
            if (!$submission) { $this->db->rollBack(); $this->json(['erro'=>'Submissão não encontrada'],404); }
            if ($submission['status']!=='pending') { $this->db->rollBack(); $this->json(['erro'=>'Esta atividade já foi revisada'],409); }
            $update=$this->db->prepare('UPDATE submissao_missao SET status=?,professor_validado=?,comentario_professor=?,revisado_por=?,revisado_em=NOW() WHERE id=?');
            $update->execute([$status,$status==='approved'?1:0,$comment?:null,(int)$reviewer['id'],$id]);
            $credited=0;
            if ($status==='approved') {
                $credited=(int)$submission['pontos_recompensa'];
                $points=$this->db->prepare('UPDATE usuario SET pontos_totais=pontos_totais+?, ultima_atividade_em=CURDATE() WHERE id=?');
                $points->execute([$credited,(int)$submission['aluno_id']]);
                $this->checkAchievements((int)$submission['aluno_id']);
            }
            $notification=$this->db->prepare('INSERT INTO notificacao (usuario_id,tipo,titulo,mensagem,link) VALUES (?,?,?,?,\'/jardim\')');
            $notification->execute([(int)$submission['aluno_id'],$status==='approved'?'atividade_aprovada':'atividade_rejeitada',$status==='approved'?'Atividade aprovada!':'Atividade rejeitada',$status==='approved'?'Seus pontos já foram creditados.':($comment?:'Confira o comentário do professor.')]);
            $this->db->commit();
            $this->json(['mensagem'=>$status==='approved'?'Atividade aprovada!':'Atividade rejeitada','pontos_creditados'=>$credited]);
        } catch (Throwable $e) { if ($this->db->inTransaction()) $this->db->rollBack(); throw $e; }
    }

    public function rewards(): never
    {
        $user=$this->auth->user();
        $stmt=$this->db->prepare("SELECT r.id,r.titulo,r.escopo,r.pontos_necessarios pontos,r.imagem,p.id parceiro_id,p.nome parceiro,p.tipo FROM recompensa r JOIN parceiro p ON p.id=r.parceiro_id WHERE r.ativo=1 AND p.ativo=1 AND (r.escopo='app' OR (r.escopo='escola' AND r.instituicao_id=?)) ORDER BY r.escopo DESC,r.pontos_necessarios");
        $stmt->execute([(int)($user['instituicao_id']??0)]); $this->json(['recompensas'=>$stmt->fetchAll()]);
    }

    public function redeem(): never
    {
        $user=$this->auth->user(['aluno']); $data=$this->input(); $rewardId=(int)($data['recompensa_id']??0);
        try {
            $this->db->beginTransaction();
            $lock=$this->db->prepare('SELECT pontos_totais FROM usuario WHERE id=? FOR UPDATE'); $lock->execute([(int)$user['id']]);
            $balance=(int)$lock->fetchColumn();
            $reward=$this->db->prepare('SELECT pontos_necessarios FROM recompensa WHERE id=? AND ativo=1'); $reward->execute([$rewardId]);
            $cost=$reward->fetchColumn();
            if ($cost===false) { $this->db->rollBack(); $this->json(['erro'=>'Recompensa não encontrada'],404); }
            if ($balance<(int)$cost) { $this->db->rollBack(); $this->json(['erro'=>'Pontos insuficientes'],422); }
            $debit=$this->db->prepare('UPDATE usuario SET pontos_totais=pontos_totais-? WHERE id=?'); $debit->execute([(int)$cost,(int)$user['id']]);
            $insert=$this->db->prepare('INSERT INTO resgate (usuario_id,recompensa_id,pontos_debitados) VALUES (?,?,?)'); $insert->execute([(int)$user['id'],$rewardId,(int)$cost]);
            $this->db->commit();
            $this->json(['mensagem'=>'Resgate confirmado!','resgate_id'=>(int)$this->db->lastInsertId(),'saldo'=>$balance-(int)$cost],201);
        } catch (Throwable $e) { if ($this->db->inTransaction()) $this->db->rollBack(); throw $e; }
    }

    public function ranking(): never
    {
        $user=$this->auth->user(); $type=$_GET['tipo']??'individual';$params=[];
        if ($type==='individual') $sql="SELECT u.id,u.nome,u.username,u.avatar,t.id turma_id,t.nome turma,u.pontos_totais pontos,
          i.id instituicao_id,i.nome instituicao_nome FROM usuario u JOIN perfil p ON p.id=u.perfil_id
          LEFT JOIN turma_escolar t ON t.id=u.turma_id LEFT JOIN instituicao i ON i.id=t.instituicao_id
          WHERE p.nome='aluno' ORDER BY u.pontos_totais DESC,u.nome LIMIT 100";
        elseif ($type==='turma') {
            $sql="SELECT t.id turma_id,t.nome,t.instituicao_id,i.nome instituicao_nome,SUM(u.pontos_totais) pontos,COUNT(u.id) alunos
              FROM turma_escolar t JOIN instituicao i ON i.id=t.instituicao_id
              LEFT JOIN usuario u ON u.turma_id=t.id AND u.perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1)
              WHERE t.instituicao_id=? GROUP BY t.id,t.nome,t.instituicao_id,i.nome ORDER BY pontos DESC,t.nome";
            $params=[(int)($user['instituicao_id']??0)];
        }
        elseif ($type==='escola') $sql="SELECT i.id instituicao_id,i.nome instituicao_nome,SUM(u.pontos_totais) pontos,COUNT(u.id) alunos
          FROM usuario u JOIN perfil p ON p.id=u.perfil_id JOIN turma_escolar t ON t.id=u.turma_id
          JOIN instituicao i ON i.id=t.instituicao_id WHERE p.nome='aluno'
          GROUP BY i.id,i.nome ORDER BY pontos DESC,i.nome";
        else $this->json(['erro'=>'Tipo de ranking inválido'],422);
        $stmt=$this->db->prepare($sql); $stmt->execute($params); $rows=$stmt->fetchAll();
        foreach ($rows as $i=>&$row) $row['posicao']=$i+1;
        $position=null;if($type==='individual')foreach($rows as $row)if((int)$row['id']===(int)$user['id']){$position=(int)$row['posicao'];break;}
        $this->json(['tipo'=>$type,'ranking'=>$rows,'contexto_usuario'=>[
          'usuario_id'=>(int)$user['id'],'posicao'=>$position,'turma_id'=>isset($user['turma_id'])?(int)$user['turma_id']:null,
          'instituicao_id'=>isset($user['instituicao_id'])?(int)$user['instituicao_id']:null,'instituicao_nome'=>$user['instituicao_nome']??null,
        ]]);
    }

    private function unlockNextLesson(int $userId,int $lessonId): void
    {
        $stmt=$this->db->prepare('SELECT l2.id FROM licao l1 JOIN modulo m1 ON m1.id=l1.modulo_id JOIN licao l2 JOIN modulo m2 ON m2.id=l2.modulo_id WHERE l1.id=? AND (m2.ordem>m1.ordem OR (m2.ordem=m1.ordem AND l2.ordem>l1.ordem)) ORDER BY m2.ordem,l2.ordem LIMIT 1');
        $stmt->execute([$lessonId]); $next=$stmt->fetchColumn();
        if ($next) { $up=$this->db->prepare("INSERT INTO usuario_licao_progresso (usuario_id,licao_id,status) VALUES (?,?,'current') ON DUPLICATE KEY UPDATE status=IF(status='locked','current',status)"); $up->execute([$userId,(int)$next]); }
    }

    private function checkAchievements(int $userId): void
    {
        $stmt=$this->db->prepare('SELECT id,regra FROM conquista'); $stmt->execute();
        $insert=$this->db->prepare('INSERT IGNORE INTO usuario_conquista (usuario_id,conquista_id) VALUES (?,?)');
        foreach ($stmt->fetchAll() as $achievement) {
            $earned=false; $rule=$achievement['regra'];
            if ($rule==='licoes:1') { $q=$this->db->prepare("SELECT COUNT(*) FROM usuario_licao_progresso WHERE usuario_id=? AND status='completed'"); $q->execute([$userId]); $earned=(int)$q->fetchColumn()>=1; }
            elseif (str_starts_with($rule,'streak:')) { $q=$this->db->prepare('SELECT streak_dias FROM usuario WHERE id=?'); $q->execute([$userId]); $earned=(int)$q->fetchColumn()>=(int)substr($rule,7); }
            elseif (str_starts_with($rule,'modulo_completo:')) { $q=$this->db->prepare("SELECT COUNT(*)=SUM(CASE WHEN ulp.status='completed' THEN 1 ELSE 0 END) FROM licao l LEFT JOIN usuario_licao_progresso ulp ON ulp.licao_id=l.id AND ulp.usuario_id=? JOIN modulo m ON m.id=l.modulo_id WHERE m.ordem=?"); $q->execute([$userId,(int)substr($rule,16)]); $earned=(bool)$q->fetchColumn(); }
            elseif ($rule==='todos_modulos') { $q=$this->db->prepare("SELECT COUNT(*)=(SELECT COUNT(*) FROM usuario_licao_progresso WHERE usuario_id=? AND status='completed') FROM licao"); $q->execute([$userId]); $earned=(bool)$q->fetchColumn(); }
            if ($earned) $insert->execute([$userId,(int)$achievement['id']]);
        }
    }
}
