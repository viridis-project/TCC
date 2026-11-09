<?php
declare(strict_types=1);

/**
 * Unifica as mecânicas "tarefa aberta" (task) e "missão" em uma só: a missão.
 *
 * - `missao` passa a ter turma, imagem, limite de alunos, modo de participação e flag de publicação.
 * - Cada `tarefa_aberta` vira uma `missao` (mantendo turma, criador, pontos, equipe e status).
 * - `agenda.task_id` é substituído por `agenda.missao_id`; todo item da agenda passa a ter `grupo_id`.
 * - `tarefa_convite` vira `missao_convite`.
 * - `submissao_missao` ganha `grupo_id` (a comprovação é da equipe que reservou o turno).
 * - As 4 missões-padrão antigas (sem turma) ficam inativas: continuam existindo só para o histórico.
 *
 * A migration pode ser reexecutada depois de uma falha: cada passo verifica o que já existe.
 */
return static function (PDO $db): void {
    $hasTable = static function (string $table) use ($db): bool {
        $stmt = $db->prepare('SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?');
        $stmt->execute([$table]);
        return (bool) $stmt->fetchColumn();
    };
    $hasColumn = static function (string $table, string $column) use ($db): bool {
        $stmt = $db->prepare('SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?');
        $stmt->execute([$table, $column]);
        return (bool) $stmt->fetchColumn();
    };
    $hasIndex = static function (string $table, string $index) use ($db): bool {
        $stmt = $db->prepare('SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND INDEX_NAME=?');
        $stmt->execute([$table, $index]);
        return (bool) $stmt->fetchColumn();
    };
    $hasConstraint = static function (string $table, string $name) use ($db): bool {
        $stmt = $db->prepare("SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA=DATABASE() AND TABLE_NAME=? AND CONSTRAINT_NAME=?");
        $stmt->execute([$table, $name]);
        return (bool) $stmt->fetchColumn();
    };
    $addColumn = static function (string $table, string $column, string $definition) use ($db, $hasColumn): void {
        if (!$hasColumn($table, $column)) $db->exec("ALTER TABLE `$table` ADD COLUMN `$column` $definition");
    };

    // 1) Estrutura da missão ------------------------------------------------------------------
    $db->exec('ALTER TABLE missao MODIFY titulo VARCHAR(150) NOT NULL');
    $addColumn('missao', 'turma_id', 'INT NULL');
    $addColumn('missao', 'imagem', 'VARCHAR(255) NULL');
    $addColumn('missao', 'max_alunos', 'INT NOT NULL DEFAULT 1');
    $addColumn('missao', 'modo_participacao', "ENUM('escolher','aberto','particular') NOT NULL DEFAULT 'escolher'");
    $addColumn('missao', 'ativa', 'TINYINT(1) NOT NULL DEFAULT 1');
    if (!$hasIndex('missao', 'idx_missao_turma')) $db->exec('ALTER TABLE missao ADD INDEX idx_missao_turma (turma_id,ativa,data_criacao)');
    if (!$hasConstraint('missao', 'fk_missao_turma')) $db->exec('ALTER TABLE missao ADD CONSTRAINT fk_missao_turma FOREIGN KEY (turma_id) REFERENCES turma_escolar(id)');

    // As missões antigas não pertencem a nenhuma turma: servem só ao histórico de envios já feitos.
    $db->exec('UPDATE missao SET ativa=0 WHERE turma_id IS NULL');

    // 2) Equipe/turno da missão ---------------------------------------------------------------
    $addColumn('submissao_missao', 'grupo_id', 'CHAR(32) NULL');
    if (!$hasIndex('submissao_missao', 'idx_submissao_grupo')) {
        $db->exec('ALTER TABLE submissao_missao ADD INDEX idx_submissao_grupo (missao_id,grupo_id,status)');
    }
    $db->exec("CREATE TABLE IF NOT EXISTS missao_convite (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        missao_id INT NOT NULL,
        grupo_id CHAR(32) NOT NULL,
        convidado_id INT NOT NULL,
        convidante_id INT NOT NULL,
        status ENUM('pendente','aceito','recusado') NOT NULL DEFAULT 'pendente',
        criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_missao_convite (missao_id,grupo_id,convidado_id),
        INDEX idx_missao_convite_usuario (convidado_id,status),
        FOREIGN KEY (missao_id) REFERENCES missao(id) ON DELETE CASCADE,
        FOREIGN KEY (convidado_id) REFERENCES usuario(id) ON DELETE CASCADE,
        FOREIGN KEY (convidante_id) REFERENCES usuario(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci");

    // 3) Dados: tarefa_aberta -> missao -------------------------------------------------------
    if ($hasTable('tarefa_aberta')) {
        $db->exec('CREATE TABLE IF NOT EXISTS _migracao_tarefa_missao (tarefa_id INT NOT NULL PRIMARY KEY, missao_id INT NOT NULL)');
        $tasks = $db->query(
            'SELECT ta.id,ta.turma_id,ta.criador_id,ta.titulo,ta.descricao,ta.pontos,ta.max_alunos,ta.modo_participacao,ta.ativa,ta.criado_em,
                    m.tipo linked_tipo,m.pontos_recompensa linked_pontos
             FROM tarefa_aberta ta LEFT JOIN missao m ON m.id=ta.missao_id
             WHERE ta.id NOT IN (SELECT tarefa_id FROM _migracao_tarefa_missao) ORDER BY ta.id'
        )->fetchAll(PDO::FETCH_ASSOC);
        $insert = $db->prepare('INSERT INTO missao (titulo,descricao,tipo,pontos_recompensa,criador_id,data_criacao,turma_id,max_alunos,modo_participacao,ativa) VALUES (?,?,?,?,?,?,?,?,?,?)');
        $map = $db->prepare('INSERT INTO _migracao_tarefa_missao (tarefa_id,missao_id) VALUES (?,?)');
        $db->beginTransaction();
        try {
            foreach ($tasks as $task) {
                $points = (int) $task['pontos'] > 0 ? (int) $task['pontos'] : (int) ($task['linked_pontos'] ?? 0);
                $insert->execute([
                    $task['titulo'], $task['descricao'], $task['linked_tipo'] ?? 'outro', $points, (int) $task['criador_id'],
                    $task['criado_em'], (int) $task['turma_id'], max(1, (int) $task['max_alunos']),
                    $task['modo_participacao'], (int) $task['ativa'],
                ]);
                $map->execute([(int) $task['id'], (int) $db->lastInsertId()]);
            }
            if ($hasColumn('agenda', 'task_id')) {
                $db->exec('UPDATE agenda a JOIN _migracao_tarefa_missao mm ON mm.tarefa_id=a.task_id SET a.missao_id=mm.missao_id');
            }
            if ($hasTable('tarefa_convite')) {
                $db->exec('INSERT IGNORE INTO missao_convite (missao_id,grupo_id,convidado_id,convidante_id,status,criado_em)
                           SELECT mm.missao_id,c.grupo_id,c.convidado_id,c.convidante_id,c.status,c.criado_em
                           FROM tarefa_convite c JOIN _migracao_tarefa_missao mm ON mm.tarefa_id=c.task_id');
            }
            $db->commit();
        } catch (Throwable $e) {
            if ($db->inTransaction()) $db->rollBack();
            throw $e;
        }
    }

    // 4) Todo item da agenda passa a pertencer a um grupo (turno). Itens antigos viram turnos individuais.
    if ($hasColumn('agenda', 'grupo_id')) $db->exec('ALTER TABLE agenda MODIFY grupo_id CHAR(32) NULL');
    $db->exec("UPDATE agenda SET grupo_id=REPLACE(UUID(),'-','') WHERE grupo_id IS NULL");
    if (!$hasIndex('agenda', 'idx_agenda_missao_grupo')) {
        $db->exec('ALTER TABLE agenda ADD INDEX idx_agenda_missao_grupo (missao_id,grupo_id,status)');
    }

    // 5) Notificações antigas acompanham o novo vocabulário.
    $db->exec("UPDATE notificacao SET tipo='convite_missao' WHERE tipo='convite_tarefa'");
    $db->exec("UPDATE notificacao SET tipo='missao_agendada' WHERE tipo='tarefa_agendada'");

    // 6) Remoção da mecânica antiga, somente depois de conferir que tudo foi copiado ----------
    if ($hasTable('tarefa_aberta')) {
        $total = (int) $db->query('SELECT COUNT(*) FROM tarefa_aberta')->fetchColumn();
        $migrated = (int) $db->query('SELECT COUNT(*) FROM _migracao_tarefa_missao')->fetchColumn();
        if ($total !== $migrated) throw new RuntimeException("Migração incompleta: $migrated de $total tarefas copiadas");
        if ($hasColumn('agenda', 'task_id')) {
            $orphans = (int) $db->query('SELECT COUNT(*) FROM agenda a WHERE a.task_id IS NOT NULL AND a.task_id NOT IN (SELECT tarefa_id FROM _migracao_tarefa_missao)')->fetchColumn();
            if ($orphans > 0) throw new RuntimeException("Migração incompleta: $orphans itens da agenda sem missão");
        }
    }
    if ($hasConstraint('agenda', 'fk_agenda_tarefa_aberta')) $db->exec('ALTER TABLE agenda DROP FOREIGN KEY fk_agenda_tarefa_aberta');
    if ($hasIndex('agenda', 'idx_agenda_task_id')) $db->exec('ALTER TABLE agenda DROP INDEX idx_agenda_task_id');
    if ($hasColumn('agenda', 'task_id')) $db->exec('ALTER TABLE agenda DROP COLUMN task_id');
    $db->exec('DROP TABLE IF EXISTS tarefa_convite');
    $db->exec('DROP TABLE IF EXISTS tarefa_aberta');
    $db->exec('DROP TABLE IF EXISTS _migracao_tarefa_missao');
};
