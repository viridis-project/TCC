<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use Throwable;
use Viridis\middleware\AuthMiddleware;

final class ConviteDiretorController extends Controller
{
    public function __construct(private PDO $db, private AuthMiddleware $auth, private array $config) {}

    public function create(): never
    {
        $admin = $this->auth->user(['admin']);
        $data = $this->input();
        $email = mb_strtolower(trim((string) ($data['email'] ?? '')));
        $institutionId = (int) ($data['instituicao_id'] ?? 0);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {
            $this->json(['erro' => 'E-mail inválido ou longo demais'], 422);
        }

        $institutionStmt = $this->db->prepare('SELECT id,nome FROM instituicao WHERE id=?');
        $institutionStmt->execute([$institutionId]);
        $institution = $institutionStmt->fetch();
        if (!$institution) $this->json(['erro' => 'Selecione uma escola válida'], 422);

        $exists = $this->db->prepare('SELECT 1 FROM usuario WHERE email=? LIMIT 1');
        $exists->execute([$email]);
        if ($exists->fetchColumn()) $this->json(['erro' => 'Este e-mail já possui uma conta'], 409);

        $token = bin2hex(random_bytes(32));
        $pending = $this->db->prepare(
            'SELECT id FROM convite_diretor WHERE email=? AND usado_em IS NULL ORDER BY id DESC LIMIT 1'
        );
        $pending->execute([$email]);
        $pendingId = $pending->fetchColumn();
        if ($pendingId) {
            $stmt = $this->db->prepare(
                'UPDATE convite_diretor SET token=?,criado_por=?,instituicao_id=?,criado_em=NOW(),expira_em=DATE_ADD(NOW(),INTERVAL 7 DAY) WHERE id=?'
            );
            $stmt->execute([$token, (int) $admin['id'], $institutionId, (int) $pendingId]);
            $id = (int) $pendingId;
        } else {
            $stmt = $this->db->prepare(
                'INSERT INTO convite_diretor (email,instituicao_id,token,criado_por,expira_em) VALUES (?,?,?,?,DATE_ADD(NOW(),INTERVAL 7 DAY))'
            );
            $stmt->execute([$email, $institutionId, $token, (int) $admin['id']]);
            $id = (int) $this->db->lastInsertId();
        }

        $link = rtrim((string) $this->config['frontend_origin'], '/') . '/convite-diretor/' . $token;
        $this->json([
            'mensagem' => 'Convite criado para envio manual',
            'id' => $id,
            'link' => $link,
            'escola' => (string) $institution['nome'],
        ], 201);
    }

    public function list(): never
    {
        $this->auth->user(['admin']);
        $stmt = $this->db->query("SELECT c.id,c.email,c.instituicao_id,i.nome instituicao_nome,c.expira_em,c.usado_em,c.criado_em,
            CASE WHEN c.usado_em IS NOT NULL THEN 'aceito' WHEN c.expira_em<NOW() THEN 'expirado' ELSE 'pendente' END status
            FROM convite_diretor c JOIN instituicao i ON i.id=c.instituicao_id ORDER BY c.criado_em DESC,c.id DESC");
        $invites = $stmt->fetchAll();
        foreach ($invites as &$invite) {
            $invite['id'] = (int) $invite['id'];
            $invite['instituicao_id'] = (int) $invite['instituicao_id'];
        }
        unset($invite);
        $this->json(['convites' => $invites]);
    }

    public function cancel(int $id): never
    {
        $this->auth->user(['admin']);
        $stmt = $this->db->prepare('DELETE FROM convite_diretor WHERE id=? AND usado_em IS NULL');
        $stmt->execute([$id]);
        if (!$stmt->rowCount()) $this->json(['erro' => 'Convite não encontrado ou já utilizado'], 404);
        $this->json(['mensagem' => 'Convite cancelado']);
    }

    public function detail(string $token): never
    {
        $stmt = $this->db->prepare(
            'SELECT c.email,c.expira_em,c.usado_em,i.nome instituicao_nome FROM convite_diretor c JOIN instituicao i ON i.id=c.instituicao_id WHERE c.token=?'
        );
        $stmt->execute([$token]);
        $invite = $stmt->fetch();
        if (!$invite) $this->json(['erro' => 'Convite não encontrado'], 404);
        if ($invite['usado_em'] !== null) $this->json(['erro' => 'Este convite já foi utilizado'], 410);
        if (strtotime((string) $invite['expira_em']) < time()) $this->json(['erro' => 'Este convite expirou'], 410);
        unset($invite['usado_em']);
        $this->json(['convite' => $invite]);
    }

    public function accept(string $token): never
    {
        $data = $this->input();
        $name = trim((string) ($data['nome'] ?? ''));
        $password = (string) ($data['senha'] ?? '');
        if (mb_strlen($name) < 3 || mb_strlen($name) > 150) {
            $this->json(['erro' => 'Informe um nome completo com até 150 caracteres'], 422);
        }
        if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/\d/', $password)) {
            $this->json(['erro' => 'A senha deve ter 8 caracteres, uma maiúscula e um número'], 422);
        }

        try {
            $this->db->beginTransaction();
            $stmt = $this->db->prepare('SELECT * FROM convite_diretor WHERE token=? FOR UPDATE');
            $stmt->execute([$token]);
            $invite = $stmt->fetch();
            if (!$invite) {
                $this->db->rollBack();
                $this->json(['erro' => 'Convite não encontrado'], 404);
            }
            if ($invite['usado_em'] !== null) {
                $this->db->rollBack();
                $this->json(['erro' => 'Este convite já foi utilizado'], 410);
            }
            if (strtotime((string) $invite['expira_em']) < time()) {
                $this->db->rollBack();
                $this->json(['erro' => 'Este convite expirou'], 410);
            }

            $exists = $this->db->prepare('SELECT 1 FROM usuario WHERE email=?');
            $exists->execute([$invite['email']]);
            if ($exists->fetchColumn()) {
                $this->db->rollBack();
                $this->json(['erro' => 'Este e-mail já possui uma conta'], 409);
            }

            $insert = $this->db->prepare(
                "INSERT INTO usuario (nome,email,senha,cpf,perfil_id,instituicao_id) VALUES (?,?,?,NULL,(SELECT id FROM perfil WHERE nome='diretor' LIMIT 1),?)"
            );
            $insert->execute([
                $name,
                $invite['email'],
                password_hash($password, PASSWORD_DEFAULT),
                (int) $invite['instituicao_id'],
            ]);
            $userId = (int) $this->db->lastInsertId();
            $update = $this->db->prepare('UPDATE convite_diretor SET usado_em=NOW(),usuario_criado_id=? WHERE id=? AND usado_em IS NULL');
            $update->execute([$userId, (int) $invite['id']]);
            if (!$update->rowCount()) throw new \RuntimeException('Convite utilizado simultaneamente');

            $this->db->commit();
            $this->json(['mensagem' => 'Conta de diretor criada. Faça login para continuar.'], 201);
        } catch (Throwable $error) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            throw $error;
        }
    }
}
