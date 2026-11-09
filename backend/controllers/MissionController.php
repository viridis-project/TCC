<?php

declare(strict_types=1);

namespace Viridis\controllers;

use DateTimeImmutable;
use PDO;
use Throwable;
use Viridis\middleware\AuthMiddleware;

/**
 * Missões: a única mecânica de atividades pontuadas do Viridis.
 *
 * - O professor publica a missão para uma turma (título, descrição, imagem, tipo, pontos, limite de alunos).
 *   Ele NÃO define quem fará nem quando.
 * - A missão fica disponível para a turma. Um aluno a reserva escolhendo data e horário (turno), e o turno
 *   aparece no calendário.
 * - Missões de mais de uma pessoa permitem equipe: participação aberta ou apenas por convite.
 *   Missões individuais (max_alunos = 1) não têm essa escolha.
 * - A conclusão acontece pelo envio de comprovação (foto + descrição) e aprovação do professor
 *   (ver ApiController::createSubmission / reviewSubmission).
 */
final class MissionController extends Controller
{
    public const TYPES = ['plant', 'water', 'compost', 'share', 'outro'];

    /**
     * Linha de agenda "viva": turno agendado que ainda vale (hoje em diante) ou que aguarda revisão.
     * Usa o alias `a` para a tabela agenda.
     */
    public const LIVE_TURN = "(a.status='agendado' AND (a.data_hora>=CURDATE() OR EXISTS(SELECT 1 FROM submissao_missao sp WHERE sp.missao_id=a.missao_id AND sp.grupo_id=a.grupo_id AND sp.status='pending')))";

    /** Situação da missão. Usa o alias `m` para a tabela missao. */
    private const STATUS = "CASE
        WHEN EXISTS(SELECT 1 FROM agenda a WHERE a.missao_id=m.id AND a.status='concluido') THEN 'concluida'
        WHEN EXISTS(SELECT 1 FROM submissao_missao sp WHERE sp.missao_id=m.id AND sp.status='pending') THEN 'em_analise'
        WHEN EXISTS(SELECT 1 FROM agenda a WHERE a.missao_id=m.id AND " . self::LIVE_TURN . ") THEN 'agendada'
        ELSE 'disponivel' END";

    public function __construct(private PDO $db, private AuthMiddleware $auth, private array $config) {}

    // ------------------------------------------------------------------ publicação e consulta

    /** Missões publicadas para a turma do aluno (disponíveis, minhas e convites pendentes). */
    public function list(): never
    {
        $user = $this->auth->user(['aluno']);
        $me = (int) $user['id'];
        $live = self::LIVE_TURN;
        $stmt = $this->db->prepare(
            "SELECT m.id,m.titulo,m.descricao,m.imagem,m.tipo,m.pontos_recompensa pontos,m.max_alunos,m.modo_participacao,
                    u.nome professor," . self::STATUS . " status,
                    (SELECT COUNT(DISTINCT a.aluno_id) FROM agenda a WHERE a.missao_id=m.id AND $live) participantes,
                    (SELECT a.data_hora FROM agenda a WHERE a.missao_id=m.id AND $live ORDER BY a.id LIMIT 1) horario,
                    (SELECT a.grupo_id FROM agenda a WHERE a.missao_id=m.id AND $live ORDER BY a.id LIMIT 1) grupo_id,
                    (SELECT c.id FROM missao_convite c WHERE c.missao_id=m.id AND c.convidado_id=? AND c.status='pendente' LIMIT 1) convite_id,
                    EXISTS(SELECT 1 FROM agenda a WHERE a.missao_id=m.id AND a.aluno_id=? AND $live) participando,
                    (SELECT s.status FROM submissao_missao s WHERE s.missao_id=m.id AND s.grupo_id=(SELECT a.grupo_id FROM agenda a WHERE a.missao_id=m.id AND $live ORDER BY a.id LIMIT 1) ORDER BY s.id DESC LIMIT 1) envio_status,
                    (SELECT s.comentario_professor FROM submissao_missao s WHERE s.missao_id=m.id AND s.grupo_id=(SELECT a.grupo_id FROM agenda a WHERE a.missao_id=m.id AND $live ORDER BY a.id LIMIT 1) ORDER BY s.id DESC LIMIT 1) envio_comentario
             FROM missao m JOIN usuario u ON u.id=m.criador_id
             WHERE m.turma_id=? AND m.ativa=1 AND (
                (NOT EXISTS(SELECT 1 FROM agenda a WHERE a.missao_id=m.id AND a.status='concluido')
                 AND (m.max_alunos>1 OR NOT EXISTS(SELECT 1 FROM agenda a WHERE a.missao_id=m.id AND $live)))
                OR EXISTS(SELECT 1 FROM agenda a WHERE a.missao_id=m.id AND a.aluno_id=? AND $live)
                OR (m.max_alunos>1 AND EXISTS(SELECT 1 FROM missao_convite c WHERE c.missao_id=m.id AND c.convidado_id=? AND c.status='pendente'))
             ) ORDER BY m.data_criacao DESC,m.id DESC"
        );
        $stmt->execute([$me, $me, (int) ($user['turma_id'] ?? 0), $me, $me]);
        $this->json(['missoes' => $stmt->fetchAll()]);
    }

    /** Publica uma missão para uma turma. Aceita JSON ou multipart (quando há imagem). */
    public function create(): never
    {
        $teacher = $this->auth->user(['professor', 'admin']);
        $data = $this->input();
        $classId = (int) ($data['turma_id'] ?? 0);
        $title = trim((string) ($data['titulo'] ?? ''));
        $description = trim((string) ($data['descricao'] ?? ''));
        $type = (string) ($data['tipo'] ?? 'outro');
        $points = (int) ($data['pontos'] ?? $data['pontos_recompensa'] ?? 0);
        $maxStudents = (int) ($data['max_alunos'] ?? 1);
        if ($classId < 1 || $title === '' || mb_strlen($title) > 150 || mb_strlen($description) > 2000
            || !in_array($type, self::TYPES, true) || $points < 0 || $points > 10000 || $maxStudents < 1 || $maxStudents > 100) {
            $this->json(['erro' => 'Confira turma, título, tipo, pontos e máximo de alunos'], 422);
        }
        $classCheck = $this->db->prepare(
            "SELECT 1 FROM turma_escolar t LEFT JOIN turma_professor tp ON tp.turma_id=t.id AND tp.professor_id=?
             WHERE t.id=? AND t.instituicao_id=? AND (?='admin' OR tp.professor_id IS NOT NULL)"
        );
        $classCheck->execute([(int) $teacher['id'], $classId, (int) $teacher['instituicao_id'], $teacher['perfil_nome']]);
        if (!$classCheck->fetchColumn()) $this->json(['erro' => 'Você não é responsável por esta turma'], 403);
        $image = $this->storeImage();
        $stmt = $this->db->prepare(
            'INSERT INTO missao (titulo,descricao,tipo,pontos_recompensa,criador_id,turma_id,imagem,max_alunos,modo_participacao,ativa)
             VALUES (?,?,?,?,?,?,?,?,\'escolher\',1)'
        );
        $stmt->execute([$title, $description, $type, $points, (int) $teacher['id'], $classId, $image, $maxStudents]);
        $this->json(['mensagem' => 'Missão publicada para a turma', 'id' => (int) $this->db->lastInsertId()], 201);
    }

    /** Encerra (ativa=0) ou reabre (ativa=1) uma missão. Encerrar só impede novas reservas. */
    public function toggle(int $id): never
    {
        $user = $this->auth->user(['professor', 'admin']);
        $data = $this->input();
        $active = (int) ($data['ativa'] ?? 0) === 1 ? 1 : 0;
        $stmt = $this->db->prepare(
            "UPDATE missao m JOIN turma_escolar t ON t.id=m.turma_id SET m.ativa=?
             WHERE m.id=? AND (?='admin' OR EXISTS (SELECT 1 FROM turma_professor tp WHERE tp.turma_id=t.id AND tp.professor_id=?))"
        );
        $stmt->execute([$active, $id, $user['perfil_nome'], (int) $user['id']]);
        $found = $this->db->prepare(
            "SELECT 1 FROM missao m JOIN turma_escolar t ON t.id=m.turma_id
             WHERE m.id=? AND (?='admin' OR EXISTS (SELECT 1 FROM turma_professor tp WHERE tp.turma_id=t.id AND tp.professor_id=?))"
        );
        $found->execute([$id, $user['perfil_nome'], (int) $user['id']]);
        if (!$found->fetchColumn()) $this->json(['erro' => 'Missão não encontrada ou sem acesso'], 404);
        $this->json(['mensagem' => $active ? 'Missão reaberta' : 'Missão encerrada']);
    }

    // ------------------------------------------------------------------ turno, equipe e convites

    /** O aluno pega a missão e reserva o turno (data e horário). */
    public function accept(int $id): never
    {
        $student = $this->auth->user(['aluno']);
        $data = $this->input();
        $when = $this->parseDate(trim((string) ($data['data_hora'] ?? '')));
        if (!$when) $this->json(['erro' => 'Escolha uma data e um horário futuros'], 422);
        $mission = $this->classMission($id, $student);
        // Missão individual não tem "quem pode participar": ninguém mais entra no turno.
        if ((int) $mission['max_alunos'] === 1) {
            $mode = 'particular';
        } else {
            $mode = $data['modo_participacao'] ?? 'aberto';
            if (!in_array($mode, ['aberto', 'particular'], true)) $this->json(['erro' => 'Escolha como os colegas poderão participar'], 422);
        }
        $groupId = bin2hex(random_bytes(16));
        $this->reserveSlot($id, $student, $when, $groupId, $mode);
        $this->json(['mensagem' => 'Missão aceita e turno reservado', 'grupo_id' => $groupId], 201);
    }

    /** Entra no turno de uma missão em equipe com participação aberta. */
    public function join(int $id): never
    {
        $student = $this->auth->user(['aluno']);
        $groupId = $this->groupParam($this->input()['grupo_id'] ?? '');
        $mission = $this->classMission($id, $student);
        if ((int) $mission['max_alunos'] === 1) $this->json(['erro' => 'Esta missão é individual'], 409);
        $slot = $this->liveGroup($id, $groupId);
        if (!$slot) $this->json(['erro' => 'Esse turno não está disponível'], 404);
        if ($mission['modo_participacao'] !== 'aberto') $this->json(['erro' => 'O responsável escolheu participação somente por convite'], 403);
        $this->addMember($id, $groupId, $student, $slot);
        $this->json(['mensagem' => 'Você entrou no turno da missão']);
    }

    /** Alunos da turma que ainda podem ser convidados para o turno. */
    public function people(int $id): never
    {
        $student = $this->auth->user(['aluno']);
        $groupId = $this->groupParam($_GET['grupo_id'] ?? '');
        $this->classMission($id, $student);
        $stmt = $this->db->prepare(
            "SELECT u.id,u.nome FROM usuario u
             WHERE u.turma_id=? AND u.id<>? AND u.perfil_id=(SELECT id FROM perfil WHERE nome='aluno' LIMIT 1)
               AND NOT EXISTS(SELECT 1 FROM agenda a WHERE a.missao_id=? AND a.grupo_id=? AND a.aluno_id=u.id AND a.status<>'cancelado')
               AND NOT EXISTS(SELECT 1 FROM missao_convite c WHERE c.missao_id=? AND c.grupo_id=? AND c.convidado_id=u.id AND c.status='pendente')
             ORDER BY u.nome"
        );
        $stmt->execute([(int) $student['turma_id'], (int) $student['id'], $id, $groupId, $id, $groupId]);
        $this->json(['alunos' => $stmt->fetchAll()]);
    }

    /** Alguém da equipe convida um colega (missões em equipe com participação por convite). */
    public function invite(int $id): never
    {
        $student = $this->auth->user(['aluno']);
        $data = $this->input();
        $invitee = (int) ($data['aluno_id'] ?? 0);
        $groupId = $this->groupParam($data['grupo_id'] ?? '');
        if ($invitee < 1) $this->json(['erro' => 'Selecione um aluno da turma'], 422);
        $mission = $this->classMission($id, $student);
        if ((int) $mission['max_alunos'] === 1) $this->json(['erro' => 'Esta missão é individual'], 409);
        $owner = $this->db->prepare("SELECT 1 FROM agenda WHERE missao_id=? AND grupo_id=? AND aluno_id=? AND status='agendado'");
        $owner->execute([$id, $groupId, (int) $student['id']]);
        if (!$owner->fetchColumn()) $this->json(['erro' => 'Somente alguém do grupo pode convidar'], 403);
        if ($mission['modo_participacao'] !== 'particular') $this->json(['erro' => 'Esta missão permite participação aberta'], 409);
        $check = $this->db->prepare("SELECT 1 FROM usuario u JOIN perfil p ON p.id=u.perfil_id WHERE u.id=? AND u.turma_id=? AND p.nome='aluno'");
        $check->execute([$invitee, (int) $student['turma_id']]);
        if (!$check->fetchColumn()) $this->json(['erro' => 'O convidado precisa ser aluno da mesma turma'], 422);
        $count = $this->db->prepare("SELECT COUNT(DISTINCT aluno_id) FROM agenda WHERE missao_id=? AND grupo_id=? AND status<>'cancelado'");
        $count->execute([$id, $groupId]);
        $pending = $this->db->prepare("SELECT COUNT(*) FROM missao_convite WHERE missao_id=? AND grupo_id=? AND status='pendente'");
        $pending->execute([$id, $groupId]);
        if ((int) $count->fetchColumn() + (int) $pending->fetchColumn() >= (int) $mission['max_alunos']) {
            $this->json(['erro' => 'O limite de participantes foi atingido'], 409);
        }
        $insert = $this->db->prepare(
            "INSERT INTO missao_convite (missao_id,grupo_id,convidado_id,convidante_id,status) VALUES (?,?,?,?,'pendente')
             ON DUPLICATE KEY UPDATE status='pendente',convidante_id=VALUES(convidante_id)"
        );
        $insert->execute([$id, $groupId, $invitee, (int) $student['id']]);
        $notify = $this->db->prepare("INSERT INTO notificacao (usuario_id,tipo,titulo,mensagem,link) VALUES (?,'convite_missao','Convite para uma missão',?,'/jardim')");
        $notify->execute([$invitee, $student['nome'] . ' convidou você para "' . $mission['titulo'] . '"']);
        $this->json(['mensagem' => 'Convite enviado'], 201);
    }

    public function respondInvite(int $inviteId): never
    {
        $student = $this->auth->user(['aluno']);
        $data = $this->input();
        $accept = ($data['aceitar'] ?? false) === true || (int) ($data['aceitar'] ?? 0) === 1;
        $stmt = $this->db->prepare(
            "SELECT c.id,c.status,c.missao_id,c.grupo_id,m.turma_id,m.ativa,a.data_hora
             FROM missao_convite c JOIN missao m ON m.id=c.missao_id
             JOIN agenda a ON a.missao_id=c.missao_id AND a.grupo_id=c.grupo_id AND a.status='agendado'
             WHERE c.id=? AND c.convidado_id=? ORDER BY a.id LIMIT 1"
        );
        $stmt->execute([$inviteId, (int) $student['id']]);
        $invite = $stmt->fetch();
        if (!$invite || $invite['status'] !== 'pendente') $this->json(['erro' => 'Convite não encontrado ou já respondido'], 404);
        if (!$accept) {
            $this->db->prepare("UPDATE missao_convite SET status='recusado' WHERE id=?")->execute([$inviteId]);
            $this->json(['mensagem' => 'Convite recusado']);
        }
        if ((int) $student['turma_id'] !== (int) $invite['turma_id']) $this->json(['erro' => 'O convite é de outra turma'], 403);
        $this->addMember((int) $invite['missao_id'], $invite['grupo_id'], $student, $invite['data_hora']);
        $this->db->prepare("UPDATE missao_convite SET status='aceito' WHERE id=?")->execute([$inviteId]);
        $this->json(['mensagem' => 'Você aceitou o convite para o turno']);
    }

    // ------------------------------------------------------------------ internos

    private function fail(string $message, int $status): never
    {
        if ($this->db->inTransaction()) $this->db->rollBack();
        $this->json(['erro' => $message], $status);
    }

    private function parseDate(string $value): ?DateTimeImmutable
    {
        $date = DateTimeImmutable::createFromFormat('!Y-m-d H:i:s', $value) ?: DateTimeImmutable::createFromFormat('!Y-m-d H:i', $value);
        return $date && $date->format('Y-m-d H:i') >= date('Y-m-d H:i') ? $date : null;
    }

    private function groupParam(mixed $value): string
    {
        $value = (string) $value;
        if (!preg_match('/^[a-f0-9]{32}$/', $value)) $this->json(['erro' => 'Turno inválido'], 422);
        return $value;
    }

    /** Missão publicada e ativa na turma do aluno. */
    private function classMission(int $id, array $student): array
    {
        $stmt = $this->db->prepare('SELECT * FROM missao WHERE id=? AND turma_id=? AND ativa=1');
        $stmt->execute([$id, (int) ($student['turma_id'] ?? 0)]);
        $mission = $stmt->fetch();
        if (!$mission) $this->json(['erro' => 'Missão não encontrada'], 404);
        return $mission;
    }

    /** Data/hora do turno vivo (não cancelado, não encerrado) do grupo, ou null. */
    private function liveGroup(int $missionId, string $groupId): ?string
    {
        $stmt = $this->db->prepare('SELECT a.data_hora FROM agenda a WHERE a.missao_id=? AND a.grupo_id=? AND ' . self::LIVE_TURN . ' ORDER BY a.id LIMIT 1');
        $stmt->execute([$missionId, $groupId]);
        $when = $stmt->fetchColumn();
        return $when === false ? null : (string) $when;
    }

    private function reserveSlot(int $id, array $student, DateTimeImmutable $when, string $groupId, string $mode): void
    {
        try {
            $this->db->beginTransaction();
            $this->db->prepare('SELECT id FROM usuario WHERE id=? FOR UPDATE')->execute([(int) $student['id']]);
            $lock = $this->db->prepare('SELECT * FROM missao WHERE id=? AND turma_id=? AND ativa=1 FOR UPDATE');
            $lock->execute([$id, (int) $student['turma_id']]);
            $mission = $lock->fetch();
            if (!$mission) $this->fail('A missão está encerrada', 409);
            $done = $this->db->prepare("SELECT 1 FROM agenda WHERE missao_id=? AND status='concluido' LIMIT 1");
            $done->execute([$id]);
            if ($done->fetchColumn()) $this->fail('Esta missão já foi concluída', 409);
            $pending = $this->db->prepare("SELECT 1 FROM submissao_missao WHERE missao_id=? AND status='pending' LIMIT 1");
            $pending->execute([$id]);
            if ($pending->fetchColumn()) $this->fail('Esta missão tem um envio em análise', 409);
            $taken = $this->db->prepare('SELECT COUNT(*) FROM agenda a WHERE a.missao_id=? AND ' . self::LIVE_TURN);
            $taken->execute([$id]);
            if ((int) $taken->fetchColumn() > 0) $this->fail('Esta missão já tem um turno. Entre no turno existente.', 409);
            $start = $when->format('Y-m-d H:i:s');
            $end = $when->modify('+1 hour')->format('Y-m-d H:i:s');
            $this->assertNoConflict((int) $student['id'], $start, $end);
            $this->db->prepare('UPDATE missao SET modo_participacao=? WHERE id=?')->execute([$mode, $id]);
            $this->insertTurn($mission, (int) $student['id'], $groupId, $start);
            $this->db->commit();
        } catch (Throwable $e) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            throw $e;
        }
    }

    private function addMember(int $id, string $groupId, array $student, string $when): void
    {
        try {
            $this->db->beginTransaction();
            $this->db->prepare('SELECT id FROM usuario WHERE id=? FOR UPDATE')->execute([(int) $student['id']]);
            $lock = $this->db->prepare('SELECT * FROM missao WHERE id=? AND turma_id=? AND ativa=1 FOR UPDATE');
            $lock->execute([$id, (int) $student['turma_id']]);
            $mission = $lock->fetch();
            if (!$mission) $this->fail('A missão está encerrada', 409);
            $existing = $this->db->prepare("SELECT 1 FROM agenda WHERE missao_id=? AND aluno_id=? AND grupo_id=? AND status<>'cancelado'");
            $existing->execute([$id, (int) $student['id'], $groupId]);
            if ($existing->fetchColumn()) $this->fail('Você já está participando desta missão', 409);
            $end = (new DateTimeImmutable($when))->modify('+1 hour')->format('Y-m-d H:i:s');
            $this->assertNoConflict((int) $student['id'], $when, $end);
            $count = $this->db->prepare("SELECT COUNT(DISTINCT aluno_id) FROM agenda WHERE missao_id=? AND grupo_id=? AND status<>'cancelado'");
            $count->execute([$id, $groupId]);
            if ((int) $count->fetchColumn() >= (int) $mission['max_alunos']) $this->fail('O limite de participantes foi atingido', 409);
            $this->insertTurn($mission, (int) $student['id'], $groupId, $when);
            $this->db->commit();
        } catch (Throwable $e) {
            if ($this->db->inTransaction()) $this->db->rollBack();
            throw $e;
        }
    }

    private function assertNoConflict(int $studentId, string $start, string $end): void
    {
        $conflict = $this->db->prepare(
            "SELECT 1 FROM agenda WHERE aluno_id=? AND status IN ('agendado','concluido') AND (data_hora>=CURDATE() OR status='concluido')
               AND data_hora < ? AND DATE_ADD(data_hora,INTERVAL 1 HOUR) > ? LIMIT 1"
        );
        $conflict->execute([$studentId, $end, $start]);
        if ($conflict->fetchColumn()) $this->fail('Esse horário conflita com outro turno seu', 409);
    }

    private function insertTurn(array $mission, int $studentId, string $groupId, string $when): void
    {
        $insert = $this->db->prepare(
            "INSERT INTO agenda (missao_id,grupo_id,aluno_id,professor_id,turma_id,titulo,data_hora,status) VALUES (?,?,?,?,?,?,?,'agendado')"
        );
        $insert->execute([(int) $mission['id'], $groupId, $studentId, (int) $mission['criador_id'], (int) $mission['turma_id'], $mission['titulo'], $when]);
    }

    /** Imagem opcional da missão (campo multipart `foto`). */
    private function storeImage(): ?string
    {
        if (!isset($_FILES['foto']) || $_FILES['foto']['error'] === UPLOAD_ERR_NO_FILE) return null;
        $file = $_FILES['foto'];
        if ($file['error'] !== UPLOAD_ERR_OK) $this->json(['erro' => 'Não foi possível receber a imagem'], 422);
        if ((int) $file['size'] < 1 || (int) $file['size'] > $this->config['upload_max_bytes']) $this->json(['erro' => 'A imagem deve ter no máximo 5 MB'], 422);
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
        $extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
        if (!isset($extensions[$mime])) $this->json(['erro' => 'Use uma imagem JPG, PNG ou WebP'], 422);
        if (!is_dir($this->config['upload_dir']) && !mkdir($this->config['upload_dir'], 0750, true)) {
            $this->json(['erro' => 'Não foi possível preparar o armazenamento da imagem'], 500);
        }
        $name = 'missao-' . bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
        if (!move_uploaded_file($file['tmp_name'], $this->config['upload_dir'] . '/' . $name)) {
            $this->json(['erro' => 'Não foi possível salvar a imagem'], 500);
        }
        return '/uploads/' . $name;
    }
}
