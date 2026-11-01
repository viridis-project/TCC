<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use Throwable;
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

    /**
     * Colunas e junções comuns às agendas. Cada linha é a participação de um aluno em um turno de missão.
     * Estados exibidos: agendado, em_analise (comprovação enviada), concluido, cancelado e nao_realizada.
     */
    private const AGENDA_SELECT = "SELECT a.id,a.missao_id,a.grupo_id,a.titulo,a.data_hora,
        CASE WHEN a.status='agendado' AND EXISTS(SELECT 1 FROM submissao_missao sp WHERE sp.missao_id=a.missao_id AND sp.grupo_id=a.grupo_id AND sp.status='pending') THEN 'em_analise'
             WHEN a.status='agendado' AND a.data_hora<CURDATE() THEN 'nao_realizada'
             ELSE a.status END status,
        m.descricao,m.imagem,m.tipo,m.pontos_recompensa pontos,t.id turma_id,t.nome turma,u.id aluno_id,u.nome aluno,
        (SELECT COUNT(DISTINCT peers.aluno_id) FROM agenda peers WHERE peers.missao_id=a.missao_id AND peers.grupo_id=a.grupo_id AND peers.status<>'cancelado') participantes,
        (SELECT s.descricao FROM submissao_missao s WHERE s.missao_id=a.missao_id AND s.grupo_id=a.grupo_id ORDER BY s.id DESC LIMIT 1) envio_descricao,
        (SELECT s.url_foto FROM submissao_missao s WHERE s.missao_id=a.missao_id AND s.grupo_id=a.grupo_id ORDER BY s.id DESC LIMIT 1) envio_foto,
        (SELECT s.status FROM submissao_missao s WHERE s.missao_id=a.missao_id AND s.grupo_id=a.grupo_id ORDER BY s.id DESC LIMIT 1) envio_status,
        (SELECT s.comentario_professor FROM submissao_missao s WHERE s.missao_id=a.missao_id AND s.grupo_id=a.grupo_id ORDER BY s.id DESC LIMIT 1) envio_comentario";
    private const AGENDA_FROM = " FROM agenda a JOIN usuario u ON u.id=a.aluno_id LEFT JOIN missao m ON m.id=a.missao_id LEFT JOIN turma_escolar t ON t.id=a.turma_id";

    public function studentAgenda(): never
    {
        $user=$this->auth->user(['aluno']);
        $stmt=$this->db->prepare(self::AGENDA_SELECT.",
            EXISTS(SELECT 1 FROM agenda me WHERE me.missao_id=a.missao_id AND me.grupo_id=a.grupo_id AND me.aluno_id=? AND me.status<>'cancelado') minha,
            teacher.nome professor".self::AGENDA_FROM." JOIN usuario teacher ON teacher.id=a.professor_id
            WHERE u.turma_id=? ORDER BY a.data_hora,u.nome");
        $stmt->execute([(int)$user['id'],(int)($user['turma_id']??0)]);
        $this->json(['agenda'=>$stmt->fetchAll()]);
    }

    public function teacherAgenda(): never
    {
        $user=$this->auth->user(['professor','admin']);
        $stmt=$this->db->prepare(self::AGENDA_SELECT.self::AGENDA_FROM."
            WHERE t.instituicao_id=? AND (?='admin' OR EXISTS (SELECT 1 FROM turma_professor tp WHERE tp.turma_id=a.turma_id AND tp.professor_id=?)) ORDER BY a.data_hora,u.nome");
        $stmt->execute([(int)$user['instituicao_id'],$user['perfil_nome'],(int)$user['id']]); $agenda=$stmt->fetchAll();
        $turmasStmt=$this->db->prepare('SELECT DISTINCT t.id,t.nome,t.ano_letivo FROM turma_escolar t LEFT JOIN turma_professor tp ON tp.turma_id=t.id WHERE t.instituicao_id=? AND (?=\'admin\' OR tp.professor_id=?) ORDER BY t.nome');
        $turmasStmt->execute([(int)$user['instituicao_id'],$user['perfil_nome'],(int)$user['id']]); $turmas=$turmasStmt->fetchAll();
        $students=$this->db->prepare("SELECT id,nome,turma FROM usuario WHERE turma_id=? AND perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1) ORDER BY nome");
        foreach ($turmas as &$turma) { $students->execute([(int)$turma['id']]); $turma['alunos']=$students->fetchAll(); }
        $this->json(['agenda'=>$agenda,'turmas'=>$turmas]);
    }

    public function directorAgenda(): never
    {
        $user=$this->auth->user(['diretor']);
        $stmt=$this->db->prepare(self::AGENDA_SELECT.self::AGENDA_FROM." WHERE t.instituicao_id=? ORDER BY a.data_hora,u.nome");
        $stmt->execute([(int)$user['instituicao_id']]);
        $classes=$this->db->prepare('SELECT id,nome,ano_letivo FROM turma_escolar WHERE instituicao_id=? ORDER BY nome');
        $classes->execute([(int)$user['instituicao_id']]); $turmas=$classes->fetchAll();
        $students=$this->db->prepare("SELECT id,nome,turma FROM usuario WHERE turma_id=? AND perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1) ORDER BY nome");
        foreach($turmas as &$class){$students->execute([(int)$class['id']]);$class['alunos']=$students->fetchAll();}
        $this->json(['agenda'=>$stmt->fetchAll(),'turmas'=>$turmas]);
    }

    /**
     * O professor só cancela turnos: a conclusão de uma missão acontece ao aprovar a comprovação enviada
     * (ApiController::reviewSubmission), que é o único caminho que credita pontos.
     */
    public function agendaStatus(int $id): never
    {
        $teacher=$this->auth->user(['professor','admin']); $data=$this->input(); $status=$data['status']??'';
        if($status==='concluido')$this->json(['erro'=>'Para concluir uma missão, aprove a comprovação enviada pelos alunos'],422);
        if($status!=='cancelado')$this->json(['erro'=>'Status inválido'],422);
        try {
            $this->db->beginTransaction();
            $query=$this->db->prepare("SELECT a.missao_id,a.grupo_id FROM agenda a JOIN turma_escolar t ON t.id=a.turma_id WHERE a.id=? AND (?='admin' OR EXISTS(SELECT 1 FROM turma_professor tp WHERE tp.turma_id=a.turma_id AND tp.professor_id=?)) FOR UPDATE");
            $query->execute([$id,$teacher['perfil_nome'],(int)$teacher['id']]); $item=$query->fetch();
            if(!$item){$this->db->rollBack();$this->json(['erro'=>'Missão não encontrada ou sem acesso'],404);}
            $pending=$this->db->prepare("SELECT 1 FROM submissao_missao WHERE missao_id=? AND grupo_id=? AND status='pending' LIMIT 1");
            $pending->execute([$item['missao_id'],$item['grupo_id']]);
            if($pending->fetchColumn()){$this->db->rollBack();$this->json(['erro'=>'Revise a comprovação enviada antes de cancelar o turno'],409);}
            $update=$this->db->prepare("UPDATE agenda SET status='cancelado' WHERE id=? AND status='agendado'"); $update->execute([$id]);
            $this->db->commit();
            $this->json(['mensagem'=>'Turno cancelado. A missão volta a ficar disponível para a turma']);
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
