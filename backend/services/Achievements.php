<?php

declare(strict_types=1);

namespace Viridis\services;

use PDO;
use Throwable;

final class Achievements
{
    public const RANKING_ORDER = 'u.pontos_totais DESC,u.nome,u.id';

    public function __construct(private PDO $db) {}

    /** Reconcile historical progress and record new achievements and notifications together. */
    public function sync(int $userId): array
    {
        $ownsTransaction = !$this->db->inTransaction();
        if ($ownsTransaction) $this->db->beginTransaction();

        try {
            $catalog = $this->evaluate($userId);
            if ($ownsTransaction) $this->db->commit();
            return $catalog;
        } catch (Throwable $error) {
            if ($ownsTransaction && $this->db->inTransaction()) $this->db->rollBack();
            throw $error;
        }
    }

    private function evaluate(int $userId): array
    {
        $student = $this->db->prepare('SELECT id,turma_id,instituicao_id,pontos_totais,notificacoes_ativas,
            streak_dias,ultima_atividade_em >= DATE_SUB(CURDATE(), INTERVAL 1 DAY) AS streak_ativa,
            NOW() AS agora FROM usuario WHERE id=? FOR UPDATE');
        $student->execute([$userId]);
        $user = $student->fetch();
        if (!$user) return [];

        $catalog = $this->db->prepare('SELECT c.id,c.titulo,c.descricao,c.icone,c.regra,uc.conquistada_em
            FROM conquista c LEFT JOIN usuario_conquista uc ON uc.conquista_id=c.id AND uc.usuario_id=?
            ORDER BY c.id');
        $catalog->execute([$userId]);
        $achievements = $catalog->fetchAll();
        if ($achievements === []) return [];

        $class = $this->db->prepare('SELECT instituicao_id FROM turma_escolar WHERE id=?');
        if ($user['turma_id'] !== null) {
            $class->execute([(int)$user['turma_id']]);
            $user['instituicao_id'] = $class->fetchColumn() ?: null;
        }

        $lessonCount = $this->db->prepare("SELECT COUNT(*) FROM usuario_licao_progresso WHERE usuario_id=? AND status='completed'");
        $lessonCount->execute([$userId]);
        $completedLessons = (int)$lessonCount->fetchColumn();

        $moduleProgress = [];
        foreach ((new LearningAccess($this->db))->modules($user) as $module) {
            $completed = count(array_filter($module['licoes'], fn($lesson) => $lesson['status'] === 'completed'));
            $moduleProgress[$module['id']] = [$completed, count($module['licoes'])];
        }
        $completedModules = count(array_filter($moduleProgress, fn($progress) => $progress[0] === $progress[1]));

        $insert = $this->db->prepare('INSERT INTO usuario_conquista (usuario_id,conquista_id,conquistada_em) VALUES (?,?,?)
            ON DUPLICATE KEY UPDATE conquistada_em=conquistada_em');
        $notification = $this->db->prepare("INSERT INTO notificacao (usuario_id,tipo,titulo,mensagem,link)
            VALUES (?,'conquista','Nova conquista!',?,'/jardim#conquistas')");

        foreach ($achievements as &$achievement) {
            $achievement['id'] = (int)$achievement['id'];
            $achievement['conquistada'] = (int)($achievement['conquistada_em'] !== null);
            $achievement['progresso'] = null;
            $achievement['meta'] = null;
            if ($achievement['conquistada']) continue;

            [$rule, $argument] = array_pad(explode(':', $achievement['regra'], 2), 2, '');
            $target = ctype_digit($argument) ? (int)$argument : 0;
            $streak = (int)$user['streak_dias'];
            [$progress, $goal] = match ($rule) {
                'licoes' => [$completedLessons, $target],
                'modulo_completo' => $moduleProgress[$target] ?? [0, 0],
                'todos_modulos' => [$completedModules, count($moduleProgress)],
                'streak' => [$user['streak_ativa'] || $streak >= $target ? $streak : 0, $target],
                'ranking' => [$this->isRanked($user, $target) ? 1 : 0, 1],
                default => [0, 0],
            };
            if ($goal === 0) continue;
            if ($rule !== 'ranking') {
                $achievement['progresso'] = min($progress, $goal);
                $achievement['meta'] = $goal;
            }
            if ($progress < $goal) continue;

            $insert->execute([$userId, $achievement['id'], $user['agora']]);
            if ($insert->rowCount() === 1) {
                $achievement['conquistada'] = 1;
                $achievement['conquistada_em'] = $user['agora'];
                if ($user['notificacoes_ativas']) {
                    $notification->execute([$userId, 'Você desbloqueou '.$achievement['titulo'].'.']);
                }
            }
        }

        return $achievements;
    }

    private function isRanked(array $user, int $limit): bool
    {
        if ($limit < 1 || (int)$user['pontos_totais'] <= 0) return false;

        $ranking = $this->db->query("SELECT u.id FROM usuario u JOIN perfil p ON p.id=u.perfil_id
            WHERE p.nome='aluno' ORDER BY ".self::RANKING_ORDER." LIMIT $limit");
        return in_array((int)$user['id'], array_map('intval', $ranking->fetchAll(PDO::FETCH_COLUMN)), true);
    }
}
