<?php

declare(strict_types=1);

namespace Viridis\models;

use PDO;

abstract class BaseModel
{
    public function __construct(protected PDO $db) {}
}

