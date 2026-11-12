<?php

declare(strict_types=1);

/**
 * Restores the fixed demo images used by the sample missions and rewards.
 */
return static function (PDO $db): void {
    $missions = [
        'Teste técnico agenda 20260825' => '/uploads/exemplo-foto-horta.jpeg',
        'Teste vínculo turma agenda 20260825' => '/uploads/exemplo-foto-horta(2).webp',
    ];
    $rewards = [
        'Cesta de Legumes do Bairro' => '/uploads/cesta-legumes-bairro.webp',
        'Desconto na Padaria Local' => '/uploads/padaria-local.webp',
        'Livro sobre Sustentabilidade' => '/uploads/livro-sustentabilidade.avif',
        'Kit de Jardinagem' => '/uploads/kit-jardinagem.jpg',
        'Workshop de Compostagem' => '/uploads/workshop-compostagem.webp',
        'Muda de Árvore Frutífera' => '/uploads/muda-arvore.jpg',
        'teste' => '/uploads/pa-teste.jpg',
    ];

    $db->beginTransaction();
    try {
        $updateMission = $db->prepare('UPDATE missao SET imagem=? WHERE titulo=? AND turma_id IS NOT NULL');
        foreach ($missions as $title => $image) {
            $updateMission->execute([$image, $title]);
        }

        $updateReward = $db->prepare('UPDATE recompensa SET imagem=? WHERE titulo=?');
        foreach ($rewards as $title => $image) {
            $updateReward->execute([$image, $title]);
        }

        $db->commit();
    } catch (Throwable $error) {
        if ($db->inTransaction()) $db->rollBack();
        throw $error;
    }
};
