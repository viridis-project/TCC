<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
$config = require __DIR__.'/config/bootstrap.php';
$db = Viridis\config\Database::connection($config);
$db->exec('CREATE TABLE IF NOT EXISTS schema_migration (nome VARCHAR(150) PRIMARY KEY,aplicada_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)');
foreach (glob(__DIR__.'/migrations/*.php') as $file) {
    $name = basename($file);
    $check = $db->prepare('SELECT 1 FROM schema_migration WHERE nome=?'); $check->execute([$name]);
    if ($check->fetchColumn()) { echo "Já aplicada: $name\n"; continue; }
    $migration = require $file; $migration($db);
    $record = $db->prepare('INSERT INTO schema_migration (nome) VALUES (?)'); $record->execute([$name]);
    echo "Aplicada: $name\n";
}
