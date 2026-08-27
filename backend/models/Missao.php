<?php
declare(strict_types=1);
namespace Viridis\models;
final class Missao extends BaseModel
{
    public function all(): array
    {
        $stmt = $this->db->prepare("SELECT id,titulo,descricao,tipo,pontos_recompensa FROM missao WHERE tipo IN ('plant','water','compost','share') ORDER BY id");
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
