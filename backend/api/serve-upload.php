<?php

declare(strict_types=1);

$config = require dirname(__DIR__) . '/config/bootstrap.php';
$filename = $_GET['file'] ?? null;

if (!is_string($filename) || !preg_match('/^[A-Za-z0-9._()-]+$/', $filename)) {
    http_response_code(404);
    exit;
}

$uploadDir = realpath($config['upload_dir']);
$filePath = $uploadDir === false
    ? false
    : realpath($uploadDir . DIRECTORY_SEPARATOR . $filename);

if (
    $filePath === false
    || !is_file($filePath)
    || !str_starts_with($filePath, $uploadDir . DIRECTORY_SEPARATOR)
) {
    http_response_code(404);
    exit;
}

$mime = (new finfo(FILEINFO_MIME_TYPE))->file($filePath);
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
if (!in_array($mime, $allowedTypes, true)) {
    http_response_code(404);
    exit;
}

header('Content-Type: ' . $mime);
header('Content-Length: ' . (string) filesize($filePath));
header('Content-Disposition: inline; filename="' . basename($filePath) . '"');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=3600');
readfile($filePath);
