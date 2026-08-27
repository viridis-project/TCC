<?php

declare(strict_types=1);

namespace Viridis\controllers;

use PDO;
use Throwable;
use Viridis\middleware\AuthMiddleware;
use Viridis\services\CodeGenerator;
use Viridis\services\EmailService;

final class ConviteProfessorController extends Controller
{
    private CodeGenerator $codes;
    private EmailService $email;

    public function __construct(private PDO $db, private AuthMiddleware $auth, private array $config)
    {
        $this->codes=new CodeGenerator($db);$this->email=new EmailService();
    }

    public function create(): never
    {
        $director=$this->auth->user(['diretor']);$data=$this->input();$address=mb_strtolower(trim((string)($data['email']??'')));
        if(!filter_var($address,FILTER_VALIDATE_EMAIL))$this->json(['erro'=>'E-mail inválido'],422);
        $exists=$this->db->prepare('SELECT 1 FROM usuario WHERE email=? LIMIT 1');$exists->execute([$address]);
        if($exists->fetchColumn())$this->json(['erro'=>'Este e-mail já possui uma conta'],409);
        $token=$this->codes->inviteToken();$institutionId=(int)$director['instituicao_id'];
        $pending=$this->db->prepare('SELECT id FROM convite_professor WHERE email=? AND instituicao_id=? AND usado_em IS NULL ORDER BY id DESC LIMIT 1');
        $pending->execute([$address,$institutionId]);$pendingId=$pending->fetchColumn();
        if($pendingId){$stmt=$this->db->prepare('UPDATE convite_professor SET token=?,criado_por=?,criado_em=NOW(),expira_em=DATE_ADD(NOW(),INTERVAL 7 DAY) WHERE id=?');$stmt->execute([$token,(int)$director['id'],(int)$pendingId]);$id=(int)$pendingId;}
        else{$stmt=$this->db->prepare('INSERT INTO convite_professor (email,instituicao_id,token,criado_por,expira_em) VALUES (?,?,?,?,DATE_ADD(NOW(),INTERVAL 7 DAY))');$stmt->execute([$address,$institutionId,$token,(int)$director['id']]);$id=(int)$this->db->lastInsertId();}
        $link=rtrim((string)$this->config['frontend_origin'],'/').'/convite-professor/'.$token;
        $sent=$this->email->sendTeacherInvite($address,(string)$director['instituicao_nome'],$link);
        $this->json(['mensagem'=>$sent?'Convite enviado':'Convite criado para envio manual','id'=>$id,'link'=>$link,'email_enviado'=>$sent],201);
    }

    public function list(): never
    {
        $director=$this->auth->user(['diretor']);
        $stmt=$this->db->prepare("SELECT id,email,expira_em,usado_em,criado_em,
          CASE WHEN usado_em IS NOT NULL THEN 'aceito' WHEN expira_em<NOW() THEN 'expirado' ELSE 'pendente' END status
          FROM convite_professor WHERE instituicao_id=? ORDER BY criado_em DESC");
        $stmt->execute([(int)$director['instituicao_id']]);$this->json(['convites'=>$stmt->fetchAll()]);
    }

    public function cancel(int $id): never
    {
        $director=$this->auth->user(['diretor']);
        $stmt=$this->db->prepare('DELETE FROM convite_professor WHERE id=? AND instituicao_id=? AND usado_em IS NULL');
        $stmt->execute([$id,(int)$director['instituicao_id']]);if(!$stmt->rowCount())$this->json(['erro'=>'Convite não encontrado ou já utilizado'],404);
        $this->json(['mensagem'=>'Convite cancelado']);
    }

    public function detail(string $token): never
    {
        $stmt=$this->db->prepare('SELECT c.email,c.expira_em,c.usado_em,i.nome instituicao_nome FROM convite_professor c JOIN instituicao i ON i.id=c.instituicao_id WHERE c.token=?');
        $stmt->execute([$token]);$invite=$stmt->fetch();if(!$invite)$this->json(['erro'=>'Convite não encontrado'],404);
        if($invite['usado_em']!==null)$this->json(['erro'=>'Este convite já foi utilizado'],410);
        if(strtotime((string)$invite['expira_em'])<time())$this->json(['erro'=>'Este convite expirou'],410);
        unset($invite['usado_em']);$this->json(['convite'=>$invite]);
    }

    public function accept(string $token): never
    {
        $data=$this->input();$name=trim((string)($data['nome']??''));$password=(string)($data['senha']??'');
        if(mb_strlen($name)<3)$this->json(['erro'=>'Informe seu nome completo'],422);
        if(strlen($password)<8||!preg_match('/[A-Z]/',$password)||!preg_match('/\d/',$password))$this->json(['erro'=>'A senha deve ter 8 caracteres, uma maiúscula e um número'],422);
        try{$this->db->beginTransaction();
            $stmt=$this->db->prepare('SELECT * FROM convite_professor WHERE token=? FOR UPDATE');$stmt->execute([$token]);$invite=$stmt->fetch();
            if(!$invite){$this->db->rollBack();$this->json(['erro'=>'Convite não encontrado'],404);}
            if($invite['usado_em']!==null){$this->db->rollBack();$this->json(['erro'=>'Este convite já foi utilizado'],410);}
            if(strtotime((string)$invite['expira_em'])<time()){$this->db->rollBack();$this->json(['erro'=>'Este convite expirou'],410);}
            $exists=$this->db->prepare('SELECT 1 FROM usuario WHERE email=?');$exists->execute([$invite['email']]);
            if($exists->fetchColumn()){$this->db->rollBack();$this->json(['erro'=>'Este e-mail já possui uma conta'],409);}
            $insert=$this->db->prepare("INSERT INTO usuario (nome,email,senha,cpf,perfil_id,instituicao_id) VALUES (?,?,?,NULL,(SELECT id FROM perfil WHERE nome='professor' LIMIT 1),?)");
            $insert->execute([$name,$invite['email'],password_hash($password,PASSWORD_DEFAULT),(int)$invite['instituicao_id']]);$userId=(int)$this->db->lastInsertId();
            $update=$this->db->prepare('UPDATE convite_professor SET usado_em=NOW(),usuario_criado_id=? WHERE id=? AND usado_em IS NULL');$update->execute([$userId,(int)$invite['id']]);
            if(!$update->rowCount()){throw new \RuntimeException('Convite utilizado simultaneamente');}
            $this->db->commit();$this->json(['mensagem'=>'Conta de professor criada. Faça login para continuar.'],201);
        }catch(Throwable $e){if($this->db->inTransaction())$this->db->rollBack();throw $e;}
    }
}

