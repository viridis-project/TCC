<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use PDOException;
use Viridis\middleware\AuthMiddleware;

final class AchievementController extends Controller
{
    private const ICONS = ['Sprout', 'Recycle', 'Flame', 'Bug', 'Trophy', 'Medal', 'BookOpen', 'Award', 'Star', 'Leaf'];
    private const TARGET_LIMITS = [
        'licoes' => [1, 10000],
        'streak' => [1, 3650],
        'ranking' => [1, 100],
    ];

    public function __construct(private PDO $db, private AuthMiddleware $auth) {}

    public function manage(string $method): never
    {
        $this->auth->user(['admin']);

        if ($method === 'GET') {
            $achievements = $this->db->query(
                'SELECT id,titulo,descricao,icone,regra FROM conquista ORDER BY id'
            )->fetchAll();
            $modules = $this->db->query(
                "SELECT m.id,m.titulo,c.titulo curso
                 FROM modulo m JOIN curso c ON c.id=m.curso_id
                 WHERE m.ativo=1 AND c.ativo=1 AND c.publicado=1 AND c.escopo='app'
                 ORDER BY c.titulo,m.ordem,m.id"
            )->fetchAll();
            $this->json(['conquistas' => $achievements, 'modulos' => $modules]);
        }

        if ($method !== 'POST') $this->json(['erro' => 'Método não permitido'], 405);

        $data = $this->input();
        $title = trim((string)($data['titulo'] ?? ''));
        $description = trim((string)($data['descricao'] ?? ''));
        $icon = trim((string)($data['icone'] ?? ''));
        $type = trim((string)($data['tipo_regra'] ?? ''));

        if (mb_strlen($title) < 3 || mb_strlen($title) > 100) {
            $this->json(['erro' => 'O título deve ter entre 3 e 100 caracteres'], 422);
        }
        if (mb_strlen($description) < 5 || mb_strlen($description) > 255) {
            $this->json(['erro' => 'A descrição deve ter entre 5 e 255 caracteres'], 422);
        }
        if (!in_array($icon, self::ICONS, true)) {
            $this->json(['erro' => 'Escolha um ícone válido'], 422);
        }

        $rule = $this->buildRule($type, $data['meta'] ?? null);
        $duplicate = $this->db->prepare('SELECT 1 FROM conquista WHERE regra=?');
        $duplicate->execute([$rule]);
        if ($duplicate->fetchColumn()) {
            $this->json(['erro' => 'Já existe uma conquista com esse critério'], 409);
        }

        try {
            $insert = $this->db->prepare(
                'INSERT INTO conquista (titulo,descricao,icone,regra) VALUES (?,?,?,?)'
            );
            $insert->execute([$title, $description, $icon, $rule]);
        } catch (PDOException $error) {
            if ($error->getCode() === '23000') {
                $this->json(['erro' => 'Já existe uma conquista com esse critério'], 409);
            }
            throw $error;
        }

        $id = (int)$this->db->lastInsertId();
        $this->json([
            'mensagem' => 'Conquista criada com sucesso!',
            'conquista' => [
                'id' => $id,
                'titulo' => $title,
                'descricao' => $description,
                'icone' => $icon,
                'regra' => $rule,
            ],
        ], 201);
    }

    private function buildRule(string $type, mixed $rawTarget): string
    {
        if ($type === 'todos_modulos') return $type;

        if ($type === 'modulo_completo') {
            $moduleId = filter_var($rawTarget, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
            if ($moduleId === false) $this->json(['erro' => 'Escolha um módulo válido'], 422);

            $module = $this->db->prepare(
                "SELECT 1 FROM modulo m JOIN curso c ON c.id=m.curso_id
                 WHERE m.id=? AND m.ativo=1 AND c.ativo=1 AND c.publicado=1 AND c.escopo='app'"
            );
            $module->execute([$moduleId]);
            if (!$module->fetchColumn()) {
                $this->json(['erro' => 'O módulo precisa pertencer a um curso geral publicado'], 422);
            }
            return $type.':'.$moduleId;
        }

        if (!isset(self::TARGET_LIMITS[$type])) {
            $this->json(['erro' => 'Escolha um critério válido'], 422);
        }
        [$minimum, $maximum] = self::TARGET_LIMITS[$type];
        $target = filter_var($rawTarget, FILTER_VALIDATE_INT, [
            'options' => ['min_range' => $minimum, 'max_range' => $maximum],
        ]);
        if ($target === false) {
            $this->json(['erro' => "Informe uma meta entre $minimum e $maximum"], 422);
        }
        return $type.':'.$target;
    }
}
