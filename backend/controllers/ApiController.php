<?php

declare(strict_types=1);

namespace Viridis\controllers;

use DateTimeImmutable;
use PDO;
use Throwable;
use Viridis\middleware\AuthMiddleware;
use Viridis\models\Usuario;
use Viridis\services\LearningAccess;
use Viridis\services\LearningException;

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
        $this->json(['modulos' => (new LearningAccess($this->db))->modules($user)]);
    }

    public function quiz(int $lessonId): never
    {
        $user=$this->auth->user();
        (new LearningAccess($this->db))->playableLesson($user,$lessonId);
        $stmt = $this->db->prepare('SELECT id,texto_pergunta,pontos_recompensa FROM pergunta_quiz WHERE licao_id=? AND ativo=1 ORDER BY id');
        $stmt->execute([$lessonId]);
        $questions = $stmt->fetchAll();
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
            // Serialize with publication/editor changes and reject lessons outside the user's audience.
            $courseLock=$this->db->prepare('SELECT c.id FROM curso c JOIN modulo m ON m.curso_id=c.id JOIN licao l ON l.modulo_id=m.id WHERE l.id=? FOR UPDATE');
            $courseLock->execute([$lessonId]);
            (new LearningAccess($this->db))->playableLesson($user,$lessonId);
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
                 WHERE pq.id=? AND oq.id=? AND pq.licao_id=? AND pq.ativo=1'
            );
            $record = $this->db->prepare('INSERT INTO progresso_quiz (aluno_id,pergunta_id,acertou) VALUES (?,?,?)');
            $correct = 0; $points = 0;
            $expected=$this->db->prepare('SELECT id FROM pergunta_quiz WHERE licao_id=? AND ativo=1 ORDER BY id');$expected->execute([$lessonId]);
            $expectedIds=array_map('intval',$expected->fetchAll(PDO::FETCH_COLUMN));
            $answerIds=[];
            foreach ($answers as $answer) {
                if (!is_array($answer)) throw new LearningException('Resposta inválida',422);
                $answerIds[]=(int)($answer['pergunta_id']??0);
            }
            sort($answerIds);
            if ($expectedIds===[] || $answerIds!==$expectedIds) throw new LearningException('Responda cada pergunta desta lição exatamente uma vez',422);
            foreach ($answers as $answer) {
                $qid = (int)($answer['pergunta_id'] ?? 0); $oid = (int)($answer['opcao_id'] ?? 0);
                $check->execute([$qid,$oid,$lessonId]);
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
                $this->checkAchievements((int)$user['id']);
            }
            $this->db->commit();
            $this->json(['mensagem'=>'Quiz concluído!','acertos'=>$correct,'total'=>count($answers),'xp_ganho'=>$xp,'pontos_ganhos'=>$alreadyCompleted?0:$points,'ja_concluida'=>$alreadyCompleted]);
        } catch (Throwable $e) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            throw $e;
        }
    }

    /**
     * Comprovação de uma missão (foto + descrição). Pertence à equipe que reservou o turno:
     * qualquer integrante pode enviar, e só pode haver um envio em análise ou aprovado por turno.
     */
    public function createSubmission(): never
    {
        $user = $this->auth->user(['aluno']);
        $missionId = (int)($_POST['missao_id'] ?? 0);
        $description = trim((string)($_POST['descricao'] ?? ''));
        if (mb_strlen($description) < 5) $this->json(['erro'=>'Descreva sua atividade com pelo menos 5 caracteres'],422);
        if (mb_strlen($description) > 280) $this->json(['erro'=>'A descrição deve ter no máximo 280 caracteres'],422);
        if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) $this->json(['erro'=>'Envie uma foto da atividade'],422);
        $file = $_FILES['foto'];
        if ((int)$file['size'] > $this->config['upload_max_bytes']) $this->json(['erro'=>'A foto deve ter no máximo 5 MB'],422);
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $extensions = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
        if (!isset($extensions[$mime])) $this->json(['erro'=>'Use uma foto JPG, PNG ou WebP'],422);
        $saved = null;
        try {
            $this->db->beginTransaction();
            $mission = $this->db->prepare('SELECT id,turma_id FROM missao WHERE id=? FOR UPDATE');
            $mission->execute([$missionId]);
            $row = $mission->fetch();
            if (!$row || (int)$row['turma_id'] !== (int)($user['turma_id'] ?? 0)) { $this->db->rollBack(); $this->json(['erro'=>'Missão não encontrada'],404); }
            $turn = $this->db->prepare("SELECT grupo_id FROM agenda WHERE missao_id=? AND aluno_id=? AND status='agendado' ORDER BY id DESC LIMIT 1");
            $turn->execute([$missionId,(int)$user['id']]);
            $groupId = $turn->fetchColumn();
            if (!$groupId) { $this->db->rollBack(); $this->json(['erro'=>'Reserve um turno desta missão antes de enviar a comprovação'],403); }
            $done = $this->db->prepare("SELECT 1 FROM agenda WHERE missao_id=? AND status='concluido' LIMIT 1");
            $done->execute([$missionId]);
            if ($done->fetchColumn()) { $this->db->rollBack(); $this->json(['erro'=>'Esta missão já foi concluída'],409); }
            $duplicate = $this->db->prepare("SELECT 1 FROM submissao_missao WHERE missao_id=? AND grupo_id=? AND status IN ('pending','approved') LIMIT 1");
            $duplicate->execute([$missionId,$groupId]);
            if ($duplicate->fetchColumn()) { $this->db->rollBack(); $this->json(['erro'=>'Sua equipe já enviou a comprovação desta missão'],409); }
            if (!is_dir($this->config['upload_dir'])) mkdir($this->config['upload_dir'],0750,true);
            $name = bin2hex(random_bytes(16)).'.'.$extensions[$mime];
            if (!move_uploaded_file($file['tmp_name'],$this->config['upload_dir'].'/'.$name)) { $this->db->rollBack(); $this->json(['erro'=>'Não foi possível salvar a foto'],500); }
            $saved = $this->config['upload_dir'].'/'.$name;
            $stmt = $this->db->prepare("INSERT INTO submissao_missao (aluno_id,missao_id,grupo_id,descricao,url_foto,status) VALUES (?,?,?,?,?,'pending')");
            $stmt->execute([(int)$user['id'],$missionId,$groupId,$description,'/uploads/'.$name]);
            $id = (int)$this->db->lastInsertId();
            $this->db->commit();
            $this->json(['mensagem'=>'Comprovação enviada para verificação','id'=>$id],201);
        } catch (Throwable $e) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            if ($saved !== null && is_file($saved)) unlink($saved);
            throw $e;
        }
    }

    public function history(): never
    {
        $user = $this->auth->user();
        $userId = (int)$user['id'];
        // Envios feitos pelo aluno ou por alguém da equipe dele na mesma missão.
        $submissions = $this->db->prepare(
            "SELECT s.id,s.descricao,s.url_foto,s.status,s.comentario_professor,
                    s.data_envio,s.revisado_em,m.titulo,m.tipo,
                    (SELECT GROUP_CONCAT(DISTINCT mu.nome ORDER BY mu.nome SEPARATOR ', ') FROM agenda a JOIN usuario mu ON mu.id=a.aluno_id
                     WHERE a.missao_id=s.missao_id AND a.grupo_id=s.grupo_id AND a.status<>'cancelado') equipe
             FROM submissao_missao s JOIN missao m ON m.id=s.missao_id
             WHERE s.aluno_id=? OR (s.grupo_id IS NOT NULL AND EXISTS(
                 SELECT 1 FROM agenda a WHERE a.missao_id=s.missao_id AND a.grupo_id=s.grupo_id AND a.aluno_id=? AND a.status<>'cancelado'))
             ORDER BY s.data_envio DESC,s.id DESC"
        );
        $submissions->execute([$userId,$userId]);
        $rewards = $this->db->prepare(
            'SELECT r.id,r.pontos_debitados,r.criado_em,c.titulo,p.nome parceiro
             FROM resgate r LEFT JOIN recompensa c ON c.id=r.recompensa_id
             LEFT JOIN parceiro p ON p.id=c.parceiro_id
             WHERE r.usuario_id=? ORDER BY r.criado_em DESC,r.id DESC'
        );
        $rewards->execute([$userId]);
        $this->json(['envios'=>$submissions->fetchAll(),'recompensas'=>$rewards->fetchAll()]);
    }

    public function submissions(): never
    {
        $this->auth->user(['professor','admin']);
        $status = $_GET['status'] ?? 'pending';
        if (!in_array($status,['pending','approved','rejected'],true)) $this->json(['erro'=>'Status inválido'],422);
        $stmt = $this->db->prepare(
            "SELECT s.id,s.descricao,s.url_foto,s.status,s.comentario_professor,s.data_envio,s.grupo_id,
                    u.id aluno_id,u.nome aluno,u.turma,m.id missao_id,m.titulo atividade,m.tipo,m.pontos_recompensa pontos,
                    (SELECT GROUP_CONCAT(DISTINCT mu.nome ORDER BY mu.nome SEPARATOR ', ') FROM agenda a JOIN usuario mu ON mu.id=a.aluno_id
                     WHERE a.missao_id=s.missao_id AND a.grupo_id=s.grupo_id AND a.status<>'cancelado') equipe
             FROM submissao_missao s JOIN usuario u ON u.id=s.aluno_id JOIN missao m ON m.id=s.missao_id
             WHERE s.status=? ORDER BY s.data_envio"
        );
        $stmt->execute([$status]);
        $this->json(['submissoes'=>$stmt->fetchAll()]);
    }

    /**
     * Aprovar credita os pontos da missão a CADA integrante do turno (uma única vez) e conclui o turno
     * no calendário. Rejeitar mantém o turno agendado para a equipe reenviar a comprovação.
     */
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
                'SELECT s.aluno_id,s.status,s.missao_id,s.grupo_id,m.pontos_recompensa,m.titulo FROM submissao_missao s JOIN missao m ON m.id=s.missao_id WHERE s.id=? FOR UPDATE'
            );
            $stmt->execute([$id]); $submission=$stmt->fetch();
            if (!$submission) { $this->db->rollBack(); $this->json(['erro'=>'Submissão não encontrada'],404); }
            if ($submission['status']!=='pending') { $this->db->rollBack(); $this->json(['erro'=>'Esta atividade já foi revisada'],409); }
            $groupId = $submission['grupo_id'];
            $members = [(int)$submission['aluno_id']];
            if ($groupId !== null) {
                $rows = $this->db->prepare("SELECT aluno_id FROM agenda WHERE missao_id=? AND grupo_id=? AND status<>'cancelado' ORDER BY id FOR UPDATE");
                $rows->execute([(int)$submission['missao_id'],$groupId]);
                $members = array_values(array_unique(array_map('intval',$rows->fetchAll(PDO::FETCH_COLUMN))));
                if ($status==='approved') {
                    if ($members === []) { $this->db->rollBack(); $this->json(['erro'=>'O turno desta equipe foi cancelado'],409); }
                    $done = $this->db->prepare("SELECT 1 FROM agenda WHERE missao_id=? AND status='concluido' AND grupo_id<>? LIMIT 1");
                    $done->execute([(int)$submission['missao_id'],$groupId]);
                    if ($done->fetchColumn()) { $this->db->rollBack(); $this->json(['erro'=>'Esta missão já foi concluída por outra equipe. Rejeite este envio.'],409); }
                }
            }
            $update=$this->db->prepare('UPDATE submissao_missao SET status=?,professor_validado=?,comentario_professor=?,revisado_por=?,revisado_em=NOW() WHERE id=?');
            $update->execute([$status,$status==='approved'?1:0,$comment?:null,(int)$reviewer['id'],$id]);
            $credited=0;
            if ($status==='approved') {
                $credited=(int)$submission['pontos_recompensa'];
                $points=$this->db->prepare('UPDATE usuario SET pontos_totais=pontos_totais+?, ultima_atividade_em=CURDATE() WHERE id=?');
                foreach ($members as $memberId) {
                    $points->execute([$credited,$memberId]);
                    $this->checkAchievements($memberId);
                }
                if ($groupId !== null) {
                    $this->db->prepare("UPDATE agenda SET status='concluido' WHERE missao_id=? AND grupo_id=? AND status='agendado'")->execute([(int)$submission['missao_id'],$groupId]);
                }
            }
            $team = count($members) > 1;
            $notification=$this->db->prepare('INSERT INTO notificacao (usuario_id,tipo,titulo,mensagem,link) VALUES (?,?,?,?,\'/jardim\')');
            $message = $status==='approved'
                ? ($team ? 'Sua equipe concluiu "'.$submission['titulo'].'". Seus pontos já foram creditados.' : 'Seus pontos já foram creditados.')
                : ($comment?:'Confira o comentário do professor.');
            foreach (array_values(array_unique(array_merge($members,[(int)$submission['aluno_id']]))) as $memberId) {
                $notification->execute([$memberId,$status==='approved'?'atividade_aprovada':'atividade_rejeitada',$status==='approved'?'Missão aprovada!':'Missão rejeitada',$message]);
            }
            $this->db->commit();
            $this->json(['mensagem'=>$status==='approved'?'Missão aprovada!':'Missão rejeitada','pontos_creditados'=>$credited,'integrantes'=>count($members)]);
        } catch (Throwable $e) { if ($this->db->inTransaction()) $this->db->rollBack(); throw $e; }
    }

    public function rewards(): never
    {
        $user=$this->auth->user();
        $stmt=$this->db->prepare("SELECT r.id,r.titulo,r.escopo,r.pontos_necessarios pontos,r.imagem,p.id parceiro_id,p.nome parceiro,p.tipo FROM recompensa r LEFT JOIN parceiro p ON p.id=r.parceiro_id WHERE r.ativo=1 AND (p.id IS NULL OR p.ativo=1) AND (r.escopo='app' OR (r.escopo='escola' AND r.instituicao_id=?)) ORDER BY r.escopo DESC,r.pontos_necessarios");
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

    private function checkAchievements(int $userId): void
    {
        $u=$this->db->prepare('SELECT u.id,u.turma_id,COALESCE(t.instituicao_id,u.instituicao_id) instituicao_id FROM usuario u LEFT JOIN turma_escolar t ON t.id=u.turma_id WHERE u.id=?');$u->execute([$userId]);
        $modules=(new LearningAccess($this->db))->modules($u->fetch());
        $stmt=$this->db->prepare('SELECT id,regra FROM conquista'); $stmt->execute();
        $insert=$this->db->prepare('INSERT IGNORE INTO usuario_conquista (usuario_id,conquista_id) VALUES (?,?)');
        foreach ($stmt->fetchAll() as $achievement) {
            $earned=false; $rule=$achievement['regra'];
            if ($rule==='licoes:1') { $q=$this->db->prepare("SELECT COUNT(*) FROM usuario_licao_progresso WHERE usuario_id=? AND status='completed'"); $q->execute([$userId]); $earned=(int)$q->fetchColumn()>=1; }
            elseif (str_starts_with($rule,'streak:')) { $q=$this->db->prepare('SELECT streak_dias FROM usuario WHERE id=?'); $q->execute([$userId]); $earned=(int)$q->fetchColumn()>=(int)substr($rule,7); }
            elseif (str_starts_with($rule,'modulo_completo:')) { $earned=count(array_filter($modules,fn($m)=>$m['ordem']===(int)substr($rule,16) && $m['progresso']===100))>0; }
            elseif ($rule==='todos_modulos') { $earned=count($modules)>0 && count(array_filter($modules,fn($m)=>$m['progresso']===100))===count($modules); }
            if ($earned) $insert->execute([$userId,(int)$achievement['id']]);
        }
    }
}
