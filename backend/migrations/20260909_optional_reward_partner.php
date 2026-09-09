<?php

declare(strict_types=1);

return static function (PDO $db): void {
    $foreignKeys = $db->query(
        "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='recompensa'
           AND COLUMN_NAME='parceiro_id' AND REFERENCED_TABLE_NAME IS NOT NULL"
    )->fetchAll(PDO::FETCH_COLUMN);

    foreach ($foreignKeys as $foreignKey) {
        $safeName = str_replace('`', '``', (string) $foreignKey);
        $db->exec("ALTER TABLE recompensa DROP FOREIGN KEY `{$safeName}`");
    }

    $db->exec('ALTER TABLE recompensa MODIFY parceiro_id INT NULL');
    $db->exec(
        'ALTER TABLE recompensa ADD CONSTRAINT fk_recompensa_parceiro '
        . 'FOREIGN KEY (parceiro_id) REFERENCES parceiro(id) ON DELETE SET NULL'
    );
};
