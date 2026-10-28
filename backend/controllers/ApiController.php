<?php

declare(strict_types=1);

namespace Viridis\controllers;

use DateTimeImmutable;
use PDO;
use Throwable;
use Viridis\middleware\AuthMiddleware;
use Viridis\models\Missao;
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

    public function missoes(): never
    {
        $this->auth->user();
        $this->json(['missoes'=>(new Missao($this->db))->all()]);
    }

    public function createSubmission(): never
    {
        $user = $this->auth->user(['aluno']);
        $publishedId = (int)($_POST['missao_publicada_id'] ?? 0) ?: null;
        $missionId = (int)($_POST['missao_id'] ?? 0) ?: null;
        $description = trim((string)($_POST['descricao'] ?? ''));
        if (mb_strlen($description) < 5) $this->json(['erro'=>'Descreva sua atividade com pelo menos 5 caracteres'],422);
        if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) $this->json(['erro'=>'Envie uma foto da atividade'],422);
        $file = $_FILES['foto'];
        if ((int)$file['size'] > $this->config['upload_max_bytes']) $this->json(['erro'=>'A foto deve ter no máximo 5 MB'],422);
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $extensions = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
        if (!isset($extensions[$mime])) $this->json(['erro'=>'Use uma foto JPG, PNG ou WebP'],422);

        $published = null;
        $publishedGroupId = null;
        if ($publishedId !== null) {
            $publishedStmt = $this->db->prepare("SELECT * FROM missao_publicada WHERE id=? AND turma_id=?");
            $publishedStmt->execute([$publishedId, (int)($user['turma_id'] ?? 0)]);
            $published = $publishedStmt->fetch();
            if (!$published) $this->json(['erro'=>'Missão não encontrada, encerrada ou de outra turma'],404);
            $participation = $this->db->prepare("SELECT grupo_id FROM agenda WHERE missao_publicada_id=? AND aluno_id=? AND status<>'cancelado' ORDER BY id DESC LIMIT 1");
            $participation->execute([$publishedId,(int)$user['id']]);
            $participationGroup = $participation->fetchColumn();
            if ($participationGroup === false) $this->json(['erro'=>'Você precisa aderir à missão antes de enviar a comprovação'],403);
            $publishedGroupId = $participationGroup === null ? null : (string)$participationGroup;
            $existingProof = $this->db->prepare("SELECT status FROM submissao_missao WHERE missao_publicada_id=? AND (status='approved' OR (status='pending' AND ((? IS NOT NULL AND grupo_id=?) OR (? IS NULL AND aluno_id=?)))) ORDER BY id DESC LIMIT 1");
            $existingProof->execute([$publishedId,$publishedGroupId,$publishedGroupId,$publishedGroupId,(int)$user['id']]);
            $proofStatus = $existingProof->fetchColumn();
            if ($proofStatus === 'approved') $this->json(['erro'=>'Esta missão já foi aprovada e não aceita novas comprovações'],409);
            if ($proofStatus === 'pending') $this->json(['erro'=>'Já existe uma comprovação desta equipe em avaliação'],409);
            if ($missionId === null && !empty($published['missao_id'])) $missionId = (int)$published['missao_id'];
            if ($missionId === null) {
                $fallback = $this->db->prepare('SELECT id FROM missao WHERE tipo=? ORDER BY id LIMIT 1');
                $fallback->execute([(string)$published['tipo']]);
                $missionId = (int)($fallback->fetchColumn() ?: 0) ?: null;
                if ($missionId === null) {
                    $fallbackAny = $this->db->query('SELECT id FROM missao ORDER BY id LIMIT 1');
                    $missionId = (int)($fallbackAny->fetchColumn() ?: 0) ?: null;
                }
            }
        }
        if ($missionId === null) $this->json(['erro'=>'Não há uma atividade-base compatível para registrar esta comprovação'],422);
        $mission = $this->db->prepare('SELECT id FROM missao WHERE id=?');
        $mission->execute([$missionId]);
        if (!$mission->fetchColumn()) $this->json(['erro'=>'Atividade não encontrada'],404);

        if (!is_dir($this->config['upload_dir']) && !mkdir($this->config['upload_dir'],0750,true) && !is_dir($this->config['upload_dir'])) {
            $this->json(['erro'=>'Não foi possível preparar o diretório de uploads'],500);
        }
        $name = bin2hex(random_bytes(16)).'.'.$extensions[$mime];
        if (!move_uploaded_file($file['tmp_name'],$this->config['upload_dir'].'/'.$name)) $this->json(['erro'=>'Não foi possível salvar a foto'],500);
        $stmt = $this->db->prepare("INSERT INTO submissao_missao (aluno_id,missao_id,missao_publicada_id,grupo_id,descricao,url_foto,status) VALUES (?,?,?,?,?,?,'pending')");
        $stmt->execute([(int)$user['id'],$missionId,$publishedId,$publishedGroupId,$description,'/uploads/'.$name]);
        $this->json(['mensagem'=>'Comprovação enviada para avaliação','id'=>(int)$this->db->lastInsertId()],201);
    }

    public function history(): never
    {
        $user = $this->auth->user();
        $userId = (int)$user['id'];
        $plants = $this->db->prepare(
            "SELECT s.id,s.descricao,s.url_foto,s.status,s.comentario_professor,
                    s.data_envio,s.revisado_em,COALESCE(mp.titulo,m.titulo) titulo
             FROM submissao_missao s JOIN missao m ON m.id=s.missao_id
             LEFT JOIN missao_publicada mp ON mp.id=s.missao_publicada_id
             WHERE s.aluno_id=? AND (m.tipo='plant' OR s.missao_publicada_id IS NOT NULL)
             ORDER BY s.data_envio DESC,s.id DESC"
        );
        $plants->execute([$userId]);
        $rewards = $this->db->prepare(
            'SELECT r.id,r.pontos_debitados,r.criado_em,c.titulo,p.nome parceiro
             FROM resgate r LEFT JOIN recompensa c ON c.id=r.recompensa_id
             LEFT JOIN parceiro p ON p.id=c.parceiro_id
             WHERE r.usuario_id=? ORDER BY r.criado_em DESC,r.id DESC'
        );
        $rewards->execute([$userId]);
        $this->json(['plantios'=>$plants->fetchAll(),'recompensas'=>$rewards->fetchAll()]);
    }

    public function submissions(): never
    {
        $this->auth->user(['professor','admin']);
        $status = $_GET['status'] ?? 'pending';
        if (!in_array($status,['pending','approved','rejected'],true)) $this->json(['erro'=>'Status inválido'],422);
        $stmt = $this->db->prepare(
            'SELECT s.id,s.descricao,s.url_foto,s.status,s.comentario_professor,s.data_envio,
                    u.id aluno_id,u.nome aluno,u.turma,m.id missao_id,COALESCE(mp.titulo,m.titulo) atividade,COALESCE(mp.tipo,m.tipo) tipo,COALESCE(mp.pontos,m.pontos_recompensa) pontos
             FROM submissao_missao s JOIN usuario u ON u.id=s.aluno_id JOIN missao m ON m.id=s.missao_id LEFT JOIN missao_publicada mp ON mp.id=s.missao_publicada_id
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
                'SELECT s.aluno_id,s.status,s.missao_publicada_id,s.grupo_id,COALESCE(mp.pontos,m.pontos_recompensa) pontos_recompensa FROM submissao_missao s JOIN missao m ON m.id=s.missao_id LEFT JOIN missao_publicada mp ON mp.id=s.missao_publicada_id WHERE s.id=? FOR UPDATE'
            );
            $stmt->execute([$id]); $submission=$stmt->fetch();
            if (!$submission) { $this->db->rollBack(); $this->json(['erro'=>'Submissão não encontrada'],404); }
            if ($submission['status']!=='pending') { $this->db->rollBack(); $this->json(['erro'=>'Esta atividade já foi revisada'],409); }
            $awardStudents = [(int)$submission['aluno_id']];
            $shouldCredit = $status === 'approved';
            if ($status === 'approved' && !empty($submission['missao_publicada_id'])) {
                $lockMission = $this->db->prepare('SELECT id FROM missao_publicada WHERE id=? FOR UPDATE');
                $lockMission->execute([(int)$submission['missao_publicada_id']]);
                if (!$lockMission->fetchColumn()) { $this->db->rollBack(); $this->json(['erro'=>'A missão publicada foi removida'],409); }
                // Só a equipe associada à comprovação participa da pontuação; uma missão publicada só gera pontuação uma vez.
                $previousScore = $this->db->prepare('SELECT 1 FROM missao_pontuacao WHERE missao_publicada_id=? LIMIT 1');
                $previousScore->execute([(int)$submission['missao_publicada_id']]);
                $shouldCredit = !$previousScore->fetchColumn();
                $submittedGroupId = !empty($submission['grupo_id']) ? (string)$submission['grupo_id'] : null;
                if ($submittedGroupId !== null) {
                    $roster = $this->db->prepare("SELECT DISTINCT aluno_id,COALESCE(grupo_id,CONCAT('legacy-',id)) grupo_pontuacao FROM agenda WHERE missao_publicada_id=? AND grupo_id=? AND status<>'cancelado'");
                    $roster->execute([(int)$submission['missao_publicada_id'],$submittedGroupId]);
                    $complete = $this->db->prepare("UPDATE agenda SET status='concluido' WHERE missao_publicada_id=? AND grupo_id=? AND status='agendado'");
                    $complete->execute([(int)$submission['missao_publicada_id'],$submittedGroupId]);
                } else {
                    $roster = $this->db->prepare("SELECT aluno_id,COALESCE(grupo_id,CONCAT('legacy-',id)) grupo_pontuacao FROM agenda WHERE missao_publicada_id=? AND aluno_id=? AND status<>'cancelado' ORDER BY id DESC LIMIT 1");
                    $roster->execute([(int)$submission['missao_publicada_id'],(int)$submission['aluno_id']]);
                    $complete = $this->db->prepare("UPDATE agenda SET status='concluido' WHERE missao_publicada_id=? AND aluno_id=? AND status='agendado'");
                    $complete->execute([(int)$submission['missao_publicada_id'],(int)$submission['aluno_id']]);
                }
                $awardStudents = $roster->fetchAll(PDO::FETCH_ASSOC);
                if (!$awardStudents) $awardStudents = [['aluno_id'=>(int)$submission['aluno_id'],'grupo_pontuacao'=>$submittedGroupId ?? ('legacy-submission-'.$id)]];
            }
            $update=$this->db->prepare("UPDATE submissao_missao SET status=?,professor_validado=?,comentario_professor=?,revisado_por=?,revisado_em=NOW() WHERE id=? AND status='pending'");
            $update->execute([$status,$status==='approved'?1:0,$comment?:null,(int)$reviewer['id'],$id]);
            if ($update->rowCount() !== 1) { $this->db->rollBack(); $this->json(['erro'=>'Esta atividade já foi revisada'],409); }
            $credited=0;
            $scoreProcessed=false;
            if ($shouldCredit) {
                $pointsPerStudent=(int)$submission['pontos_recompensa'];
                $points=$this->db->prepare('UPDATE usuario SET pontos_totais=pontos_totais+?,xp=xp+?,ultima_atividade_em=CURDATE() WHERE id=?');
                if (!empty($submission['missao_publicada_id'])) {
                    $mark=$this->db->prepare("INSERT IGNORE INTO missao_pontuacao (missao_publicada_id,grupo_id,aluno_id,pontos,fonte) VALUES (?,?,?,?,'submissao')");
                    foreach ($awardStudents as $member) {
                        $studentId=(int)$member['aluno_id'];
                        $mark->execute([(int)$submission['missao_publicada_id'],(string)$member['grupo_pontuacao'],$studentId,$pointsPerStudent]);
                        if ($mark->rowCount()===1) { $points->execute([$pointsPerStudent,$pointsPerStudent,$studentId]); $credited += $pointsPerStudent; $this->checkAchievements($studentId); $scoreProcessed=true; }
                    }
                } else {
                    $studentId=(int)$submission['aluno_id'];
                    $points->execute([$pointsPerStudent,$pointsPerStudent,$studentId]);
                    $credited=$pointsPerStudent;
                    $this->checkAchievements($studentId);
                    $scoreProcessed=true;
                }
            }
            $notification=$this->db->prepare('INSERT INTO notificacao (usuario_id,tipo,titulo,mensagem,link) VALUES (?,?,?,?,\'/jardim\')');
            $notification->execute([(int)$submission['aluno_id'],$status==='approved'?'atividade_aprovada':'atividade_rejeitada',$status==='approved'?'Comprovação aprovada!':'Comprovação rejeitada',$status==='approved'?($scoreProcessed?'Sua missão foi aprovada e a pontuação da atividade foi processada.':'Sua missão foi aprovada; a pontuação desta missão já havia sido processada.') : ($comment?:'Confira o comentário do professor.')]);
            $this->db->commit();
            $this->json(['mensagem'=>$status==='approved'?'Comprovação aprovada!':'Comprovação rejeitada','pontos_creditados'=>$credited]);
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
