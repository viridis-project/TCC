<?php
declare(strict_types=1);

/**
 * Unifica a distribuição de atividades em missões publicadas por turma.
 * Mantém as tabelas antigas como histórico/compatibilidade e preserva IDs existentes.
 */
return static function (PDO $db): void {
    $columnExists = static function (string $table, string $column) use ($db): bool {
        $q = $db->prepare('SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?');
        $q->execute([$table, $column]);
        return (bool) $q->fetchColumn();
    };
    $addColumn = static function (string $table, string $column, string $definition) use ($db, $columnExists): void {
        if (!$columnExists($table, $column)) $db->exec("ALTER TABLE `$table` ADD COLUMN `$column` $definition");
    };

    $db->exec("CREATE TABLE IF NOT EXISTS missao_publicada (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        turma_id INT NOT NULL,
        criador_id INT NOT NULL,
        missao_id INT NULL,
        titulo VARCHAR(150) NOT NULL,
        descricao TEXT NOT NULL,
        instrucoes TEXT NULL,
        imagem VARCHAR(500) NULL,
        tipo ENUM('plant','water','compost','share','outro') NOT NULL DEFAULT 'outro',
        pontos INT NOT NULL DEFAULT 0,
        max_alunos INT NOT NULL DEFAULT 1,
        modo_participacao ENUM('aberto','particular') NOT NULL DEFAULT 'aberto',
        requer_submissao TINYINT(1) NOT NULL DEFAULT 1,
        ativa TINYINT(1) NOT NULL DEFAULT 1,
        criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_missao_publicada_turma (turma_id,ativa,criado_em),
        INDEX idx_missao_publicada_criador (criador_id,criado_em),
        CONSTRAINT fk_missao_publicada_turma FOREIGN KEY (turma_id) REFERENCES turma_escolar(id),
        CONSTRAINT fk_missao_publicada_criador FOREIGN KEY (criador_id) REFERENCES usuario(id),
        CONSTRAINT fk_missao_publicada_catalogo FOREIGN KEY (missao_id) REFERENCES missao(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci");

    // Copia os IDs das Tasks para permitir que agenda e convites sejam migrados sem perder referências.
    $db->exec("INSERT IGNORE INTO missao_publicada
        (id,turma_id,criador_id,missao_id,titulo,descricao,instrucoes,tipo,pontos,max_alunos,modo_participacao,requer_submissao,ativa,criado_em)
        SELECT ta.id,ta.turma_id,ta.criador_id,ta.missao_id,ta.titulo,ta.descricao,ta.descricao,
               COALESCE(m.tipo,'outro'),ta.pontos,GREATEST(1,ta.max_alunos),
               CASE WHEN ta.max_alunos<=1 THEN 'aberto' WHEN ta.modo_participacao='particular' THEN 'particular' ELSE 'aberto' END,
               0,ta.ativa,ta.criado_em
        FROM tarefa_aberta ta LEFT JOIN missao m ON m.id=ta.missao_id");

    $addColumn('agenda', 'missao_publicada_id', 'INT NULL');
    $db->exec('UPDATE agenda SET missao_publicada_id=task_id WHERE missao_publicada_id IS NULL AND task_id IS NOT NULL');
    $idx = $db->query("SHOW INDEX FROM agenda WHERE Key_name='idx_agenda_missao_publicada'");
    if (!$idx->fetch()) $db->exec('ALTER TABLE agenda ADD INDEX idx_agenda_missao_publicada (missao_publicada_id,aluno_id,status)');
    $fk = $db->prepare("SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA=DATABASE() AND TABLE_NAME='agenda' AND CONSTRAINT_NAME='fk_agenda_missao_publicada'");
    $fk->execute();
    if (!$fk->fetchColumn()) $db->exec('ALTER TABLE agenda ADD CONSTRAINT fk_agenda_missao_publicada FOREIGN KEY (missao_publicada_id) REFERENCES missao_publicada(id) ON DELETE SET NULL');

    $db->exec("CREATE TABLE IF NOT EXISTS missao_pontuacao (
        missao_publicada_id INT NOT NULL,
        grupo_id CHAR(36) NOT NULL,
        aluno_id INT NOT NULL,
        pontos INT NOT NULL DEFAULT 0,
        fonte ENUM('submissao','conclusao_legada') NOT NULL,
        criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (missao_publicada_id,grupo_id,aluno_id),
        INDEX idx_missao_pontuacao_aluno (aluno_id,criado_em),
        CONSTRAINT fk_missao_pontuacao_publicada FOREIGN KEY (missao_publicada_id) REFERENCES missao_publicada(id) ON DELETE CASCADE,
        CONSTRAINT fk_missao_pontuacao_aluno FOREIGN KEY (aluno_id) REFERENCES usuario(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci");

    // Registros já concluídos são tratados como pontuação potencialmente creditada para não pontuar de novo ao revisar dados históricos.
    $db->exec("INSERT IGNORE INTO missao_pontuacao (missao_publicada_id,grupo_id,aluno_id,pontos,fonte,criado_em)
        SELECT DISTINCT done.missao_publicada_id,COALESCE(done.grupo_id,CONCAT('legacy-',done.id)),member.aluno_id,mp.pontos,'conclusao_legada',done.criado_em
        FROM agenda done JOIN missao_publicada mp ON mp.id=done.missao_publicada_id
        JOIN agenda member ON member.missao_publicada_id=done.missao_publicada_id AND member.status<>'cancelado'
          AND ((done.grupo_id IS NOT NULL AND member.grupo_id=done.grupo_id) OR (done.grupo_id IS NULL AND member.id=done.id))
        WHERE done.status='concluido' AND mp.requer_submissao=0");

    $db->exec("CREATE TABLE IF NOT EXISTS missao_convite (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        missao_publicada_id INT NOT NULL,
        grupo_id CHAR(36) NOT NULL,
        convidado_id INT NOT NULL,
        convidante_id INT NOT NULL,
        status ENUM('pendente','aceito','recusado') NOT NULL DEFAULT 'pendente',
        criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_missao_convite (missao_publicada_id,grupo_id,convidado_id),
        INDEX idx_missao_convite_usuario (convidado_id,status),
        CONSTRAINT fk_missao_convite_publicada FOREIGN KEY (missao_publicada_id) REFERENCES missao_publicada(id) ON DELETE CASCADE,
        CONSTRAINT fk_missao_convite_convidado FOREIGN KEY (convidado_id) REFERENCES usuario(id) ON DELETE CASCADE,
        CONSTRAINT fk_missao_convite_convidante FOREIGN KEY (convidante_id) REFERENCES usuario(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci");
    $db->exec("INSERT IGNORE INTO missao_convite (id,missao_publicada_id,grupo_id,convidado_id,convidante_id,status,criado_em)
        SELECT id,task_id,grupo_id,convidado_id,convidante_id,status,criado_em FROM tarefa_convite");

    $addColumn('submissao_missao', 'missao_publicada_id', 'INT NULL');
    $addColumn('submissao_missao', 'grupo_id', 'CHAR(36) NULL');
    $idx = $db->query("SHOW INDEX FROM submissao_missao WHERE Key_name='idx_submissao_missao_publicada'");
    if (!$idx->fetch()) $db->exec('ALTER TABLE submissao_missao ADD INDEX idx_submissao_missao_publicada (missao_publicada_id,aluno_id,status)');
    $idxGroup = $db->query("SHOW INDEX FROM submissao_missao WHERE Key_name='idx_submissao_missao_publicada_grupo'");
    if (!$idxGroup->fetch()) $db->exec('ALTER TABLE submissao_missao ADD INDEX idx_submissao_missao_publicada_grupo (missao_publicada_id,grupo_id,status)');
    $fk = $db->prepare("SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA=DATABASE() AND TABLE_NAME='submissao_missao' AND CONSTRAINT_NAME='fk_submissao_missao_publicada'");
    $fk->execute();
    if (!$fk->fetchColumn()) $db->exec('ALTER TABLE submissao_missao ADD CONSTRAINT fk_submissao_missao_publicada FOREIGN KEY (missao_publicada_id) REFERENCES missao_publicada(id) ON DELETE SET NULL');

    // A opção convite não se aplica a uma missão individual.
    $db->exec("UPDATE missao_publicada SET modo_participacao='aberto' WHERE max_alunos<=1");
    $db->exec("UPDATE missao_publicada SET modo_participacao='aberto' WHERE modo_participacao NOT IN ('aberto','particular')");
};
