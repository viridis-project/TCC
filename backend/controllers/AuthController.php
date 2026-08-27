<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use Viridis\models\Usuario;

final class AuthController extends Controller
{
    private Usuario $users;

    public function __construct(private PDO $db)
    {
        $this->users = new Usuario($db);
    }

    public function registro(): never
    {
        $data = $this->input();
        $this->required($data, ['email', 'username', 'senha', 'codigo_turma']);
        $email = mb_strtolower(trim((string) $data['email']));
        $username = trim((string) $data['username']);
        $password = (string) $data['senha'];
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $this->json(['erro' => 'E-mail inválido'], 422);
        if (!preg_match('/^[\p{L}\p{N}._-]{3,50}$/u', $username)) $this->json(['erro' => 'Nome de usuário inválido'], 422);
        if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/\d/', $password)) {
            $this->json(['erro' => 'A senha deve ter 8 caracteres, uma maiúscula e um número'], 422);
        }
        $classCode = strtoupper(trim((string) $data['codigo_turma']));
        $class = $this->db->prepare('SELECT id,nome,instituicao_id FROM turma_escolar WHERE codigo_acesso=? AND codigo_ativo=1 LIMIT 1');
        $class->execute([$classCode]);
        $classRow = $class->fetch();
        if (!$classRow) $this->json(['erro' => 'Código de turma inválido ou expirado'], 422);
        if ($this->users->exists($email, $username)) $this->json(['erro' => 'E-mail ou usuário já cadastrado'], 409);
        $id = $this->users->create([
            'nome' => trim((string) ($data['nome'] ?? $username)),
            'username' => $username,
            'email' => $email,
            'senha' => $password,
            'instituicao_id' => (int) $classRow['instituicao_id'],
            'turma_id' => (int) $classRow['id'],
            'turma' => $classRow['nome'],
        ]);
        session_regenerate_id(true);
        $_SESSION['usuario_id'] = $id;
        $this->json(['mensagem' => 'Conta criada com sucesso!', 'usuario_id' => $id], 201);
    }

    public function login(): never
    {
        $data = $this->input();
        $this->required($data, ['login', 'senha']);
        $user = $this->users->findByLogin(trim((string) $data['login']));
        if (!$user || !password_verify((string) $data['senha'], $user['senha'])) {
            $this->json(['erro' => 'Usuário ou senha inválidos'], 401);
        }
        session_regenerate_id(true);
        $_SESSION['usuario_id'] = (int) $user['id'];
        $this->json(['mensagem' => 'Bem-vinda de volta!', 'usuario' => Usuario::publicData($user)]);
    }

    public function logout(): never
    {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        session_destroy();
        $this->json(['mensagem' => 'Você saiu da sua conta']);
    }
}
