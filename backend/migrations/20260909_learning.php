<?php
declare(strict_types=1);
return static function (PDO $db): void {
    $db->exec("CREATE TABLE IF NOT EXISTS curso (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,titulo VARCHAR(150) NOT NULL,descricao VARCHAR(1000) NOT NULL DEFAULT '',
        escopo ENUM('app','escola','turma') NOT NULL, instituicao_id INT NULL,turma_id INT NULL,criador_id INT NULL,
        publicado TINYINT(1) NOT NULL DEFAULT 0,ativo TINYINT(1) NOT NULL DEFAULT 1,
        legado TINYINT(1) NOT NULL DEFAULT 0,criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_curso_publico (escopo,instituicao_id,turma_id,publicado,ativo),
        FOREIGN KEY (instituicao_id) REFERENCES instituicao(id),
        FOREIGN KEY (turma_id) REFERENCES turma_escolar(id),
        FOREIGN KEY (criador_id) REFERENCES usuario(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci");
    $column = static function (string $table,string $name,string $definition) use ($db): void {
        $stmt=$db->prepare('SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?');
        $stmt->execute([$table,$name]); if (!$stmt->fetchColumn()) $db->exec("ALTER TABLE $table ADD COLUMN $name $definition");
    };
    $column('modulo','curso_id','INT NULL');
    foreach (['modulo','licao','pergunta_quiz'] as $table) $column($table,'ativo','TINYINT(1) NOT NULL DEFAULT 1');
    $constraint=$db->query("SELECT 1 FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA=DATABASE() AND TABLE_NAME='modulo' AND CONSTRAINT_NAME='fk_modulo_curso'");
    if (!$constraint->fetchColumn()) $db->exec('ALTER TABLE modulo ADD CONSTRAINT fk_modulo_curso FOREIGN KEY (curso_id) REFERENCES curso(id)');
    // Preserve the existing trail and its progress; do not replace any lessons or questions.
    if ((int)$db->query('SELECT COUNT(*) FROM modulo WHERE curso_id IS NULL')->fetchColumn() > 0 || (int)$db->query('SELECT COUNT(*) FROM pergunta_quiz WHERE licao_id IS NULL')->fetchColumn() > 0) {
        $legacy=$db->query('SELECT id FROM curso WHERE legado=1 ORDER BY id LIMIT 1')->fetchColumn();
        if (!$legacy) {
            $db->exec("INSERT INTO curso (titulo,descricao,escopo,publicado,legado) VALUES ('Trilha de sustentabilidade','Conteúdo original do Viridis.','app',1,1)");
            $legacy=(int)$db->lastInsertId();
        }
        $stmt=$db->prepare('UPDATE modulo SET curso_id=? WHERE curso_id IS NULL');$stmt->execute([$legacy]);
        if ((int)$db->query('SELECT COUNT(*) FROM pergunta_quiz WHERE licao_id IS NULL')->fetchColumn() > 0) {
            $stmt=$db->prepare("INSERT INTO modulo (curso_id,titulo,descricao,cor,ordem) VALUES (?,'Quiz complementar','Perguntas do banco original.','#16803c',999)");$stmt->execute([$legacy]);
            $module=(int)$db->lastInsertId();
            $stmt=$db->prepare("INSERT INTO licao (modulo_id,titulo,kind,xp,ordem) VALUES (?,'Conhecimentos gerais','lesson',20,1)");$stmt->execute([$module]);
            $stmt=$db->prepare('UPDATE pergunta_quiz SET licao_id=? WHERE licao_id IS NULL');$stmt->execute([(int)$db->lastInsertId()]);
        }
    }
};
