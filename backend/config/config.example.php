<?php

return [
    'frontend_origin' => 'http://localhost:8080',
    'session_name' => 'viridis_session',
    'session_secret' => 'troque-por-uma-chave-aleatoria-longa',
    'session_save_path' => dirname(__DIR__) . '/storage/sessions',
    'db' => [
        'host' => '127.0.0.1',
        'port' => '3306',
        'name' => 'viridisbd',
        'user' => 'root',
        'pass' => '',
    ],
    'upload_dir' => dirname(__DIR__) . '/uploads',
    'upload_max_bytes' => 5 * 1024 * 1024,
];
