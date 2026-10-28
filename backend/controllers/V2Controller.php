<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use Throwable;
use DateTimeImmutable;
use Viridis\middleware\AuthMiddleware;

final class V2Controller extends Controller
{
    public function __construct(private PDO $db, private AuthMiddleware $auth, private array $config) {}

    public function notifications(string $action, ?int $id = null): never
    {
        $user=$this->auth->user();
        if ($action==='count') {
            $stmt=$this->db->prepare('SELECT COUNT(*) FROM notificacao WHERE usuario_id=? AND lida=0');
            $stmt->execute([(int)$user['id']]);
            $this->json(['contagem'=>(int)$stmt->fetchColumn()]);
        }
        if ($action==='list') {
            $stmt=$this->db->prepare('SELECT id,tipo,titulo,mensagem,lida,link,criada_em FROM notificacao WHERE usuario_id=? ORDER BY criada_em DESC LIMIT 100');
            $stmt->execute([(int)$user['id']]);
            $this->json(['notificacoes'=>$stmt->fetchAll()]);
        }
        if ($action==='all') {
            $stmt=$this->db->prepare('UPDATE notificacao SET lida=1 WHERE usuario_id=? AND lida=0');
            $stmt->execute([(int)$user['id']]);
            $this->json(['mensagem'=>'Todas as notificações foram marcadas como lidas']);
        }
        $stmt=$this->db->prepare('UPDATE notificacao SET lida=1 WHERE id=? AND usuario_id=?');
        $stmt->execute([$id,(int)$user['id']]);
        if (!$stmt->rowCount()) $this->json(['erro'=>'Notificação não encontrada'],404);
        $this->json(['mensagem'=>'Notificação lida']);
    }

    public function studentAgenda(): never
    {
        $user=$this->auth->user(['aluno']);
        $stmt=$this->db->prepare("SELECT a.id,a.missao_publicada_id,a.grupo_id,a.titulo,a.data_hora,CASE WHEN a.status='cancelado' THEN 'cancelado' WHEN a.status='concluido' OR EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.missao_publicada_id=a.missao_publicada_id AND sm.status='approved') OR EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.aluno_id=a.aluno_id AND sm.missao_publicada_id=a.missao_publicada_id AND sm.status='approved') THEN 'concluido' WHEN a.status='agendado' AND a.data_hora<CURDATE() THEN 'nao_realizada' ELSE a.status END status,a.missao_id,m.titulo missao,ta.descricao,ta.instrucoes,ta.imagem,ta.tipo,ta.requer_submissao,t.nome turma,student.nome aluno,student.id aluno_id,teacher.nome professor,ta.pontos task_points,(SELECT COUNT(DISTINCT members.aluno_id) FROM agenda members WHERE members.missao_publicada_id=a.missao_publicada_id AND members.grupo_id=a.grupo_id AND members.status<>'cancelado' AND (members.data_hora>=CURDATE() OR members.status='concluido')) participantes,(SELECT GROUP_CONCAT(CONCAT(sm.descricao,' | ',sm.url_foto) SEPARATOR '\\n') FROM submissao_missao sm WHERE sm.aluno_id=a.aluno_id AND (sm.missao_publicada_id=a.missao_publicada_id OR (a.missao_publicada_id IS NULL AND sm.missao_id=a.missao_id))) resultados,(SELECT c.id FROM missao_convite c WHERE c.missao_publicada_id=a.missao_publicada_id AND c.grupo_id=a.grupo_id AND c.convidado_id=? AND c.status='pendente' LIMIT 1) convite_id FROM agenda a JOIN usuario student ON student.id=a.aluno_id AND student.turma_id=? LEFT JOIN missao m ON m.id=a.missao_id LEFT JOIN missao_publicada ta ON ta.id=a.missao_publicada_id LEFT JOIN turma_escolar t ON t.id=student.turma_id JOIN usuario teacher ON teacher.id=a.professor_id ORDER BY a.data_hora,student.nome");
        $stmt->execute([(int)$user['id'],(int)($user['turma_id']??0)]);
        $tasks=$this->db->prepare("SELECT ta.id,ta.titulo,ta.descricao,ta.instrucoes,ta.imagem,ta.tipo,ta.missao_id,ta.pontos,ta.max_alunos,ta.modo_participacao,ta.requer_submissao,ta.ativa,m.titulo missao,u.nome professor,
            CASE WHEN EXISTS(SELECT 1 FROM agenda done WHERE done.missao_publicada_id=ta.id AND done.status='concluido') OR EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.missao_publicada_id=ta.id AND sm.status='approved') THEN 'concluida'
                 WHEN EXISTS(SELECT 1 FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status='agendado' AND a.data_hora>=NOW()) THEN 'agendada' ELSE 'disponivel' END status,
            (SELECT COUNT(DISTINCT a.aluno_id) FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status<>'cancelado') participantes,
            (SELECT a.data_hora FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status<>'cancelado' ORDER BY a.id LIMIT 1) horario,
            (SELECT a.grupo_id FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status<>'cancelado' ORDER BY a.id LIMIT 1) grupo_id,
            (SELECT c.id FROM missao_convite c WHERE c.missao_publicada_id=ta.id AND c.convidado_id=? AND c.status='pendente' LIMIT 1) convite_id,
            EXISTS(SELECT 1 FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.aluno_id=? AND a.status<>'cancelado') participando
            FROM missao_publicada ta JOIN usuario u ON u.id=ta.criador_id LEFT JOIN missao m ON m.id=ta.missao_id
            WHERE ta.turma_id=? AND (
                (ta.ativa=1 AND NOT EXISTS(SELECT 1 FROM agenda finished WHERE finished.missao_publicada_id=ta.id AND finished.status='concluido') AND NOT EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.missao_publicada_id=ta.id AND sm.status='approved') AND (
                    NOT EXISTS(SELECT 1 FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status<>'cancelado')
                    OR (ta.max_alunos>1 AND ta.modo_participacao='aberto' AND EXISTS(SELECT 1 FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status<>'cancelado'))
                ))
                OR (ta.ativa=1 AND NOT EXISTS(SELECT 1 FROM agenda finished WHERE finished.missao_publicada_id=ta.id AND finished.status='concluido') AND ta.max_alunos>1 AND NOT EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.missao_publicada_id=ta.id AND sm.status='approved') AND EXISTS(SELECT 1 FROM missao_convite c WHERE c.missao_publicada_id=ta.id AND c.convidado_id=? AND c.status='pendente'))
                OR EXISTS(SELECT 1 FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.aluno_id=? AND a.status<>'cancelado')
            ) ORDER BY ta.criado_em DESC");
        $tasks->execute([(int)$user['id'],(int)$user['id'],(int)($user['turma_id']??0),(int)$user['id'],(int)$user['id']]);
        $this->json(['agenda'=>$stmt->fetchAll(),'missoes_publicadas'=>$tasks->fetchAll()]);
    }
    public function teacherAgenda(): never
    {
        $user=$this->auth->user(['professor','admin']);
        $stmt=$this->db->prepare("SELECT a.id,a.missao_publicada_id,a.grupo_id,a.titulo,a.data_hora,CASE WHEN a.status='cancelado' THEN 'cancelado' WHEN a.status='concluido' OR EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.missao_publicada_id=a.missao_publicada_id AND sm.status='approved') OR EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.aluno_id=a.aluno_id AND sm.missao_publicada_id=a.missao_publicada_id AND sm.status='approved') THEN 'concluido' WHEN a.status='agendado' AND a.data_hora<CURDATE() THEN 'nao_realizada' ELSE a.status END status,a.missao_id,m.titulo missao,ta.descricao,ta.instrucoes,ta.imagem,ta.tipo,ta.requer_submissao,t.id turma_id,t.nome turma,u.id aluno_id,u.nome aluno,ta.pontos task_points,(SELECT GROUP_CONCAT(CONCAT(sm.descricao,' | ',sm.url_foto) SEPARATOR '\\n') FROM submissao_missao sm WHERE sm.aluno_id=a.aluno_id AND (sm.missao_publicada_id=a.missao_publicada_id OR (a.missao_publicada_id IS NULL AND sm.missao_id=a.missao_id))) resultados,(SELECT COUNT(DISTINCT peers.aluno_id) FROM agenda peers WHERE peers.missao_publicada_id=a.missao_publicada_id AND peers.grupo_id=a.grupo_id AND peers.status<>'cancelado' AND (peers.data_hora>=CURDATE() OR peers.status='concluido')) participantes FROM agenda a JOIN usuario u ON u.id=a.aluno_id LEFT JOIN missao_publicada ta ON ta.id=a.missao_publicada_id LEFT JOIN turma_escolar t ON t.id=a.turma_id LEFT JOIN missao m ON m.id=a.missao_id WHERE t.instituicao_id=? AND (?='admin' OR EXISTS (SELECT 1 FROM turma_professor tp WHERE tp.turma_id=a.turma_id AND tp.professor_id=?)) ORDER BY a.data_hora,u.nome");
        $stmt->execute([(int)$user['instituicao_id'],$user['perfil_nome'],(int)$user['id']]); $agenda=$stmt->fetchAll();
        $turmasStmt=$this->db->prepare('SELECT DISTINCT t.id,t.nome,t.ano_letivo FROM turma_escolar t LEFT JOIN turma_professor tp ON tp.turma_id=t.id WHERE t.instituicao_id=? AND (?=\'admin\' OR tp.professor_id=?) ORDER BY t.nome');
        $turmasStmt->execute([(int)$user['instituicao_id'],$user['perfil_nome'],(int)$user['id']]); $turmas=$turmasStmt->fetchAll();
        $students=$this->db->prepare("SELECT id,nome,turma FROM usuario WHERE turma_id=? AND perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1) ORDER BY nome");
        foreach ($turmas as &$turma) { $students->execute([(int)$turma['id']]); $turma['alunos']=$students->fetchAll(); }
        $tasksStmt=$this->db->prepare("SELECT ta.id,ta.titulo,ta.descricao,ta.instrucoes,ta.imagem,ta.tipo,ta.missao_id,ta.pontos,ta.max_alunos,ta.modo_participacao,m.titulo missao,ta.ativa,ta.criado_em,u.nome professor,t.id turma_id,t.nome turma,CASE WHEN EXISTS(SELECT 1 FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status='concluido') OR EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.missao_publicada_id=ta.id AND sm.status='approved') THEN 'concluida' WHEN EXISTS(SELECT 1 FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status='agendado' AND a.data_hora>=CURDATE()) THEN 'agendada' ELSE 'disponivel' END status,(SELECT COUNT(*) FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status='agendado' AND a.data_hora>=CURDATE()) participantes FROM missao_publicada ta JOIN usuario u ON u.id=ta.criador_id JOIN turma_escolar t ON t.id=ta.turma_id LEFT JOIN missao m ON m.id=ta.missao_id WHERE (?='admin' OR EXISTS (SELECT 1 FROM turma_professor tp WHERE tp.turma_id=t.id AND tp.professor_id=?)) ORDER BY ta.criado_em DESC");
        $tasksStmt->execute([$user['perfil_nome'],(int)$user['id']]);
        $this->json(['agenda'=>$agenda,'turmas'=>$turmas,'missoes_publicadas'=>$tasksStmt->fetchAll()]);
    }

    public function directorAgenda(): never
    {
        $user=$this->auth->user(['diretor']);
        $stmt=$this->db->prepare("SELECT a.id,a.missao_publicada_id,a.grupo_id,a.titulo,a.data_hora,CASE WHEN a.status='cancelado' THEN 'cancelado' WHEN a.status='concluido' OR EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.missao_publicada_id=a.missao_publicada_id AND sm.status='approved') OR EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.aluno_id=a.aluno_id AND sm.missao_publicada_id=a.missao_publicada_id AND sm.status='approved') THEN 'concluido' WHEN a.status='agendado' AND a.data_hora<CURDATE() THEN 'nao_realizada' ELSE a.status END status,a.missao_id,m.titulo missao,ta.descricao,ta.instrucoes,ta.imagem,ta.tipo,ta.requer_submissao,t.id turma_id,t.nome turma,u.id aluno_id,u.nome aluno,(SELECT GROUP_CONCAT(CONCAT(sm.descricao,' | ',sm.url_foto) SEPARATOR '\\n') FROM submissao_missao sm WHERE sm.aluno_id=a.aluno_id AND (sm.missao_publicada_id=a.missao_publicada_id OR (a.missao_publicada_id IS NULL AND sm.missao_id=a.missao_id))) resultados FROM agenda a JOIN usuario u ON u.id=a.aluno_id LEFT JOIN missao_publicada ta ON ta.id=a.missao_publicada_id LEFT JOIN turma_escolar t ON t.id=a.turma_id LEFT JOIN missao m ON m.id=a.missao_id WHERE t.instituicao_id=? ORDER BY a.data_hora,u.nome");
        $stmt->execute([(int)$user['instituicao_id']]);
        $tasks=$this->db->prepare("SELECT ta.id,ta.titulo,ta.descricao,ta.instrucoes,ta.imagem,ta.tipo,ta.missao_id,ta.pontos,ta.max_alunos,ta.modo_participacao,m.titulo missao,ta.ativa,ta.criado_em,p.nome professor,t.id turma_id,t.nome turma,CASE WHEN EXISTS(SELECT 1 FROM agenda done WHERE done.missao_publicada_id=ta.id AND done.status='concluido') OR EXISTS(SELECT 1 FROM submissao_missao sm WHERE sm.missao_publicada_id=ta.id AND sm.status='approved') THEN 'concluida' WHEN EXISTS(SELECT 1 FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status='agendado' AND a.data_hora>=NOW()) THEN 'agendada' ELSE 'disponivel' END status,(SELECT a.data_hora FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status<>'cancelado' ORDER BY a.id LIMIT 1) horario,(SELECT COUNT(*) FROM agenda a WHERE a.missao_publicada_id=ta.id AND a.status<>'cancelado') participantes FROM missao_publicada ta JOIN usuario p ON p.id=ta.criador_id JOIN turma_escolar t ON t.id=ta.turma_id LEFT JOIN missao m ON m.id=ta.missao_id WHERE t.instituicao_id=? ORDER BY ta.criado_em DESC");
        $tasks->execute([(int)$user['instituicao_id']]);
        $classes=$this->db->prepare('SELECT id,nome,ano_letivo FROM turma_escolar WHERE instituicao_id=? ORDER BY nome');
        $classes->execute([(int)$user['instituicao_id']]); $turmas=$classes->fetchAll();
        $students=$this->db->prepare("SELECT id,nome,turma FROM usuario WHERE turma_id=? AND perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1) ORDER BY nome");
        foreach($turmas as &$class){$students->execute([(int)$class['id']]);$class['alunos']=$students->fetchAll();}
        $this->json(['agenda'=>$stmt->fetchAll(),'missoes_publicadas'=>$tasks->fetchAll(),'turmas'=>$turmas]);
    }

    public function createAgenda(): never
    {
        $teacher=$this->auth->user(['professor','admin']); $data=$this->input(); $classId=(int)($data['turma_id']??0);
        $title=trim((string)($data['titulo']??''));
        $points=(int)($data['pontos']??0); $maxStudents=(int)($data['max_alunos']??1);
        if($classId<1||$title===''||mb_strlen($title)>150||$points<0||$points>10000||$maxStudents<1||$maxStudents>100)$this->json(['erro'=>'Confira turma, título, pontos e máximo de alunos'],422);
        $classCheck=$this->db->prepare("SELECT 1 FROM turma_escolar t LEFT JOIN turma_professor tp ON tp.turma_id=t.id AND tp.professor_id=? WHERE t.id=? AND t.instituicao_id=? AND (?='admin' OR tp.professor_id IS NOT NULL)");
        $classCheck->execute([(int)$teacher['id'],$classId,(int)$teacher['instituicao_id'],$teacher['perfil_nome']]);
        if(!$classCheck->fetchColumn())$this->json(['erro'=>'Você não é responsável por esta turma'],403);
        $missionId=(int)($data['missao_id']??0)?:null;
        $baseType='outro';
        if($missionId){$check=$this->db->prepare('SELECT tipo FROM missao WHERE id=?');$check->execute([$missionId]);$baseType=$check->fetchColumn();if($baseType===false)$this->json(['erro'=>'Missão de referência não encontrada'],422);}
        $type=(string)($data['tipo']??$baseType);
        if(!in_array($type,['plant','water','compost','share','outro'],true))$this->json(['erro'=>'Tipo de missão inválido'],422);
        $description=trim((string)($data['descricao']??''));
        $instructions=trim((string)($data['instrucoes']??''));
        $image=trim((string)($data['imagem']??''));
        if(mb_strlen($description)>5000||mb_strlen($instructions)>10000||mb_strlen($image)>500)$this->json(['erro'=>'Descrição, instruções ou imagem excedem o limite permitido'],422);
        if($image!==''&&!filter_var($image,FILTER_VALIDATE_URL))$this->json(['erro'=>'Informe uma URL válida para a imagem da missão'],422);
        $mode=$maxStudents<=1?'aberto':(string)($data['modo_participacao']??'aberto');
        if(!in_array($mode,['aberto','particular'],true))$this->json(['erro'=>'Modo de participação inválido'],422);
        $stmt=$this->db->prepare('INSERT INTO missao_publicada (turma_id,criador_id,missao_id,titulo,descricao,instrucoes,imagem,tipo,pontos,max_alunos,modo_participacao,ativa) VALUES (?,?,?,?,?,?,?,?,?,?,?,1)');
        $stmt->execute([$classId,(int)$teacher['id'],$missionId,$title,$description,$instructions?:null,$image?:null,$type,$points,$maxStudents,$mode]);
        $this->json(['mensagem'=>'Missão publicada para a turma','id'=>(int)$this->db->lastInsertId()],201);
    }

    public function acceptTask(int $id): never
    {
        $student=$this->auth->user(['aluno']); $data=$this->input(); $parsed=$this->parseTaskDate(trim((string)($data['data_hora']??'')));
        if(!$parsed)$this->json(['erro'=>'Escolha uma data e um horário futuros'],422);
        $taskStmt=$this->db->prepare('SELECT * FROM missao_publicada WHERE id=? AND turma_id=? AND ativa=1'); $taskStmt->execute([$id,(int)($student['turma_id']??0)]); $task=$taskStmt->fetch();
        if(!$task)$this->json(['erro'=>'Missão não encontrada ou encerrada'],404);
        $groupId=bin2hex(random_bytes(16)); $this->reserveTaskSlot($id,$task,$student,$parsed,$groupId,(string)$task['modo_participacao']);
        $this->json(['mensagem'=>'Missão aceita e turno reservado','grupo_id'=>$groupId],201);
    }

    public function joinTask(int $id): never
    {
        $student=$this->auth->user(['aluno']); $data=$this->input(); $groupId=(string)($data['grupo_id']??'');
        if(!preg_match('/^[a-f0-9]{32}$/',$groupId))$this->json(['erro'=>'Turno inválido'],422);
        $taskStmt=$this->db->prepare('SELECT * FROM missao_publicada WHERE id=? AND turma_id=? AND ativa=1'); $taskStmt->execute([$id,(int)($student['turma_id']??0)]); $task=$taskStmt->fetch();
        if(!$task)$this->json(['erro'=>'Missão não encontrada'],404);
        if((int)$task['max_alunos']<=1)$this->json(['erro'=>'Esta é uma missão individual'],409);
        $group=$this->db->prepare("SELECT data_hora FROM agenda WHERE missao_publicada_id=? AND grupo_id=? AND status='agendado' AND data_hora>=NOW() ORDER BY id LIMIT 1"); $group->execute([$id,$groupId]); $slot=$group->fetch();
        if(!$slot)$this->json(['erro'=>'Esse turno não está disponível'],404);
        if($task['modo_participacao']!=='aberto')$this->json(['erro'=>'O responsável escolheu participação particular'],403);
        $this->addTaskParticipant($id,$groupId,$task,$student,$slot['data_hora']); $this->json(['mensagem'=>'Você entrou no turno da missão']);
    }

    public function inviteTask(int $id): never
    {
        $student=$this->auth->user(['aluno']);
        $data=$this->input();
        $invitee=(int)($data['aluno_id']??0);
        $groupId=(string)($data['grupo_id']??'');
        if(!preg_match('/^[a-f0-9]{32}$/',$groupId)||$invitee<1||$invitee===(int)$student['id'])$this->json(['erro'=>'Selecione um aluno da turma'],422);
        try {
            // Serializa convites por missão para que requisições simultâneas não excedam a capacidade.
            $this->db->beginTransaction();
            $taskStmt=$this->db->prepare('SELECT * FROM missao_publicada WHERE id=? AND turma_id=? AND ativa=1 FOR UPDATE');
            $taskStmt->execute([$id,(int)($student['turma_id']??0)]);
            $task=$taskStmt->fetch();
            if(!$task)$this->json(['erro'=>'Missão não encontrada'],404);
            if((int)$task['max_alunos']<=1)$this->json(['erro'=>'Convites só estão disponíveis para missões em equipe'],409);
            $owner=$this->db->prepare("SELECT 1 FROM agenda WHERE missao_publicada_id=? AND grupo_id=? AND aluno_id=? AND status='agendado' AND data_hora>=NOW()");
            $owner->execute([$id,$groupId,(int)$student['id']]);
            if(!$owner->fetchColumn())$this->json(['erro'=>'Somente alguém da equipe com turno futuro pode convidar'],403);
            if($task['modo_participacao']!=='particular')$this->json(['erro'=>'Esta missão permite participação aberta'],409);
            $check=$this->db->prepare("SELECT 1 FROM usuario u JOIN perfil p ON p.id=u.perfil_id WHERE u.id=? AND u.turma_id=? AND p.nome='aluno'");
            $check->execute([$invitee,(int)$student['turma_id']]);
            if(!$check->fetchColumn())$this->json(['erro'=>'O convidado precisa ser aluno da mesma turma'],422);
            $alreadyMember=$this->db->prepare("SELECT 1 FROM agenda WHERE missao_publicada_id=? AND grupo_id=? AND aluno_id=? AND status<>'cancelado' LIMIT 1");
            $alreadyMember->execute([$id,$groupId,$invitee]);
            if($alreadyMember->fetchColumn())$this->json(['erro'=>'Este aluno já participa da equipe'],409);
            $alreadyApproved=$this->db->prepare("SELECT 1 FROM submissao_missao WHERE missao_publicada_id=? AND status IN ('pending','approved') LIMIT 1");
            $alreadyApproved->execute([$id]);
            if($alreadyApproved->fetchColumn())$this->json(['erro'=>'A missão já possui uma comprovação em avaliação ou foi concluída'],409);
            $groupCompleted=$this->db->prepare("SELECT 1 FROM agenda WHERE missao_publicada_id=? AND grupo_id=? AND status='concluido' LIMIT 1");
            $groupCompleted->execute([$id,$groupId]);
            if($groupCompleted->fetchColumn())$this->json(['erro'=>'A equipe já marcou a missão como concluída'],409);
            $count=$this->db->prepare("SELECT COUNT(DISTINCT aluno_id) FROM agenda WHERE missao_publicada_id=? AND grupo_id=? AND status<>'cancelado'");
            $count->execute([$id,$groupId]);
            $members=(int)$count->fetchColumn();
            $pending=$this->db->prepare("SELECT COUNT(*) FROM missao_convite WHERE missao_publicada_id=? AND grupo_id=? AND status='pendente'");
            $pending->execute([$id,$groupId]);
            if($members+(int)$pending->fetchColumn()>=(int)$task['max_alunos'])$this->json(['erro'=>'O limite de participantes foi atingido'],409);
            $insert=$this->db->prepare("INSERT INTO missao_convite (missao_publicada_id,grupo_id,convidado_id,convidante_id,status) VALUES (?,?,?,?,'pendente') ON DUPLICATE KEY UPDATE status='pendente',convidante_id=VALUES(convidante_id)");
            $insert->execute([$id,$groupId,$invitee,(int)$student['id']]);
            $notify=$this->db->prepare("INSERT INTO notificacao (usuario_id,tipo,titulo,mensagem,link) VALUES (?,'convite_missao','Convite para uma missão',?,'/jardim')");
            $notify->execute([$invitee,$student['nome'].' convidou você para "'.$task['titulo'].'"']);
            $this->db->commit();
            $this->json(['mensagem'=>'Convite enviado'],201);
        } catch(Throwable $e) {
            if($this->db->inTransaction())$this->db->rollBack();
            throw $e;
        }
    }

    public function respondTaskInvite(int $inviteId): never
    {
        $student=$this->auth->user(['aluno']); $data=$this->input(); $accept=($data['aceitar']??false)===true||(int)($data['aceitar']??0)===1;
        $stmt=$this->db->prepare("SELECT c.*,ta.turma_id,ta.criador_id,ta.missao_id,ta.titulo,ta.max_alunos,ta.modo_participacao,ta.ativa,a.data_hora FROM missao_convite c JOIN missao_publicada ta ON ta.id=c.missao_publicada_id JOIN agenda a ON a.missao_publicada_id=c.missao_publicada_id AND a.grupo_id=c.grupo_id AND a.status='agendado' AND a.data_hora>=NOW() WHERE c.id=? AND c.convidado_id=? AND c.status='pendente' AND ta.ativa=1 ORDER BY a.id LIMIT 1"); $stmt->execute([$inviteId,(int)$student['id']]); $invite=$stmt->fetch();
        if(!$invite||$invite['status']!=='pendente')$this->json(['erro'=>'Convite não encontrado ou já respondido'],404);
        if(!$accept){$this->db->prepare("UPDATE missao_convite SET status='recusado' WHERE id=?")->execute([$inviteId]);$this->json(['mensagem'=>'Convite recusado']);}
        if((int)$student['turma_id']!==(int)$invite['turma_id'])$this->json(['erro'=>'O convite é de outra turma'],403);
        if((int)$invite['max_alunos']<=1||$invite['modo_participacao']!=='particular')$this->json(['erro'=>'Este convite não é válido para a configuração atual da missão'],409);
        $task=['id'=>(int)$invite['missao_publicada_id'],'turma_id'=>(int)$invite['turma_id'],'criador_id'=>(int)$invite['criador_id'],'missao_id'=>$invite['missao_id'],'titulo'=>$invite['titulo'],'max_alunos'=>(int)$invite['max_alunos']];
        $this->addTaskParticipant((int)$invite['missao_publicada_id'],$invite['grupo_id'],$task,$student,$invite['data_hora']); $this->db->prepare("UPDATE missao_convite SET status='aceito' WHERE id=?")->execute([$inviteId]);
        $this->json(['mensagem'=>'Você aceitou o convite para a missão']);
    }

    public function taskPeople(int $id): never
    {
        $student=$this->auth->user(['aluno']); $groupId=(string)($_GET['grupo_id']??'');
        if(!preg_match('/^[a-f0-9]{32}$/',$groupId))$this->json(['erro'=>'Turno inválido'],422);
        $task=$this->db->prepare('SELECT turma_id FROM missao_publicada WHERE id=? AND turma_id=?');
        $task->execute([$id,(int)($student['turma_id']??0)]);
        if(!$task->fetchColumn())$this->json(['erro'=>'Missão não encontrada'],404);
        $stmt=$this->db->prepare("SELECT u.id,u.nome FROM usuario u WHERE u.turma_id=? AND u.id<>? AND u.perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1) AND NOT EXISTS(SELECT 1 FROM agenda a WHERE a.missao_publicada_id=? AND a.grupo_id=? AND a.aluno_id=u.id AND a.status<>'cancelado') AND NOT EXISTS(SELECT 1 FROM missao_convite c WHERE c.missao_publicada_id=? AND c.grupo_id=? AND c.convidado_id=u.id AND c.status='pendente') ORDER BY u.nome");
        $stmt->execute([(int)$student['turma_id'],(int)$student['id'],$id,$groupId,$id,$groupId]);
        $this->json(['alunos'=>$stmt->fetchAll()]);
    }

    private function parseTaskDate(string $value): ?DateTimeImmutable
    {
        $date=DateTimeImmutable::createFromFormat('!Y-m-d H:i:s',$value)?:DateTimeImmutable::createFromFormat('!Y-m-d H:i',$value);
        return $date&&$date->format('Y-m-d H:i')>=date('Y-m-d H:i')?$date:null;
    }

    private function reserveTaskSlot(int $id,array $task,array $student,DateTimeImmutable $when,string $groupId,string $mode): void
    {
        try {
            $this->db->beginTransaction();
            $this->db->prepare('SELECT id FROM usuario WHERE id=? FOR UPDATE')->execute([(int)$student['id']]);
            $lock=$this->db->prepare('SELECT * FROM missao_publicada WHERE id=? AND ativa=1 FOR UPDATE'); $lock->execute([$id]); $task=$lock->fetch();
            if(!$task)$this->json(['erro'=>'A missão está encerrada'],409);
            $existingSubmission=$this->db->prepare("SELECT status FROM submissao_missao WHERE missao_publicada_id=? AND status IN ('pending','approved') ORDER BY id DESC LIMIT 1");
            $existingSubmission->execute([$id]);
            $submissionStatus=$existingSubmission->fetchColumn();
            if($submissionStatus==='approved')$this->json(['erro'=>'Esta missão já foi concluída e não aceita novas participações'],409);
            if($submissionStatus==='pending')$this->json(['erro'=>'Esta missão possui uma comprovação em avaliação'],409);
            $count=$this->db->prepare("SELECT COUNT(DISTINCT aluno_id) FROM agenda WHERE missao_publicada_id=? AND status<>'cancelado'"); $count->execute([$id]);
            $taken=(int)$count->fetchColumn();
            if($taken>0)$this->json(['erro'=>'Esta missão já possui um turno reservado. Entre no turno existente.'],409);
            if($taken>=(int)$task['max_alunos'])$this->json(['erro'=>'O limite de participantes foi atingido'],409);
            $existing=$this->db->prepare("SELECT 1 FROM agenda WHERE missao_publicada_id=? AND aluno_id=? AND status<>'cancelado'"); $existing->execute([$id,(int)$student['id']]);
            if($existing->fetchColumn())$this->json(['erro'=>'Você já aderiu a esta missão'],409);
            $start=$when->format('Y-m-d H:i:s'); $end=$when->modify('+1 hour')->format('Y-m-d H:i:s');
            $conflict=$this->db->prepare("SELECT 1 FROM agenda WHERE aluno_id=? AND status IN ('agendado','concluido') AND (data_hora>=CURDATE() OR status='concluido') AND data_hora < ? AND DATE_ADD(data_hora,INTERVAL 1 HOUR) > ?"); $conflict->execute([(int)$student['id'],$end,$start]);
            if($conflict->fetchColumn())$this->json(['erro'=>'Esse horário conflita com outro turno seu'],409);
            $insert=$this->db->prepare("INSERT INTO agenda (missao_publicada_id,grupo_id,aluno_id,professor_id,turma_id,missao_id,titulo,data_hora,status) VALUES (?,?,?,?,?,?,?,?,'agendado')");
            $insert->execute([$id,$groupId,(int)$student['id'],(int)$task['criador_id'],(int)$task['turma_id'],$task['missao_id'],$task['titulo'],$start]);
            $this->db->commit();
        } catch(Throwable $e){if($this->db->inTransaction())$this->db->rollBack();throw $e;}
    }
    private function addTaskParticipant(int $id,string $groupId,array $task,array $student,string $when): void
    {
        try {
            $this->db->beginTransaction(); $this->db->prepare('SELECT id FROM usuario WHERE id=? FOR UPDATE')->execute([(int)$student['id']]);
            $lock=$this->db->prepare('SELECT * FROM missao_publicada WHERE id=? AND ativa=1 FOR UPDATE'); $lock->execute([$id]);
            $lockedMission=$lock->fetch();
            if(!$lockedMission)$this->json(['erro'=>'A missão está encerrada'],409);
            $existingSubmission=$this->db->prepare("SELECT status FROM submissao_missao WHERE missao_publicada_id=? AND status IN ('pending','approved') ORDER BY id DESC LIMIT 1");
            $existingSubmission->execute([$id]);
            $submissionStatus=$existingSubmission->fetchColumn();
            if($submissionStatus==='approved')$this->json(['erro'=>'Esta missão já foi concluída e não aceita novas participações'],409);
            if($submissionStatus==='pending')$this->json(['erro'=>'Esta missão possui uma comprovação em avaliação'],409);
            $groupCompleted=$this->db->prepare("SELECT 1 FROM agenda WHERE missao_publicada_id=? AND grupo_id=? AND status='concluido' LIMIT 1");
            $groupCompleted->execute([$id,$groupId]);
            if($groupCompleted->fetchColumn())$this->json(['erro'=>'A equipe já marcou a missão como concluída'],409);
            $task=$lockedMission;
            $end=(new DateTimeImmutable($when))->modify('+1 hour')->format('Y-m-d H:i:s');
            $conflict=$this->db->prepare("SELECT 1 FROM agenda WHERE aluno_id=? AND status IN ('agendado','concluido') AND (data_hora>=CURDATE() OR status='concluido') AND data_hora < ? AND DATE_ADD(data_hora,INTERVAL 1 HOUR) > ? LIMIT 1"); $conflict->execute([(int)$student['id'],$end,$when]);
            if($conflict->fetchColumn())$this->json(['erro'=>'Esse horário conflita com outro turno seu'],409);
            $existing=$this->db->prepare("SELECT 1 FROM agenda WHERE missao_publicada_id=? AND aluno_id=? AND status<>'cancelado'"); $existing->execute([$id,(int)$student['id']]);
            if($existing->fetchColumn())$this->json(['erro'=>'Você já está participando desta missão'],409);
            $count=$this->db->prepare("SELECT COUNT(DISTINCT aluno_id) FROM agenda WHERE missao_publicada_id=? AND grupo_id=? AND status<>'cancelado'"); $count->execute([$id,$groupId]);
            if((int)$count->fetchColumn()>=(int)$task['max_alunos'])$this->json(['erro'=>'O limite de participantes foi atingido'],409);
            $insert=$this->db->prepare("INSERT INTO agenda (missao_publicada_id,grupo_id,aluno_id,professor_id,turma_id,missao_id,titulo,data_hora,status) VALUES (?,?,?,?,?,?,?,?,'agendado')");
            $insert->execute([$id,$groupId,(int)$student['id'],(int)$task['criador_id'],(int)$task['turma_id'],$task['missao_id'],$task['titulo'],$when]); $this->db->commit();
        } catch(Throwable $e){if($this->db->inTransaction())$this->db->rollBack();throw $e;}
    }
    public function toggleTask(int $id): never
    {
        $user=$this->auth->user(['professor','admin']); $data=$this->input(); $active=(int)($data['ativa']??0)===1?1:0;
        $stmt=$this->db->prepare("UPDATE missao_publicada ta JOIN turma_escolar t ON t.id=ta.turma_id SET ta.ativa=? WHERE ta.id=? AND (?='admin' OR EXISTS (SELECT 1 FROM turma_professor tp WHERE tp.turma_id=t.id AND tp.professor_id=?))");
        $stmt->execute([$active,$id,$user['perfil_nome'],(int)$user['id']]);
        if(!$stmt->rowCount())$this->json(['erro'=>'Missão não encontrada ou sem acesso'],404);
        $this->json(['mensagem'=>$active?'Missão reaberta':'Missão encerrada']);
    }
    public function agendaStatus(int $id): never
    {
        $teacher=$this->auth->user(['professor','admin']); $data=$this->input(); $status=$data['status']??'';
        if(!in_array($status,['concluido','cancelado'],true))$this->json(['erro'=>'Status inválido'],422);
        try {
            $this->db->beginTransaction();
            $query=$this->db->prepare("SELECT a.missao_publicada_id,a.grupo_id,ta.pontos,ta.requer_submissao,t.instituicao_id FROM agenda a LEFT JOIN missao_publicada ta ON ta.id=a.missao_publicada_id JOIN turma_escolar t ON t.id=a.turma_id WHERE a.id=? AND (?='admin' OR EXISTS(SELECT 1 FROM turma_professor tp WHERE tp.turma_id=a.turma_id AND tp.professor_id=?)) FOR UPDATE");
            $query->execute([$id,$teacher['perfil_nome'],(int)$teacher['id']]); $item=$query->fetch();
            if(!$item)$this->json(['erro'=>'Missão não encontrada ou sem acesso'],404);
            $update=$this->db->prepare('UPDATE agenda SET status=? WHERE id=? AND status=\'agendado\''); $update->execute([$status,$id]);
            if($status==='concluido'&&$update->rowCount()&&(int)$item['pontos']>0&&empty($item['requer_submissao'])){
                $members=$this->db->prepare("SELECT DISTINCT aluno_id,COALESCE(grupo_id,CONCAT('legacy-',id)) grupo_pontuacao FROM agenda WHERE status<>'cancelado' AND (id=? OR (missao_publicada_id=? AND grupo_id=? AND ? IS NOT NULL))");
                $members->execute([$id,$item['missao_publicada_id'],$item['grupo_id'],$item['grupo_id']]);
                $mark=$this->db->prepare("INSERT IGNORE INTO missao_pontuacao (missao_publicada_id,grupo_id,aluno_id,pontos,fonte) VALUES (?,?,?,?,'conclusao_legada')");
                $credit=$this->db->prepare('UPDATE usuario SET pontos_totais=pontos_totais+?,xp=xp+?,ultima_atividade_em=CURDATE() WHERE id=?');
                $pointsCredited=0;
                foreach($members->fetchAll(PDO::FETCH_ASSOC) as $member){
                    $mark->execute([(int)$item['missao_publicada_id'],(string)$member['grupo_pontuacao'],(int)$member['aluno_id'],(int)$item['pontos']]);
                    if($mark->rowCount()===1){$credit->execute([(int)$item['pontos'],(int)$item['pontos'],(int)$member['aluno_id']]);$pointsCredited+=(int)$item['pontos'];}
                }
            }
            $this->db->commit();
            $this->json(['mensagem'=>$status==='concluido'?(empty($item['requer_submissao'])?'Missão concluída e pontuação processada':'Missão concluída; os pontos dependem da aprovação da comprovação'):'Missão cancelada','pontos_creditados'=>($status==='concluido'&&empty($item['requer_submissao']))?($pointsCredited??0):0]);
        } catch(Throwable $e){if($this->db->inTransaction())$this->db->rollBack();throw $e;}
    }
    public function directorDashboard(): never
    {
        $user=$this->auth->user(['diretor']);$iid=(int)$user['instituicao_id'];
        $students=$this->db->prepare("SELECT COUNT(*) FROM usuario u JOIN perfil p ON p.id=u.perfil_id JOIN turma_escolar t ON t.id=u.turma_id WHERE t.instituicao_id=? AND p.nome='aluno'");$students->execute([$iid]);
        $points=$this->db->prepare("SELECT t.nome turma,COALESCE(SUM(u.pontos_totais),0) pontos FROM turma_escolar t LEFT JOIN usuario u ON u.turma_id=t.id AND u.perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1) WHERE t.instituicao_id=? GROUP BY t.id,t.nome ORDER BY pontos DESC");$points->execute([$iid]);
        $pending=$this->db->prepare("SELECT t.nome turma,COUNT(s.id) pendencias FROM turma_escolar t LEFT JOIN usuario u ON u.turma_id=t.id LEFT JOIN submissao_missao s ON s.aluno_id=u.id AND s.status='pending' WHERE t.instituicao_id=? GROUP BY t.id,t.nome");$pending->execute([$iid]);
        $this->json(['total_alunos'=>(int)$students->fetchColumn(),'pontos_por_turma'=>$points->fetchAll(),'pendencias_por_turma'=>$pending->fetchAll()]);
    }

    public function directorClasses(string $method): never
    {
        $user=$this->auth->user(['diretor']);$iid=(int)$user['instituicao_id'];
        if($method==='POST'){$data=$this->input();if(trim((string)($data['nome']??''))===''||empty($data['ano_letivo']))$this->json(['erro'=>'Informe nome e ano letivo'],422);$stmt=$this->db->prepare('INSERT INTO turma_escolar (instituicao_id,nome,ano_letivo) VALUES (?,?,?)');$stmt->execute([$iid,trim($data['nome']),(int)$data['ano_letivo']]);$this->json(['mensagem'=>'Turma criada com sucesso'],201);}
        $stmt=$this->db->prepare("SELECT t.id,t.nome,t.ano_letivo,(SELECT COUNT(*) FROM usuario u JOIN perfil p ON p.id=u.perfil_id WHERE u.instituicao_id=t.instituicao_id AND u.turma=t.nome AND p.nome='aluno') total_alunos FROM turma_escolar t WHERE t.instituicao_id=? ORDER BY t.ano_letivo DESC,t.nome");$stmt->execute([$iid]);$rows=$stmt->fetchAll();
        $teachers=$this->db->prepare('SELECT u.id,u.nome FROM turma_professor tp JOIN usuario u ON u.id=tp.professor_id WHERE tp.turma_id=? ORDER BY u.nome');foreach($rows as &$row){$teachers->execute([(int)$row['id']]);$row['professores']=$teachers->fetchAll();}$this->json(['turmas'=>$rows]);
    }

    public function availableTeachers(): never
    {
        $user=$this->auth->user(['diretor']);$stmt=$this->db->prepare("SELECT u.id,u.nome,u.email FROM usuario u JOIN perfil p ON p.id=u.perfil_id WHERE u.instituicao_id=? AND p.nome='professor' ORDER BY u.nome");$stmt->execute([(int)$user['instituicao_id']]);$this->json(['professores'=>$stmt->fetchAll()]);
    }

    public function classTeacher(int $classId,int $teacherId,string $method): never
    {
        $user=$this->auth->user(['diretor']);$check=$this->db->prepare('SELECT 1 FROM turma_escolar WHERE id=? AND instituicao_id=?');$check->execute([$classId,(int)$user['instituicao_id']]);if(!$check->fetchColumn())$this->json(['erro'=>'Turma não encontrada'],404);
        if($method==='POST'){$stmt=$this->db->prepare('INSERT IGNORE INTO turma_professor (turma_id,professor_id) VALUES (?,?)');$stmt->execute([$classId,$teacherId]);$notify=$this->db->prepare("INSERT INTO notificacao (usuario_id,tipo,titulo,mensagem,link) SELECT ?,'designacao_professor','Nova turma designada',CONCAT('Você foi designado para a turma ',nome),'/horarios' FROM turma_escolar WHERE id=?");$notify->execute([$teacherId,$classId]);$this->json(['mensagem'=>'Professor designado'],201);}
        $stmt=$this->db->prepare('DELETE FROM turma_professor WHERE turma_id=? AND professor_id=?');$stmt->execute([$classId,$teacherId]);$this->json(['mensagem'=>'Professor removido da turma']);
    }

    public function assignClassTeacher(int $classId): never
    {
        $data=$this->input();$teacherId=(int)($data['professor_id']??0);if($teacherId<1)$this->json(['erro'=>'Selecione um professor'],422);$this->classTeacher($classId,$teacherId,'POST');
    }

    public function managedRewards(string $scope,string $method,?int $id=null): never
    {
        $roles=$scope==='app'?['admin']:['diretor'];$user=$this->auth->user($roles);$iid=$scope==='escola'?(int)$user['instituicao_id']:null;
        if($method==='GET'){$stmt=$this->db->prepare('SELECT r.id,r.titulo,r.escopo,r.parceiro_id,p.nome parceiro,r.pontos_necessarios,r.imagem,r.ativo FROM recompensa r LEFT JOIN parceiro p ON p.id=r.parceiro_id WHERE r.escopo=? AND (? IS NULL OR r.instituicao_id=?) ORDER BY r.id DESC');$stmt->execute([$scope,$iid,$iid]);$p=$this->db->prepare('SELECT id,nome FROM parceiro WHERE ativo=1 ORDER BY nome');$p->execute();$this->json(['recompensas'=>$stmt->fetchAll(),'parceiros'=>$p->fetchAll()]);}
        if($method==='DELETE'){$stmt=$this->db->prepare('DELETE FROM recompensa WHERE id=? AND escopo=? AND (? IS NULL OR instituicao_id=?)');$stmt->execute([$id,$scope,$iid,$iid]);if(!$stmt->rowCount())$this->json(['erro'=>'Recompensa não encontrada'],404);$this->json(['mensagem'=>'Recompensa excluída']);}
        $data=$this->input();if(trim((string)($data['titulo']??''))===''||(int)($data['pontos_necessarios']??0)<1)$this->json(['erro'=>'Informe título e pontos válidos'],422);
        $partnerId=(int)($data['parceiro_id']??0);$partnerId=$partnerId>0?$partnerId:null;
        if($method==='POST'){
            $image=$this->storeRewardImage(true);
            $stmt=$this->db->prepare('INSERT INTO recompensa (titulo,escopo,parceiro_id,instituicao_id,pontos_necessarios,imagem,ativo) VALUES (?,?,?,?,?,?,?)');
            $stmt->execute([trim($data['titulo']),$scope,$partnerId,$iid,(int)$data['pontos_necessarios'],$image,(int)($data['ativo']??1)]);
            $this->json(['mensagem'=>'Recompensa criada'],201);
        }
        $current=$this->db->prepare('SELECT imagem FROM recompensa WHERE id=? AND escopo=? AND (? IS NULL OR instituicao_id=?)');$current->execute([$id,$scope,$iid,$iid]);$image=$current->fetchColumn();
        if($image===false)$this->json(['erro'=>'Recompensa não encontrada'],404);
        if(isset($_FILES['foto'])&&$_FILES['foto']['error']!==UPLOAD_ERR_NO_FILE)$image=$this->storeRewardImage(true);
        if(trim((string)$image)==='')$this->json(['erro'=>'Adicione uma imagem à recompensa'],422);
        $stmt=$this->db->prepare('UPDATE recompensa SET titulo=?,parceiro_id=?,pontos_necessarios=?,imagem=?,ativo=? WHERE id=? AND escopo=? AND (? IS NULL OR instituicao_id=?)');$stmt->execute([trim($data['titulo']),$partnerId,(int)$data['pontos_necessarios'],$image,(int)($data['ativo']??1),$id,$scope,$iid,$iid]);$this->json(['mensagem'=>'Recompensa atualizada']);
    }

    private function storeRewardImage(bool $required): ?string
    {
        if(!isset($_FILES['foto'])||$_FILES['foto']['error']===UPLOAD_ERR_NO_FILE){if($required)$this->json(['erro'=>'Adicione uma imagem à recompensa'],422);return null;}
        $file=$_FILES['foto'];
        if($file['error']!==UPLOAD_ERR_OK)$this->json(['erro'=>'Não foi possível receber a imagem'],422);
        if((int)$file['size']<1||(int)$file['size']>$this->config['upload_max_bytes'])$this->json(['erro'=>'A imagem deve ter no máximo 5 MB'],422);
        $mime=(new \finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $extensions=['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
        if(!isset($extensions[$mime]))$this->json(['erro'=>'Use uma imagem JPG, PNG ou WebP'],422);
        if(!is_dir($this->config['upload_dir'])&&!mkdir($this->config['upload_dir'],0750,true))$this->json(['erro'=>'Não foi possível preparar o armazenamento da imagem'],500);
        $name='recompensa-'.bin2hex(random_bytes(16)).'.'.$extensions[$mime];
        if(!move_uploaded_file($file['tmp_name'],$this->config['upload_dir'].'/'.$name))$this->json(['erro'=>'Não foi possível salvar a imagem'],500);
        return '/uploads/'.$name;
    }
}
