<?php

declare(strict_types=1);

return static function (PDO $db): void {
    $db->exec("CREATE TABLE IF NOT EXISTS convite_diretor (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(150) NOT NULL,
        instituicao_id INT NOT NULL,
        token CHAR(64) NOT NULL,
        criado_por INT NOT NULL,
        expira_em DATETIME NOT NULL,
        usado_em DATETIME DEFAULT NULL,
        usuario_criado_id INT DEFAULT NULL,
        criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_convite_diretor_token (token),
        INDEX idx_convite_diretor_instituicao_email (instituicao_id,email),
        INDEX idx_convite_diretor_expiracao (expira_em,usado_em),
        CONSTRAINT fk_convite_diretor_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicao(id),
        CONSTRAINT fk_convite_diretor_criador FOREIGN KEY (criado_por) REFERENCES usuario(id),
        CONSTRAINT fk_convite_diretor_usuario FOREIGN KEY (usuario_criado_id) REFERENCES usuario(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci");
};
