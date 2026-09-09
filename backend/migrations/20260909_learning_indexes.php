<?php
declare(strict_types=1);
return static function (PDO $db): void {
    $index = $db->query("SHOW INDEX FROM modulo WHERE Key_name='uq_modulo_ordem'")->fetch();
    if ($index) $db->exec('ALTER TABLE modulo DROP INDEX uq_modulo_ordem');
    $composite = $db->query("SHOW INDEX FROM modulo WHERE Key_name='uq_modulo_curso_ordem'")->fetch();
    if (!$composite) $db->exec('ALTER TABLE modulo ADD UNIQUE KEY uq_modulo_curso_ordem (curso_id,ordem)');
};
