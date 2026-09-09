<?php
declare(strict_types=1);
namespace Viridis\services;
use PDO;

final class LearningAccess
{
    public function __construct(private PDO $db) {}

    public function managerScope(array $user): array
    {
        return match ($user['perfil_nome']) {
            'admin' => ["c.escopo='app'",[]],
            'diretor' => ["c.escopo='escola' AND c.instituicao_id=?",[(int)($user['instituicao_id']??0)]],
            'professor' => ["c.escopo='turma' AND c.criador_id=? AND c.instituicao_id=? AND EXISTS
                (SELECT 1 FROM turma_professor tp JOIN turma_escolar t ON t.id=tp.turma_id
                 WHERE tp.turma_id=c.turma_id AND tp.professor_id=? AND t.instituicao_id=c.instituicao_id)",
                [(int)$user['id'],(int)($user['instituicao_id']??0),(int)$user['id']]],
            default => ['1=0',[]],
        };
    }

    public function visibleScope(array $user): array
    {
        return ["c.ativo=1 AND c.publicado=1 AND (c.escopo='app' OR
            (c.escopo='escola' AND c.instituicao_id=?) OR
            (c.escopo='turma' AND c.instituicao_id=? AND (c.turma_id=? OR EXISTS
                (SELECT 1 FROM turma_professor tp WHERE tp.turma_id=c.turma_id AND tp.professor_id=?))))",
            [(int)($user['instituicao_id']??0),(int)($user['instituicao_id']??0),(int)($user['turma_id']??0),(int)$user['id']]];
    }

    public function managedCourse(array $user,int $id): array
    {
        [$scope,$params]=$this->managerScope($user);
        $q=$this->db->prepare("SELECT c.* FROM curso c WHERE c.id=? AND c.ativo=1 AND $scope");
        $q->execute([$id,...$params]);$course=$q->fetch();
        if (!$course) throw new LearningException('Curso não encontrado ou sem acesso',404);
        return $course;
    }

    public function managedChild(array $user,string $type,int $id): array
    {
        $sql=match($type) {
            'modulo' => 'SELECT m.*,m.curso_id FROM modulo m WHERE m.id=? AND m.ativo=1',
            'licao' => 'SELECT l.*,m.curso_id FROM licao l JOIN modulo m ON m.id=l.modulo_id WHERE l.id=? AND l.ativo=1 AND m.ativo=1',
            'pergunta' => 'SELECT q.*,m.curso_id FROM pergunta_quiz q JOIN licao l ON l.id=q.licao_id JOIN modulo m ON m.id=l.modulo_id WHERE q.id=? AND q.ativo=1 AND l.ativo=1 AND m.ativo=1',
        };
        $q=$this->db->prepare($sql);$q->execute([$id]);$row=$q->fetch();
        if (!$row) throw new LearningException('Conteúdo não encontrado',404);
        $row['curso']=$this->managedCourse($user,(int)$row['curso_id']);
        return $row;
    }

    public function editable(array $course): void
    {
        if ((int)$course['publicado']===1) throw new LearningException('Volte o curso para rascunho antes de editar o conteúdo',409);
    }

    public function modules(array $user): array
    {
        [$scope,$params]=$this->visibleScope($user);
        $q=$this->db->prepare("SELECT c.id curso_id,c.titulo curso_titulo,c.descricao curso_descricao,c.escopo,
            m.id modulo_id,m.titulo modulo_titulo,m.descricao,m.cor,m.ordem modulo_ordem,
            l.id licao_id,l.titulo licao_titulo,l.kind,l.xp,l.ordem licao_ordem,ulp.status
            FROM curso c JOIN modulo m ON m.curso_id=c.id AND m.ativo=1 JOIN licao l ON l.modulo_id=m.id AND l.ativo=1
            LEFT JOIN usuario_licao_progresso ulp ON ulp.licao_id=l.id AND ulp.usuario_id=?
            WHERE $scope AND EXISTS (SELECT 1 FROM pergunta_quiz q WHERE q.licao_id=l.id AND q.ativo=1)
            ORDER BY c.id,m.ordem,m.id,l.ordem,l.id");
        $q->execute([(int)$user['id'],...$params]);$modules=[];$current=[];
        foreach ($q->fetchAll() as $row) {
            $id=(int)$row['modulo_id'];$cid=(int)$row['curso_id'];
            if (!isset($modules[$id])) $modules[$id]=['id'=>$id,'titulo'=>$row['modulo_titulo'],'descricao'=>$row['descricao'],'cor'=>$row['cor'],
                'ordem'=>(int)$row['modulo_ordem'],'curso_id'=>$cid,'curso_titulo'=>$row['curso_titulo'],'curso_descricao'=>$row['curso_descricao'],'escopo'=>$row['escopo'],'licoes'=>[],'progresso'=>0];
            $status=$row['status']==='completed' ? 'completed' : (empty($current[$cid]) ? 'current' : 'locked');
            if ($status==='current') $current[$cid]=true;
            $modules[$id]['licoes'][]=['id'=>(int)$row['licao_id'],'titulo'=>$row['licao_titulo'],'kind'=>$row['kind'],'xp'=>(int)$row['xp'],'ordem'=>(int)$row['licao_ordem'],'status'=>$status];
        }
        foreach ($modules as &$module) $module['progresso']=(int)round(100*count(array_filter($module['licoes'],fn($l)=>$l['status']==='completed'))/count($module['licoes']));
        return array_values($modules);
    }

    public function playableLesson(array $user,int $id): array
    {
        foreach ($this->modules($user) as $module) foreach ($module['licoes'] as $lesson) {
            if ($lesson['id']!==$id) continue;
            if ($lesson['status']==='locked') throw new LearningException('Conclua as lições anteriores deste curso',403);
            return $lesson;
        }
        throw new LearningException('Lição não encontrada ou indisponível para você',404);
    }
}
