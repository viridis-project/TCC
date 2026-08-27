<?php

declare(strict_types=1);

namespace Viridis\middleware;

use PDO;

final class AuthMiddleware
{
    public function __construct(private PDO $db) {}

    public function user(array $roles = []): array
    {
        $id = (int) ($_SESSION['usuario_id'] ?? 0);
        if ($id < 1) {
            $this->fail('Faça login para continuar', 401);
        }
        $stmt = $this->db->prepare(
            'SELECT u.*, p.nome AS perfil_nome, i.nome AS instituicao_nome, t.nome AS turma_nome,
                    t.instituicao_id AS turma_instituicao_id
             FROM usuario u JOIN perfil p ON p.id = u.perfil_id
             LEFT JOIN turma_escolar t ON t.id = u.turma_id
             LEFT JOIN instituicao i ON i.id = COALESCE(t.instituicao_id,u.instituicao_id) WHERE u.id = ?'
        );
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        if (!$user) {
            session_destroy();
            $this->fail('Sessão inválida', 401);
        }
        if ($user['turma_id'] !== null) {
            $user['instituicao_id'] = (int) $user['turma_instituicao_id'];
            $user['turma'] = $user['turma_nome'];
        }
        unset($user['turma_instituicao_id']);
        if ($roles !== [] && !in_array($user['perfil_nome'], $roles, true)) {
            $this->fail('Você não tem permissão para esta ação', 403);
        }
        return $user;
    }

    private function fail(string $message, int $status): never
    {
        http_response_code($status);
        echo json_encode(['erro' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
