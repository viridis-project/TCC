<?php

declare(strict_types=1);

namespace Viridis\services;

use PDO;
use RuntimeException;

final class CodeGenerator
{
    private const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    public function __construct(private PDO $db) {}

    public function classCode(string $className): string
    {
        $prefix = strtoupper((string) preg_replace('/[^A-Z0-9]/i', '', $className));
        $prefix = substr($prefix ?: 'TUR', 0, 3);
        for ($attempt = 0; $attempt < 12; $attempt++) {
            $suffix = $this->randomChars(4);
            $code = $prefix . '-' . $suffix;
            $stmt = $this->db->prepare('SELECT 1 FROM turma_escolar WHERE codigo_acesso=? LIMIT 1');
            $stmt->execute([$code]);
            if (!$stmt->fetchColumn()) return $code;
        }
        throw new RuntimeException('Não foi possível gerar um código único para a turma');
    }

    public function inviteToken(): string
    {
        for ($attempt = 0; $attempt < 12; $attempt++) {
            $token = bin2hex(random_bytes(32));
            $stmt = $this->db->prepare('SELECT 1 FROM convite_professor WHERE token=? LIMIT 1');
            $stmt->execute([$token]);
            if (!$stmt->fetchColumn()) return $token;
        }
        throw new RuntimeException('Não foi possível gerar um token único');
    }

    private function randomChars(int $length): string
    {
        $value = '';
        $max = strlen(self::ALPHABET) - 1;
        for ($i = 0; $i < $length; $i++) $value .= self::ALPHABET[random_int(0, $max)];
        return $value;
    }
}

