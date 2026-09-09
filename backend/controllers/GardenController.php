<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use Viridis\middleware\AuthMiddleware;

final class GardenController extends Controller
{
    public function __construct(private PDO $db, private AuthMiddleware $auth) {}

    public function schools(): never
    {
        $this->auth->user(['admin']);
        $stmt = $this->db->query(
            'SELECT i.id,i.nome,
                (SELECT COUNT(*) FROM turma_escolar t WHERE t.instituicao_id=i.id) total_turmas
             FROM instituicao i ORDER BY i.nome,i.id'
        );
        $this->json(['escolas'=>$stmt->fetchAll()]);
    }

    public function classes(): never
    {
        $user = $this->auth->user(['admin','professor','diretor']);
        [$scope, $params] = $this->classScope($user);
        $school = null;
        if ($user['perfil_nome'] === 'admin') {
            $institutionId = $this->positiveInt('instituicao_id');
            $stmt = $this->db->prepare('SELECT id,nome FROM instituicao WHERE id=?');
            $stmt->execute([$institutionId]);
            $school = $stmt->fetch();
            if (!$school) $this->json(['erro'=>'Escola não encontrada'],404);
            $scope .= ' AND t.instituicao_id=?';
            $params[] = $institutionId;
        }
        $stmt = $this->db->prepare(
            "SELECT t.id,t.nome,t.ano_letivo,t.instituicao_id,i.nome escola,
                (SELECT COUNT(*) FROM usuario u JOIN perfil p ON p.id=u.perfil_id
                 WHERE u.turma_id=t.id AND p.nome='aluno') total_alunos,
                (SELECT COUNT(*) FROM submissao_missao s JOIN usuario u ON u.id=s.aluno_id
                 WHERE u.turma_id=t.id) total_envios,
                (SELECT COUNT(*) FROM submissao_missao s JOIN usuario u ON u.id=s.aluno_id
                 WHERE u.turma_id=t.id AND s.status='pending') pendentes
             FROM turma_escolar t JOIN instituicao i ON i.id=t.instituicao_id
             WHERE $scope ORDER BY t.ano_letivo DESC,t.nome,t.id"
        );
        $stmt->execute($params);
        $this->json(['escola'=>$school,'turmas'=>$stmt->fetchAll()]);
    }

    public function detail(int $classId): never
    {
        $user = $this->auth->user(['admin','professor','diretor']);
        [$scope, $params] = $this->classScope($user);
        $stmt = $this->db->prepare(
            "SELECT t.id,t.nome,t.ano_letivo,t.instituicao_id,i.nome escola
             FROM turma_escolar t JOIN instituicao i ON i.id=t.instituicao_id
             WHERE t.id=? AND $scope"
        );
        $stmt->execute([$classId, ...$params]);
        $class = $stmt->fetch();
        if (!$class) $this->json(['erro'=>'Turma não encontrada ou sem acesso'],404);

        $tab = $_GET['aba'] ?? 'envios';
        $status = $_GET['status'] ?? 'all';
        $type = $_GET['tipo'] ?? 'all';
        if (!in_array($tab,['envios','alteracoes'],true)
            || !in_array($status,['all','pending','approved','rejected'],true)
            || !in_array($type,['all','plant','water','compost','share','outro'],true)) {
            $this->json(['erro'=>'Filtro inválido'],422);
        }
        $page = $this->positiveInt('pagina',1);
        $summary = $this->db->prepare(
            "SELECT COUNT(*) total_envios,
                COALESCE(SUM(CASE WHEN s.status='pending' THEN 1 ELSE 0 END),0) pendentes,
                COALESCE(SUM(CASE WHEN s.status='approved' THEN 1 ELSE 0 END),0) aprovados,
                COALESCE(SUM(CASE WHEN s.status='rejected' THEN 1 ELSE 0 END),0) rejeitados
             FROM submissao_missao s JOIN usuario u ON u.id=s.aluno_id WHERE u.turma_id=?"
        );
        $summary->execute([$classId]);

        $where = 'u.turma_id=?';
        $bindings = [$classId];
        if ($tab === 'alteracoes') $where .= ' AND s.revisado_em IS NOT NULL';
        if ($status !== 'all') { $where .= ' AND s.status=?'; $bindings[] = $status; }
        if ($type !== 'all') { $where .= ' AND m.tipo=?'; $bindings[] = $type; }
        $from = 'FROM submissao_missao s JOIN usuario u ON u.id=s.aluno_id
                 JOIN missao m ON m.id=s.missao_id LEFT JOIN usuario r ON r.id=s.revisado_por';
        $count = $this->db->prepare("SELECT COUNT(*) $from WHERE $where");
        $count->execute($bindings);
        $total = (int)$count->fetchColumn();
        $pages = max(1,(int)ceil($total / 12));
        $page = min($page,$pages);
        $order = $tab === 'alteracoes' ? 's.revisado_em' : 's.data_envio';
        $rows = $this->db->prepare(
            "SELECT s.id,s.descricao,s.url_foto,s.status,s.data_envio,s.revisado_em,
                    s.comentario_professor,u.nome aluno,m.titulo atividade,m.tipo,r.nome revisor
             $from WHERE $where ORDER BY $order DESC,s.id DESC LIMIT ? OFFSET ?"
        );
        foreach ($bindings as $index => $value) {
            $rows->bindValue($index + 1,$value,is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        $rows->bindValue(count($bindings) + 1,12,PDO::PARAM_INT);
        $rows->bindValue(count($bindings) + 2,($page - 1) * 12,PDO::PARAM_INT);
        $rows->execute();
        $this->json([
            'turma'=>$class,'resumo'=>$summary->fetch(),'registros'=>$rows->fetchAll(),
            'paginacao'=>['pagina'=>$page,'paginas'=>$pages,'total'=>$total],
        ]);
    }

    private function classScope(array $user): array
    {
        return match ($user['perfil_nome']) {
            'admin' => ['1=1',[]],
            'diretor' => ['t.instituicao_id=?',[(int)($user['instituicao_id'] ?? 0)]],
            'professor' => [
                't.instituicao_id=? AND EXISTS (SELECT 1 FROM turma_professor tp
                 WHERE tp.turma_id=t.id AND tp.professor_id=?)',
                [(int)($user['instituicao_id'] ?? 0),(int)$user['id']],
            ],
            default => ['1=0',[]],
        };
    }

    private function positiveInt(string $name, ?int $default = null): int
    {
        $value = filter_var($_GET[$name] ?? $default,FILTER_VALIDATE_INT,['options'=>['min_range'=>1]]);
        if ($value === false) $this->json(['erro'=>'Parâmetro inválido: '.$name],422);
        return $value;
    }
}
