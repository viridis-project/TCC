<?php

declare(strict_types=1);

spl_autoload_register(function (string $class): void {
    $prefix = 'Viridis\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }
    $relative = str_replace('\\', DIRECTORY_SEPARATOR, substr($class, strlen($prefix)));
    $file = dirname(__DIR__) . DIRECTORY_SEPARATOR . $relative . '.php';
    if (is_file($file)) {
        require $file;
    }
});

function env(string $key, ?string $default = null): ?string
{
    $value = $_ENV[$key] ?? getenv($key);
    return ($value === false || $value === null) ? $default : (string) $value;
}

$envFile = dirname(__DIR__) . '/.env';
if (is_file($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = array_map('trim', explode('=', $line, 2));
        $value = trim($value, "\"'");
        if (getenv($key) === false) {
            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
        }
    }
}

$config = [
    'debug' => filter_var(env('APP_DEBUG', 'false'), FILTER_VALIDATE_BOOL),
    'frontend_origin' => env('FRONTEND_ORIGIN', 'http://localhost:8080'),
    'session_name' => env('SESSION_NAME', 'viridis_session'),
    'session_secret' => env('SESSION_SECRET', ''),
    'session_save_path' => dirname(__DIR__) . '/' . trim((string) env('SESSION_SAVE_PATH', 'storage/sessions'), '/\\'),
    'db' => [
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => env('DB_PORT', '3306'),
        'name' => env('DB_NAME', 'viridisbd'),
        'user' => env('DB_USER', 'root'),
        'pass' => env('DB_PASS', ''),
    ],
    'upload_dir' => dirname(__DIR__) . '/' . trim((string) env('UPLOAD_DIR', 'uploads'), '/\\'),
    'upload_max_bytes' => (int) env('UPLOAD_MAX_BYTES', '5242880'),
];

date_default_timezone_set('America/Sao_Paulo');
ini_set('session.use_strict_mode', '1');
if (!is_dir($config['session_save_path'])) {
    mkdir($config['session_save_path'], 0750, true);
}
session_save_path($config['session_save_path']);
session_name((string) $config['session_name']);
session_set_cookie_params([
    'httponly' => true,
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'samesite' => 'Lax',
    'path' => '/',
]);
session_start();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . $config['frontend_origin']);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Vary: Origin');

return $config;
