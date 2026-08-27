<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use PDOException;
use Viridis\middleware\AuthMiddleware;
use Viridis\services\CodeGenerator;

final class DirectorController extends Controller
{
    private CodeGenerator $codes;

    public function __construct(private PDO $db, private AuthMiddleware $auth)
    {
        $this->codes = new CodeGenerator($db);
    }

    public function classes(string $method): never
    {
        $director = $this->auth->user(['diretor']);
        $institutionId = (int) $director['instituicao_id'];
        if ($method === 'POST') {
            $data = $this->input();
            $name = trim((string) ($data['nome'] ?? ''));
            $year = (int) ($data['ano_letivo'] ?? 0);
            if ($name === '' || $year < 2020 || $year > 2100) $this->json(['erro'=>'Informe nome e ano letivo válidos'],422);
            try {
                $code = $this->codes->classCode($name);
                $stmt = $this->db->prepare('INSERT INTO turma_escolar (instituicao_id,nome,ano_letivo,codigo_acesso,codigo_ativo) VALUES (?,?,?,?,1)');
                $stmt->execute([$institutionId,$name,$year,$code]);
                $this->json(['mensagem'=>'Turma criada com sucesso','id'=>(int)$this->db->lastInsertId(),'codigo_acesso'=>$code],201);
            } catch (PDOException $e) {
                if ($e->getCode()==='23000') $this->json(['erro'=>'Já existe uma turma com esse nome e ano'],409);
                throw $e;
            }
        }
        $stmt=$this->db->prepare("SELECT t.id,t.nome,t.ano_letivo,t.codigo_acesso,t.codigo_ativo,
            (SELECT COUNT(*) FROM usuario u JOIN perfil p ON p.id=u.perfil_id WHERE u.turma_id=t.id AND p.nome='aluno') total_alunos
            FROM turma_escolar t WHERE t.instituicao_id=? ORDER BY t.ano_letivo DESC,t.nome");
        $stmt->execute([$institutionId]);
        $rows=$stmt->fetchAll();
        foreach($rows as &$row) $row['professores']=$this->teachersFor((int)$row['id']);
        $this->json(['turmas'=>$rows]);
    }

    public function detail(int $classId): never
    {
        $class=$this->ownedClass($classId);
        $class['professores']=$this->teachersFor($classId);
        $this->json(['turma'=>$class]);
    }

    public function update(int $classId): never
    {
        $this->ownedClass($classId);
        $data=$this->input();$name=trim((string)($data['nome']??''));$year=(int)($data['ano_letivo']??0);
        if($name===''||$year<2020||$year>2100)$this->json(['erro'=>'Informe nome e ano letivo válidos'],422);
        try {
            $stmt=$this->db->prepare('UPDATE turma_escolar SET nome=?,ano_letivo=? WHERE id=?');$stmt->execute([$name,$year,$classId]);
            $sync=$this->db->prepare('UPDATE usuario SET turma=? WHERE turma_id=?');$sync->execute([$name,$classId]);
            $this->json(['mensagem'=>'Turma atualizada']);
        } catch(PDOException $e){if($e->getCode()==='23000')$this->json(['erro'=>'Já existe uma turma com esse nome e ano'],409);throw $e;}
    }

    public function regenerateCode(int $classId): never
    {
        $class=$this->ownedClass($classId);$code=$this->codes->classCode((string)$class['nome']);
        $stmt=$this->db->prepare('UPDATE turma_escolar SET codigo_acesso=?,codigo_ativo=1 WHERE id=?');$stmt->execute([$code,$classId]);
        $this->json(['mensagem'=>'Novo código gerado','codigo_acesso'=>$code]);
    }

    public function students(int $classId): never
    {
        $this->ownedClass($classId);
        $stmt=$this->db->prepare("SELECT u.id,u.nome,u.email,u.pontos_totais pontos,u.data_criacao data_entrada
            FROM usuario u JOIN perfil p ON p.id=u.perfil_id WHERE u.turma_id=? AND p.nome='aluno' ORDER BY u.nome");
        $stmt->execute([$classId]);$this->json(['alunos'=>$stmt->fetchAll()]);
    }

    public function moveStudent(int $classId,int $studentId): never
    {
        $source=$this->ownedClass($classId);$data=$this->input();$destinationId=(int)($data['nova_turma_id']??0);
        $stmt=$this->db->prepare('SELECT id,nome,instituicao_id FROM turma_escolar WHERE id=?');$stmt->execute([$destinationId]);$destination=$stmt->fetch();
        if(!$destination||(int)$destination['instituicao_id']!==(int)$source['instituicao_id'])$this->json(['erro'=>'A turma de destino pertence a outra escola'],403);
        $update=$this->db->prepare("UPDATE usuario SET turma_id=?,instituicao_id=?,turma=? WHERE id=? AND turma_id=? AND perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1)");
        $update->execute([$destinationId,(int)$destination['instituicao_id'],$destination['nome'],$studentId,$classId]);
        if(!$update->rowCount())$this->json(['erro'=>'Aluno não encontrado nesta turma'],404);
        $this->json(['mensagem'=>'Aluno movido para a nova turma']);
    }

    public function unlinkStudent(int $classId,int $studentId): never
    {
        $this->ownedClass($classId);
        $stmt=$this->db->prepare("UPDATE usuario SET turma_id=NULL,instituicao_id=NULL,turma=NULL WHERE id=? AND turma_id=? AND perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1)");
        $stmt->execute([$studentId,$classId]);if(!$stmt->rowCount())$this->json(['erro'=>'Aluno não encontrado nesta turma'],404);
        $this->json(['mensagem'=>'Aluno removido da turma e da escola']);
    }

    public function deleteClass(int $classId): never
    {
        $this->ownedClass($classId);
        $count=$this->db->prepare('SELECT COUNT(*) FROM usuario WHERE turma_id=?');$count->execute([$classId]);
        if((int)$count->fetchColumn()>0)$this->json(['erro'=>'Realocar ou remover os alunos antes de excluir a turma'],409);
        $stmt=$this->db->prepare('DELETE FROM turma_escolar WHERE id=?');$stmt->execute([$classId]);
        $this->json(['mensagem'=>'Turma excluída']);
    }

    public function classTeacher(int $classId,?int $teacherId,string $method): never
    {
        $class=$this->ownedClass($classId);
        if($method==='POST'){
            $data=$this->input();$teacherId=(int)($data['professor_id']??0);
            $check=$this->db->prepare("SELECT 1 FROM usuario u JOIN perfil p ON p.id=u.perfil_id WHERE u.id=? AND u.instituicao_id=? AND p.nome='professor'");
            $check->execute([$teacherId,(int)$class['instituicao_id']]);if(!$check->fetchColumn())$this->json(['erro'=>'Professor não pertence a esta escola'],403);
            $stmt=$this->db->prepare('INSERT IGNORE INTO turma_professor (turma_id,professor_id) VALUES (?,?)');$stmt->execute([$classId,$teacherId]);
            if($stmt->rowCount()){$notify=$this->db->prepare("INSERT INTO notificacao (usuario_id,tipo,titulo,mensagem,link) VALUES (?,'designacao_professor','Nova turma designada',?,'/horarios')");$notify->execute([$teacherId,'Você foi designado para a turma '.$class['nome']]);}
            $this->json(['mensagem'=>'Professor designado'],201);
        }
        $stmt=$this->db->prepare('DELETE tp FROM turma_professor tp JOIN usuario u ON u.id=tp.professor_id WHERE tp.turma_id=? AND tp.professor_id=? AND u.instituicao_id=?');
        $stmt->execute([$classId,$teacherId,(int)$class['instituicao_id']]);$this->json(['mensagem'=>'Professor removido da turma']);
    }

    private function ownedClass(int $classId): array
    {
        $director=$this->auth->user(['diretor']);
        $stmt=$this->db->prepare('SELECT id,nome,ano_letivo,codigo_acesso,codigo_ativo,instituicao_id FROM turma_escolar WHERE id=? AND instituicao_id=?');
        $stmt->execute([$classId,(int)$director['instituicao_id']]);$class=$stmt->fetch();
        if(!$class)$this->json(['erro'=>'Turma não encontrada'],404);
        return $class;
    }

    private function teachersFor(int $classId): array
    {
        $stmt=$this->db->prepare('SELECT u.id,u.nome,u.email FROM turma_professor tp JOIN usuario u ON u.id=tp.professor_id WHERE tp.turma_id=? ORDER BY u.nome');
        $stmt->execute([$classId]);return $stmt->fetchAll();
    }
}

