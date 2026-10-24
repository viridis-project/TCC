<?php
declare(strict_types=1);
return static function (PDO $db): void {
    $db->exec("CREATE TABLE IF NOT EXISTS tarefa_aberta (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        turma_id INT NOT NULL,
        criador_id INT NOT NULL,
        missao_id INT NULL,
        titulo VARCHAR(150) NOT NULL,
        descricao TEXT NOT NULL,
        pontos INT NOT NULL DEFAULT 0,
        max_alunos INT NOT NULL DEFAULT 1,
        modo_participacao ENUM('escolher','aberto','particular') NOT NULL DEFAULT 'escolher',
        ativa TINYINT(1) NOT NULL DEFAULT 1,
        criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_tarefa_aberta_turma (turma_id,ativa,criado_em),
        FOREIGN KEY (turma_id) REFERENCES turma_escolar(id),
        FOREIGN KEY (criador_id) REFERENCES usuario(id),
        FOREIGN KEY (missao_id) REFERENCES missao(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci");
    $addColumn=static function(string $table,string $column,string $definition) use($db): void {
        $stmt=$db->prepare('SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?');
        $stmt->execute([$table,$column]);
        if(!$stmt->fetchColumn())$db->exec("ALTER TABLE `$table` ADD COLUMN `$column` $definition");
    };
    $addColumn('tarefa_aberta','pontos','INT NOT NULL DEFAULT 0');
    $addColumn('tarefa_aberta','max_alunos','INT NOT NULL DEFAULT 1');
    $addColumn('tarefa_aberta','modo_participacao',"ENUM('escolher','aberto','particular') NOT NULL DEFAULT 'escolher'");
    $addColumn('agenda','task_id','INT NULL');
    $addColumn('agenda','grupo_id','CHAR(36) NULL');
    $db->exec("CREATE TABLE IF NOT EXISTS tarefa_convite (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        grupo_id CHAR(36) NOT NULL,
        convidado_id INT NOT NULL,
        convidante_id INT NOT NULL,
        status ENUM('pendente','aceito','recusado') NOT NULL DEFAULT 'pendente',
        criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_tarefa_convite (task_id,grupo_id,convidado_id),
        INDEX idx_tarefa_convite_usuario (convidado_id,status),
        FOREIGN KEY (task_id) REFERENCES tarefa_aberta(id) ON DELETE CASCADE,
        FOREIGN KEY (convidado_id) REFERENCES usuario(id) ON DELETE CASCADE,
        FOREIGN KEY (convidante_id) REFERENCES usuario(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci");
    $index=$db->query("SHOW INDEX FROM agenda WHERE Key_name='idx_agenda_task_id'");
    if(!$index->fetch())$db->exec('ALTER TABLE agenda ADD INDEX idx_agenda_task_id (task_id)');
    $constraint=$db->query("SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA=DATABASE() AND TABLE_NAME='agenda' AND CONSTRAINT_NAME='fk_agenda_tarefa_aberta'");
    if(!$constraint->fetchColumn())$db->exec('ALTER TABLE agenda ADD CONSTRAINT fk_agenda_tarefa_aberta FOREIGN KEY (task_id) REFERENCES tarefa_aberta(id) ON DELETE SET NULL');
    $legacy=$db->query('SELECT professor_id,turma_id,missao_id,titulo FROM agenda WHERE task_id IS NULL AND turma_id IS NOT NULL GROUP BY professor_id,turma_id,missao_id,titulo')->fetchAll(PDO::FETCH_ASSOC);
    $find=$db->prepare('SELECT id FROM tarefa_aberta WHERE criador_id=? AND turma_id=? AND titulo=? AND (missao_id <=> ?) ORDER BY id LIMIT 1');
    $insert=$db->prepare('INSERT INTO tarefa_aberta (turma_id,criador_id,missao_id,titulo,descricao,pontos,max_alunos,ativa) VALUES (?,?,?, ?,\'\',0,1,1)');
    $link=$db->prepare('UPDATE agenda SET task_id=? WHERE task_id IS NULL AND professor_id=? AND turma_id=? AND titulo=? AND (missao_id <=> ?)');
    foreach($legacy as $row){
        $find->execute([(int)$row['professor_id'],(int)$row['turma_id'],$row['titulo'],$row['missao_id']]);
        $taskId=$find->fetchColumn();
        if(!$taskId){$insert->execute([(int)$row['turma_id'],(int)$row['professor_id'],$row['missao_id']?(int)$row['missao_id']:null,$row['titulo']]);$taskId=(int)$db->lastInsertId();}
        $link->execute([(int)$taskId,(int)$row['professor_id'],(int)$row['turma_id'],$row['titulo'],$row['missao_id']]);
    }
    $db->exec("UPDATE tarefa_aberta ta SET max_alunos=GREATEST(max_alunos,(SELECT COUNT(DISTINCT a.aluno_id) FROM agenda a WHERE a.task_id=ta.id)) WHERE EXISTS(SELECT 1 FROM agenda a WHERE a.task_id=ta.id)");
};
