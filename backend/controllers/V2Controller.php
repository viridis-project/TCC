<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use Throwable;
use Viridis\middleware\AuthMiddleware;

final class V2Controller extends Controller
{
    public function __construct(private PDO $db, private AuthMiddleware $auth) {}

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
        $stmt=$this->db->prepare('SELECT a.id,a.titulo,a.data_hora,a.status,a.missao_id,m.titulo missao,
                t.nome turma,student.nome aluno,teacher.nome professor
            FROM agenda a
            JOIN usuario student ON student.id=a.aluno_id AND student.turma_id=?
            LEFT JOIN missao m ON m.id=a.missao_id
            LEFT JOIN turma_escolar t ON t.id=student.turma_id
            JOIN usuario teacher ON teacher.id=a.professor_id
            ORDER BY a.data_hora,student.nome');
        $stmt->execute([(int)($user['turma_id']??0)]);
        $this->json(['agenda'=>$stmt->fetchAll()]);
    }

    public function teacherAgenda(): never
    {
        $user=$this->auth->user(['professor','admin']);
        $stmt=$this->db->prepare('SELECT a.id,a.titulo,a.data_hora,a.status,a.missao_id,m.titulo missao,t.id turma_id,t.nome turma,u.id aluno_id,u.nome aluno FROM agenda a JOIN usuario u ON u.id=a.aluno_id LEFT JOIN turma_escolar t ON t.id=a.turma_id LEFT JOIN missao m ON m.id=a.missao_id WHERE a.professor_id=? OR ?=\'admin\' ORDER BY a.data_hora,u.nome');
        $stmt->execute([(int)$user['id'],$user['perfil_nome']]);
        $agenda=$stmt->fetchAll();
        $turmasStmt=$this->db->prepare('SELECT DISTINCT t.id,t.nome,t.ano_letivo FROM turma_escolar t LEFT JOIN turma_professor tp ON tp.turma_id=t.id WHERE t.instituicao_id=? AND (?=\'admin\' OR tp.professor_id=?) ORDER BY t.nome');
        $turmasStmt->execute([(int)$user['instituicao_id'],$user['perfil_nome'],(int)$user['id']]);
        $turmas=$turmasStmt->fetchAll();
        $students=$this->db->prepare("SELECT id,nome,turma FROM usuario WHERE turma_id=? AND perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1) ORDER BY nome");
        foreach ($turmas as &$turma) { $students->execute([(int)$turma['id']]); $turma['alunos']=$students->fetchAll(); }
        $this->json(['agenda'=>$agenda,'turmas'=>$turmas]);
    }

    public function createAgenda(): never
    {
        $teacher=$this->auth->user(['professor','admin']); $data=$this->input();
        $students=$data['alunos']??[];
        $classId=(int)($data['turma_id']??0);
        if (!is_array($students)||$students===[]||$classId<1||trim((string)($data['titulo']??''))===''||empty($data['data_hora'])) $this->json(['erro'=>'Preencha turma, tarefa, data e alunos'],422);
        $classCheck=$this->db->prepare("SELECT 1 FROM turma_escolar t LEFT JOIN turma_professor tp ON tp.turma_id=t.id AND tp.professor_id=? WHERE t.id=? AND t.instituicao_id=? AND (?='admin' OR tp.professor_id IS NOT NULL)");
        $classCheck->execute([(int)$teacher['id'],$classId,(int)$teacher['instituicao_id'],$teacher['perfil_nome']]);
        if(!$classCheck->fetchColumn())$this->json(['erro'=>'Você não é responsável por esta turma'],403);
        $studentCheck=$this->db->prepare("SELECT 1 FROM usuario u JOIN perfil p ON p.id=u.perfil_id WHERE u.id=? AND u.turma_id=? AND p.nome='aluno'");
        foreach(array_unique(array_map('intval',$students)) as $studentId){$studentCheck->execute([$studentId,$classId]);if(!$studentCheck->fetchColumn())$this->json(['erro'=>'Um dos alunos não pertence à turma selecionada'],422);}
        try {
            $this->db->beginTransaction();
            $insert=$this->db->prepare("INSERT INTO agenda (aluno_id,professor_id,turma_id,missao_id,titulo,data_hora,status) VALUES (?,?,?,?,?,?,'agendado')");
            $notify=$this->db->prepare("INSERT INTO notificacao (usuario_id,tipo,titulo,mensagem,link) VALUES (?,'tarefa_agendada','Nova tarefa agendada',?,'/horarios')");
            foreach (array_unique(array_map('intval',$students)) as $studentId) {
                $insert->execute([$studentId,(int)$teacher['id'],$classId,(int)($data['missao_id']??0)?:null,trim((string)$data['titulo']),$data['data_hora']]);
                $notify->execute([$studentId,trim((string)$data['titulo']).' em '.date('d/m/Y H:i',strtotime($data['data_hora']))]);
            }
            $this->db->commit(); $this->json(['mensagem'=>'Tarefa agendada com sucesso'],201);
        } catch (Throwable $e) { if($this->db->inTransaction())$this->db->rollBack(); throw $e; }
    }

    public function agendaStatus(int $id): never
    {
        $teacher=$this->auth->user(['professor','admin']); $data=$this->input(); $status=$data['status']??'';
        if(!in_array($status,['concluido','cancelado'],true))$this->json(['erro'=>'Status inválido'],422);
        $stmt=$this->db->prepare("UPDATE agenda SET status=? WHERE id=? AND (professor_id=? OR ?='admin')");
        $stmt->execute([$status,$id,(int)$teacher['id'],$teacher['perfil_nome']]);
        if(!$stmt->rowCount())$this->json(['erro'=>'Tarefa não encontrada'],404);
        $this->json(['mensagem'=>$status==='concluido'?'Tarefa concluída':'Tarefa cancelada']);
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
        if($method==='GET'){$stmt=$this->db->prepare('SELECT r.id,r.titulo,r.escopo,r.parceiro_id,p.nome parceiro,r.pontos_necessarios,r.imagem,r.ativo FROM recompensa r JOIN parceiro p ON p.id=r.parceiro_id WHERE r.escopo=? AND (? IS NULL OR r.instituicao_id=?) ORDER BY r.id DESC');$stmt->execute([$scope,$iid,$iid]);$p=$this->db->prepare('SELECT id,nome FROM parceiro WHERE ativo=1 ORDER BY nome');$p->execute();$this->json(['recompensas'=>$stmt->fetchAll(),'parceiros'=>$p->fetchAll()]);}
        if($method==='DELETE'){$stmt=$this->db->prepare('DELETE FROM recompensa WHERE id=? AND escopo=? AND (? IS NULL OR instituicao_id=?)');$stmt->execute([$id,$scope,$iid,$iid]);if(!$stmt->rowCount())$this->json(['erro'=>'Recompensa não encontrada'],404);$this->json(['mensagem'=>'Recompensa excluída']);}
        $data=$this->input();if(trim((string)($data['titulo']??''))===''||(int)($data['pontos_necessarios']??0)<1)$this->json(['erro'=>'Informe título e pontos válidos'],422);
        if($method==='POST'){$stmt=$this->db->prepare('INSERT INTO recompensa (titulo,escopo,parceiro_id,instituicao_id,pontos_necessarios,imagem,ativo) VALUES (?,?,?,?,?,?,?)');$stmt->execute([trim($data['titulo']),$scope,(int)$data['parceiro_id'],$iid,(int)$data['pontos_necessarios'],trim((string)($data['imagem']??''))?:null,(int)($data['ativo']??1)]);$this->json(['mensagem'=>'Recompensa criada'],201);}
        $stmt=$this->db->prepare('UPDATE recompensa SET titulo=?,parceiro_id=?,pontos_necessarios=?,imagem=?,ativo=? WHERE id=? AND escopo=? AND (? IS NULL OR instituicao_id=?)');$stmt->execute([trim($data['titulo']),(int)$data['parceiro_id'],(int)$data['pontos_necessarios'],trim((string)($data['imagem']??''))?:null,(int)($data['ativo']??1),$id,$scope,$iid,$iid]);$this->json(['mensagem'=>'Recompensa atualizada']);
    }
}
