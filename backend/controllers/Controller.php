<?php

declare(strict_types=1);

namespace Viridis\controllers;

abstract class Controller
{
    protected function json(array $data, int $status = 200): never
    {
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    protected function input(): array
    {
        $type = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($type, 'application/json')) {
            $decoded = json_decode((string) file_get_contents('php://input'), true);
            return is_array($decoded) ? $decoded : [];
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            return $_POST;
        }
        parse_str((string) file_get_contents('php://input'), $data);
        return is_array($data) ? $data : [];
    }

    protected function required(array $data, array $fields): void
    {
        foreach ($fields as $field) {
            if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
                $this->json(['erro' => 'Preencha todos os campos obrigatórios'], 422);
            }
        }
    }
}

