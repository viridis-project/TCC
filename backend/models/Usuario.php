<?php

declare(strict_types=1);

namespace Viridis\models;

final class Usuario extends BaseModel
{
    public function findByLogin(string $login): array|false
    {
        $stmt = $this->db->prepare('SELECT u.*, p.nome AS perfil_nome FROM usuario u JOIN perfil p ON p.id=u.perfil_id WHERE u.username=? OR u.email=? LIMIT 1');
        $stmt->execute([$login, $login]);
        return $stmt->fetch();
    }

    public function exists(string $email, string $username): bool
    {
        $stmt = $this->db->prepare('SELECT 1 FROM usuario WHERE email=? OR username=? LIMIT 1');
        $stmt->execute([$email, $username]);
        return (bool) $stmt->fetchColumn();
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            "INSERT INTO usuario (nome,username,email,senha,cpf,perfil_id,instituicao_id,turma_id,turma)
             VALUES (?,?,?,?,NULL,(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1),?,?,?)"
        );
        $stmt->execute([
            $data['nome'], $data['username'], $data['email'], password_hash($data['senha'], PASSWORD_DEFAULT),
            $data['instituicao_id'], $data['turma_id'], $data['turma'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public static function publicData(array $user): array
    {
        unset($user['senha'], $user['cpf']);
        foreach (['notificacoes_ativas', 'tema_escuro'] as $field) {
            if (isset($user[$field])) $user[$field] = (bool) $user[$field];
        }
        return $user;
    }
}
