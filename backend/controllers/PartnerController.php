<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use Throwable;
use Viridis\middleware\AuthMiddleware;

final class PartnerController extends Controller
{
    public function __construct(private PDO $db, private AuthMiddleware $auth) {}

    public function handle(string $method, ?int $id): never
    {
        $this->auth->user(['admin']);
        if ($method === 'GET') {
            $stmt = $this->db->prepare('SELECT id,nome,tipo,email,telefone,ativo FROM parceiro WHERE (? IS NULL OR id=?) ORDER BY nome');
            $stmt->execute([$id,$id]);
            $rows=$stmt->fetchAll();
            if ($id && $rows===[]) $this->json(['erro'=>'Parceiro não encontrado'],404);
            $this->json([$id?'parceiro':'parceiros'=>$id?$rows[0]:$rows]);
        }
        $data=$this->input();
        if ($method==='POST') {
            $this->required($data,['nome','tipo','email']); $this->validate($data);
            try { $stmt=$this->db->prepare('INSERT INTO parceiro (nome,tipo,email,telefone,ativo) VALUES (?,?,?,?,?)'); $stmt->execute([trim($data['nome']),$data['tipo'],mb_strtolower(trim($data['email'])),trim((string)($data['telefone']??''))?:null,(int)($data['ativo']??1)]); }
            catch (Throwable) { $this->json(['erro'=>'E-mail já cadastrado'],409); }
            $this->json(['mensagem'=>'Parceiro adicionado','id'=>(int)$this->db->lastInsertId()],201);
        }
        if (!$id) $this->json(['erro'=>'Informe o parceiro'],422);
        if ($method==='PUT') {
            $this->required($data,['nome','tipo','email']); $this->validate($data);
            $stmt=$this->db->prepare('UPDATE parceiro SET nome=?,tipo=?,email=?,telefone=?,ativo=? WHERE id=?');
            $stmt->execute([trim($data['nome']),$data['tipo'],mb_strtolower(trim($data['email'])),trim((string)($data['telefone']??''))?:null,(int)($data['ativo']??1),$id]);
            if (!$stmt->rowCount()) { $check=$this->db->prepare('SELECT 1 FROM parceiro WHERE id=?'); $check->execute([$id]); if (!$check->fetchColumn()) $this->json(['erro'=>'Parceiro não encontrado'],404); }
            $this->json(['mensagem'=>'Parceiro atualizado']);
        }
        if ($method==='DELETE') {
            $stmt=$this->db->prepare('UPDATE parceiro SET ativo=0 WHERE id=?'); $stmt->execute([$id]);
            if (!$stmt->rowCount()) $this->json(['erro'=>'Parceiro não encontrado'],404);
            $this->json(['mensagem'=>'Parceiro desativado']);
        }
        $this->json(['erro'=>'Método não permitido'],405);
    }

    private function validate(array $data): void
    {
        $types=['Vegetais','Padaria','Educação','Ferramentas','Reciclagem','Outros'];
        if (mb_strlen(trim((string)$data['nome']))<2) $this->json(['erro'=>'Informe um nome válido'],422);
        if (!filter_var($data['email'],FILTER_VALIDATE_EMAIL)) $this->json(['erro'=>'E-mail inválido'],422);
        if (!in_array($data['tipo'],$types,true)) $this->json(['erro'=>'Categoria inválida'],422);
    }
}

