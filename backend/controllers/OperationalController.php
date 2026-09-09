<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use Viridis\middleware\AuthMiddleware;
use Viridis\services\LearningAccess;

final class OperationalController extends Controller
{
    public function __construct(private PDO $db, private AuthMiddleware $auth) {}

    public function schedule(string $method, ?int $id): never
    {
        $user=$this->auth->user(['aluno']);
        if ($method==='GET') {
            $stmt=$this->db->prepare('SELECT c.id,c.missao_id,m.titulo,m.tipo,c.data_sugerida,c.data_limite_personalizada,c.status_atividade FROM cronograma_aluno c JOIN missao m ON m.id=c.missao_id WHERE c.aluno_id=? ORDER BY COALESCE(c.data_limite_personalizada,c.data_sugerida)');
            $stmt->execute([(int)$user['id']]); $this->json(['cronograma'=>$stmt->fetchAll()]);
        }
        $data=$this->input();
        if ($method==='POST') {
            $this->required($data,['missao_id','data_sugerida']);
            $stmt=$this->db->prepare('INSERT INTO cronograma_aluno (aluno_id,missao_id,data_sugerida,data_limite_personalizada,status_atividade) VALUES (?,?,?,?,?)');
            $stmt->execute([(int)$user['id'],(int)$data['missao_id'],$data['data_sugerida'],$data['data_limite_personalizada']??null,$data['status_atividade']??'Pendente']);
            $this->json(['mensagem'=>'Atividade adicionada ao cronograma','id'=>(int)$this->db->lastInsertId()],201);
        }
        if (!$id) $this->json(['erro'=>'Informe o item do cronograma'],422);
        if ($method==='PUT') {
            $stmt=$this->db->prepare('UPDATE cronograma_aluno SET data_sugerida=?,data_limite_personalizada=?,status_atividade=? WHERE id=? AND aluno_id=?');
            $stmt->execute([$data['data_sugerida']??null,$data['data_limite_personalizada']??null,$data['status_atividade']??'Pendente',$id,(int)$user['id']]);
            if (!$stmt->rowCount()) $this->json(['erro'=>'Item não encontrado'],404);
            $this->json(['mensagem'=>'Cronograma atualizado']);
        }
        if ($method==='DELETE') {
            $stmt=$this->db->prepare('DELETE FROM cronograma_aluno WHERE id=? AND aluno_id=?'); $stmt->execute([$id,(int)$user['id']]);
            if (!$stmt->rowCount()) $this->json(['erro'=>'Item não encontrado'],404);
            $this->json(['mensagem'=>'Atividade removida do cronograma']);
        }
        $this->json(['erro'=>'Método não permitido'],405);
    }

    public function dashboard(): never
    {
        $user=$this->auth->user(['professor','admin']);
        $institution=(int)($user['instituicao_id']??0);
        $pending=$this->db->prepare("SELECT COUNT(*) FROM submissao_missao s JOIN usuario u ON u.id=s.aluno_id WHERE s.status='pending' AND (?=0 OR u.instituicao_id=?)");
        $pending->execute([$institution,$institution]);
        $classes=$this->db->prepare("SELECT t.nome,SUM(u.pontos_totais) pontos FROM usuario u JOIN perfil p ON p.id=u.perfil_id JOIN turma_escolar t ON t.id=u.turma_id WHERE p.nome='aluno' AND (?=0 OR t.instituicao_id=?) GROUP BY t.id,t.nome ORDER BY pontos DESC");
        $classes->execute([$institution,$institution]);
        $weekly=$this->db->prepare("SELECT DATE_FORMAT(s.revisado_em,'%x-S%v') semana,SUM(m.pontos_recompensa) valor,COUNT(*) aprovacoes FROM submissao_missao s JOIN missao m ON m.id=s.missao_id JOIN usuario u ON u.id=s.aluno_id WHERE s.status='approved' AND s.revisado_em>=DATE_SUB(CURDATE(),INTERVAL 8 WEEK) AND (?=0 OR u.instituicao_id=?) GROUP BY YEARWEEK(s.revisado_em,1) ORDER BY YEARWEEK(s.revisado_em,1)");
        $weekly->execute([$institution,$institution]);
        $this->json(['pendencias'=>(int)$pending->fetchColumn(),'ranking_turmas'=>$classes->fetchAll(),'progresso_semanal'=>$weekly->fetchAll()]);
    }

    public function garden(): never
    {
        $user=$this->auth->user(['aluno']);
        $stmt=$this->db->prepare("SELECT m.tipo,COUNT(*) quantidade FROM submissao_missao s JOIN missao m ON m.id=s.missao_id WHERE s.aluno_id=? AND s.status='approved' GROUP BY m.tipo");
        $stmt->execute([(int)$user['id']]);
        $counts=['plant'=>0,'water'=>0,'compost'=>0,'share'=>0];
        foreach ($stmt->fetchAll() as $row) $counts[$row['tipo']] = (int)$row['quantidade'];
        $plants=$counts['plant']; $water=$counts['water']; $compost=$counts['compost'];
        $achievements=$this->db->prepare('SELECT c.id,c.titulo,c.descricao,c.icone,c.regra,CASE WHEN uc.usuario_id IS NULL THEN 0 ELSE 1 END conquistada,uc.conquistada_em FROM conquista c LEFT JOIN usuario_conquista uc ON uc.conquista_id=c.id AND uc.usuario_id=? ORDER BY c.id');
        $achievements->execute([(int)$user['id']]);
        $growth=$this->db->prepare("SELECT DATE_FORMAT(s.revisado_em,'%Y-%m') mes,SUM(m.pontos_recompensa) valor FROM submissao_missao s JOIN missao m ON m.id=s.missao_id WHERE s.aluno_id=? AND s.status='approved' AND s.revisado_em>=DATE_SUB(CURDATE(),INTERVAL 5 MONTH) GROUP BY DATE_FORMAT(s.revisado_em,'%Y-%m') ORDER BY mes");
        $growth->execute([(int)$user['id']]);
        $this->json(['resumo'=>[
            'plantas_ativas'=>$plants,
            'litros_economizados'=>$water*10,
            'kg_residuos_reciclados'=>$compost*2,
            'kg_co2_reduzido'=>round($plants*1.5+$compost*0.5,1),
            'atividades_por_tipo'=>$counts,
        ],'crescimento'=>$growth->fetchAll(),'conquistas'=>$achievements->fetchAll()]);
    }

    public function certificates(): never
    {
        $user=$this->auth->user(['aluno']);
        $modules=(new LearningAccess($this->db))->modules($user);
        $lessons=array_merge([], ...array_column($modules,'licoes'));
        $totalLessons=count($lessons);
        $eligible=$totalLessons>0 && count(array_filter($lessons,fn($l)=>$l['status']==='completed'))===$totalLessons;
        if ($eligible) {
            $check=$this->db->prepare('SELECT id FROM certificado WHERE aluno_id=? LIMIT 1'); $check->execute([(int)$user['id']]);
            if (!$check->fetchColumn()) {
                $code='VIR-'.strtoupper(bin2hex(random_bytes(6)));
                $insert=$this->db->prepare('INSERT INTO certificado (aluno_id,codigo_verificacao,url_pdf) VALUES (?,?,NULL)'); $insert->execute([(int)$user['id'],$code]);
            }
        }
        $stmt=$this->db->prepare('SELECT id,codigo_verificacao,url_pdf,data_emissao FROM certificado WHERE aluno_id=? ORDER BY data_emissao DESC');
        $stmt->execute([(int)$user['id']]);
        $this->json(['elegivel'=>$eligible,'certificados'=>$stmt->fetchAll()]);
    }
}
