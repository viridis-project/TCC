<?php
declare(strict_types=1);
return static function(PDO $db): void {
    $add=static function(string $table,string $column,string $definition) use($db): void {
        $stmt=$db->prepare('SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?');
        $stmt->execute([$table,$column]);
        if(!$stmt->fetchColumn())$db->exec("ALTER TABLE `$table` ADD COLUMN `$column` $definition");
    };
    $add('tarefa_aberta','pontos','INT NOT NULL DEFAULT 0');
    $add('tarefa_aberta','max_alunos','INT NOT NULL DEFAULT 1');
    $add('tarefa_aberta','modo_participacao',"ENUM('escolher','aberto','particular') NOT NULL DEFAULT 'escolher'");
    $add('agenda','grupo_id','CHAR(32) NULL');
    $db->exec("CREATE TABLE IF NOT EXISTS tarefa_convite (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        task_id INT NOT NULL,
        grupo_id CHAR(32) NOT NULL,
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
    $db->exec("UPDATE tarefa_aberta ta SET max_alunos=GREATEST(max_alunos,(SELECT COUNT(DISTINCT a.aluno_id) FROM agenda a WHERE a.task_id=ta.id)) WHERE EXISTS(SELECT 1 FROM agenda a WHERE a.task_id=ta.id)");
};
