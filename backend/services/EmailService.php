<?php

declare(strict_types=1);

namespace Viridis\services;

final class EmailService
{
    public function sendTeacherInvite(string $email, string $institution, string $link): bool
    {
        // TODO: conectar um provedor SMTP (por exemplo PHPMailer) e enviar o link.
        // O link continua sendo retornado pela API enquanto o SMTP não estiver configurado.
        return false;
    }
}

