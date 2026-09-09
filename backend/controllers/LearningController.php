<?php
declare(strict_types=1);
namespace Viridis\controllers;
use PDO;
use Throwable;
use Viridis\middleware\AuthMiddleware;
use Viridis\services\LearningAccess;
use Viridis\services\LearningException;

final class LearningController extends Controller
{
    private LearningAccess $access;
    public function __construct(private PDO $db,private AuthMiddleware $auth) { $this->access=new LearningAccess($db); }
    private function manager(): array { return $this->auth->user(['admin','diretor','professor']); }

    public function courses(): never
    {
        $user=$this->manager();[$scope,$params]=$this->access->managerScope($user);
        $q=$this->db->prepare("SELECT c.*,t.nome turma,i.nome escola,
            (SELECT COUNT(*) FROM modulo m WHERE m.curso_id=c.id AND m.ativo=1) total_modulos
            FROM curso c LEFT JOIN turma_escolar t ON t.id=c.turma_id LEFT JOIN instituicao i ON i.id=c.instituicao_id
            WHERE c.ativo=1 AND $scope ORDER BY c.criado_em DESC,c.id DESC");$q->execute($params);
        $classes=[];
        if ($user['perfil_nome']==='professor') {
            $t=$this->db->prepare('SELECT t.id,t.nome,t.ano_letivo FROM turma_escolar t JOIN turma_professor tp ON tp.turma_id=t.id WHERE tp.professor_id=? AND t.instituicao_id=? ORDER BY t.ano_letivo DESC,t.nome');
            $t->execute([(int)$user['id'],(int)($user['instituicao_id']??0)]);$classes=$t->fetchAll();
        }
        $this->json(['cursos'=>$q->fetchAll(),'turmas'=>$classes]);
    }

    public function createCourse(): never
    {
        $user=$this->manager();$data=$this->input();
        $title=$this->text($data,'titulo',150,3);$description=$this->text($data,'descricao',1000);
        $scope=match($user['perfil_nome']) {'admin'=>'app','diretor'=>'escola','professor'=>'turma'};
        $institution=$scope==='app' ? null : (int)($user['instituicao_id']??0);$class=null;
        if ($scope!=='app' && !$institution) throw new LearningException('Seu perfil precisa estar vinculado a uma escola',403);
        if ($scope==='turma') {
            $class=$this->integer($data,'turma_id',1,PHP_INT_MAX);
            $q=$this->db->prepare('SELECT 1 FROM turma_professor tp JOIN turma_escolar t ON t.id=tp.turma_id WHERE tp.professor_id=? AND tp.turma_id=? AND t.instituicao_id=?');
            $q->execute([(int)$user['id'],$class,$institution]);
            if (!$q->fetchColumn()) throw new LearningException('Selecione uma turma vinculada a você',403);
        }
        $q=$this->db->prepare('INSERT INTO curso (titulo,descricao,escopo,instituicao_id,turma_id,criador_id) VALUES (?,?,?,?,?,?)');
        $q->execute([$title,$description,$scope,$institution,$class,(int)$user['id']]);
        $this->json(['mensagem'=>'Curso criado como rascunho','id'=>(int)$this->db->lastInsertId()],201);
    }

    public function detail(int $id): never
    {
        $user=$this->manager();$course=$this->access->managedCourse($user,$id);
        $m=$this->db->prepare('SELECT * FROM modulo WHERE curso_id=? AND ativo=1 ORDER BY ordem,id');$m->execute([$id]);$modules=$m->fetchAll();
        $l=$this->db->prepare('SELECT * FROM licao WHERE modulo_id=? AND ativo=1 ORDER BY ordem,id');
        $q=$this->db->prepare('SELECT * FROM pergunta_quiz WHERE licao_id=? AND ativo=1 ORDER BY id');
        $o=$this->db->prepare('SELECT id,texto_opcao,is_correta FROM opcao_quiz WHERE pergunta_id=? ORDER BY id');
        foreach ($modules as &$module) {
            $l->execute([(int)$module['id']]);$module['licoes']=$l->fetchAll();
            foreach ($module['licoes'] as &$lesson) {
                $q->execute([(int)$lesson['id']]);$lesson['perguntas']=$q->fetchAll();
                foreach ($lesson['perguntas'] as &$question) { $o->execute([(int)$question['id']]);$question['opcoes']=$o->fetchAll(); }
            }
        }
        $this->json(['curso'=>$course,'modulos'=>$modules]);
    }

    public function updateCourse(int $id): never
    {
        $course=$this->access->managedCourse($this->manager(),$id);$data=$this->input();
        $title=$this->text($data,'titulo',150,3);$description=$this->text($data,'descricao',1000);
        // Course metadata can be corrected while published; structural content remains draft-only.
        $this->change($course,function () use ($title,$description,$id): void {
            $q=$this->db->prepare('UPDATE curso SET titulo=?,descricao=? WHERE id=?');$q->execute([$title,$description,$id]);
        },false);
        $this->json(['mensagem'=>'Curso atualizado','id'=>$id]);
    }

    public function publish(int $id): never
    {
        $course=$this->access->managedCourse($this->manager(),$id);$data=$this->input();
        if (!isset($data['publicado']) || !is_bool($data['publicado'])) throw new LearningException('Informe o estado da publicação',422);
        $published=$data['publicado'];
        $this->change($course,function () use ($id,$published): void {
            if ($published) {
                $m=$this->db->prepare('SELECT id FROM modulo WHERE curso_id=? AND ativo=1');$m->execute([$id]);$modules=$m->fetchAll();
                if (!$modules) throw new LearningException('Adicione pelo menos um módulo antes de publicar',422);
                foreach ($modules as $module) {
                    $l=$this->db->prepare('SELECT id FROM licao WHERE modulo_id=? AND ativo=1');$l->execute([(int)$module['id']]);$lessons=$l->fetchAll();
                    if (!$lessons) throw new LearningException('Cada módulo precisa de pelo menos uma lição',422);
                    foreach ($lessons as $lesson) {
                        $q=$this->db->prepare('SELECT q.id,COUNT(o.id) opcoes,COALESCE(SUM(o.is_correta),0) corretas FROM pergunta_quiz q LEFT JOIN opcao_quiz o ON o.pergunta_id=q.id WHERE q.licao_id=? AND q.ativo=1 GROUP BY q.id');
                        $q->execute([(int)$lesson['id']]);$questions=$q->fetchAll();
                        if (!$questions) throw new LearningException('Cada lição precisa de pelo menos uma pergunta',422);
                        foreach ($questions as $question) if ((int)$question['opcoes']!==4 || (int)$question['corretas']!==1) throw new LearningException('Cada pergunta precisa de quatro alternativas e uma resposta correta',422);
                    }
                }
            }
            $q=$this->db->prepare('UPDATE curso SET publicado=? WHERE id=?');$q->execute([(int)$published,$id]);
        },false);
        $this->json(['mensagem'=>$published?'Curso publicado para seu público':'Curso voltou para rascunho']);
    }

    public function saveModule(?int $id): never
    {
        $user=$this->manager();$data=$this->input();
        $row=$id ? $this->access->managedChild($user,'modulo',$id) : null;
        $course=$row ? $row['curso'] : $this->access->managedCourse($user,$this->integer($data,'curso_id',1,PHP_INT_MAX));
        $title=$this->text($data,'titulo',100,3);$description=$this->text($data,'descricao',255);$order=$this->integer($data,'ordem',1,9999);
        $color=$this->text($data,'cor',50);if (!preg_match('/^#[a-fA-F0-9]{6}$/',$color)) $color='#16803c';
        $savedId=$id;
        $this->change($course,function () use (&$savedId,$id,$course,$title,$description,$order,$color): void {
            if ($id) { $q=$this->db->prepare('UPDATE modulo SET titulo=?,descricao=?,cor=?,ordem=? WHERE id=?');$q->execute([$title,$description,$color,$order,$id]); }
            else { $q=$this->db->prepare('INSERT INTO modulo (curso_id,titulo,descricao,cor,ordem) VALUES (?,?,?,?,?)');$q->execute([(int)$course['id'],$title,$description,$color,$order]);$savedId=(int)$this->db->lastInsertId(); }
        },false);$this->json(['mensagem'=>'Módulo salvo','id'=>$savedId],$id?200:201);
    }

    public function saveLesson(?int $id): never
    {
        $user=$this->manager();$data=$this->input();
        $row=$id ? $this->access->managedChild($user,'licao',$id) : $this->access->managedChild($user,'modulo',$this->integer($data,'modulo_id',1,PHP_INT_MAX));
        $title=$this->text($data,'titulo',120,3);$order=$this->integer($data,'ordem',1,9999);$xp=$this->integer($data,'xp',0,1000);
        $savedId=$id;
        $this->change($row['curso'],function () use (&$savedId,$id,$row,$title,$order,$xp): void {
            if ($id) { $q=$this->db->prepare('UPDATE licao SET titulo=?,xp=?,ordem=? WHERE id=?');$q->execute([$title,$xp,$order,$id]); }
            else { $q=$this->db->prepare("INSERT INTO licao (modulo_id,titulo,kind,xp,ordem) VALUES (?,?,'lesson',?,?)");$q->execute([(int)$row['id'],$title,$xp,$order]);$savedId=(int)$this->db->lastInsertId(); }
        },false);$this->json(['mensagem'=>'Lição salva','id'=>$savedId],$id?200:201);
    }

    public function saveQuestion(?int $id): never
    {
        $user=$this->manager();$data=$this->input();
        $row=$id ? $this->access->managedChild($user,'pergunta',$id) : $this->access->managedChild($user,'licao',$this->integer($data,'licao_id',1,PHP_INT_MAX));
        $text=$this->text($data,'texto_pergunta',2000,3);$explanation=$this->text($data,'explicacao',500);$points=$this->integer($data,'pontos_recompensa',1,1000);
        $options=$data['opcoes']??null;
        if (!is_array($options) || count($options)!==4 || !array_is_list($options)) throw new LearningException('Informe quatro alternativas',422);
        $correct=0;$clean=[];
        foreach ($options as $option) {
            if (!is_array($option) || !isset($option['is_correta']) || !in_array($option['is_correta'],[true,false,0,1],true)) throw new LearningException('Marque a alternativa correta',422);
            $value=$this->text($option,'texto_opcao',255,1);$right=(int)$option['is_correta'];$correct+=$right;$clean[]=[$value,$right];
        }
        if ($correct!==1) throw new LearningException('Marque exatamente uma alternativa correta',422);
        if (count(array_unique(array_map(fn($o)=>mb_strtolower($o[0]),$clean)))!==4) throw new LearningException('As alternativas devem ser diferentes',422);
        $savedId=$id;
        $this->change($row['curso'],function () use (&$savedId,$id,$row,$user,$text,$explanation,$points,$clean): void {
            if ($id) {
                $q=$this->db->prepare('UPDATE pergunta_quiz SET texto_pergunta=?,explicacao=?,pontos_recompensa=? WHERE id=?');$q->execute([$text,$explanation,$points,$id]);
                $q=$this->db->prepare('DELETE FROM opcao_quiz WHERE pergunta_id=?');$q->execute([$id]);
            } else {
                $q=$this->db->prepare('INSERT INTO pergunta_quiz (criador_id,licao_id,texto_pergunta,explicacao,pontos_recompensa) VALUES (?,?,?,?,?)');
                $q->execute([(int)$user['id'],(int)$row['id'],$text,$explanation,$points]);$savedId=(int)$this->db->lastInsertId();
            }
            $q=$this->db->prepare('INSERT INTO opcao_quiz (pergunta_id,texto_opcao,is_correta) VALUES (?,?,?)');
            foreach ($clean as [$value,$right]) $q->execute([$savedId,$value,$right]);
        },false);$this->json(['mensagem'=>'Pergunta salva','id'=>$savedId],$id?200:201);
    }

    public function archive(string $type,int $id): never
    {
        $user=$this->manager();$row=$type==='curso' ? $this->access->managedCourse($user,$id) : $this->access->managedChild($user,$type,$id);
        $table=match($type) {'curso'=>'curso','modulo'=>'modulo','licao'=>'licao','pergunta'=>'pergunta_quiz'};
        $this->change($type==='curso'?$row:$row['curso'],function () use ($table,$id): void {
            $q=$this->db->prepare("UPDATE $table SET ativo=0 WHERE id=?");$q->execute([$id]);
        },false);$this->json(['mensagem'=>'Conteúdo arquivado; o progresso registrado foi preservado']);
    }

    private function change(array $course,callable $operation,bool $draftOnly=true): void
    {
        try {
            $this->db->beginTransaction();
            $lock=$this->db->prepare('SELECT * FROM curso WHERE id=?'.($this->db->getAttribute(PDO::ATTR_DRIVER_NAME)==='mysql'?' FOR UPDATE':''));$lock->execute([(int)$course['id']]);$fresh=$lock->fetch();
            if (!$fresh || !(int)$fresh['ativo']) throw new LearningException('Curso indisponível',404);
            if ($draftOnly) $this->access->editable($fresh);
            $operation();$this->db->commit();
        } catch (Throwable $e) { if ($this->db->inTransaction()) $this->db->rollBack();throw $e; }
    }
    private function text(array $data,string $key,int $max,int $min=0): string
    {
        $value=$data[$key]??'';
        if (!is_string($value)) throw new LearningException('Campo inválido: '.$key,422);
        $value=trim($value);$length=mb_strlen($value);
        if ($length<$min || $length>$max) throw new LearningException("O campo $key deve ter entre $min e $max caracteres",422);
        return $value;
    }
    private function integer(array $data,string $key,int $min,int $max): int
    {
        $value=filter_var($data[$key]??null,FILTER_VALIDATE_INT,['options'=>['min_range'=>$min,'max_range'=>$max]]);
        if ($value===false) throw new LearningException('Número inválido: '.$key,422);
        return $value;
    }
}
