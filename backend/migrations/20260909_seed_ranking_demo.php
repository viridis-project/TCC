<?php

declare(strict_types=1);

// Viridis — popula o banco com dados de demonstração para o ranking
// e corrige as contas de teste ("teste"/"teste") que apareciam
// misturadas com dados reais na Classificação Completa.
//
// Migration IDEMPOTENTE: pode ser aplicada mais de uma vez sem criar
// linhas duplicadas (cada INSERT só roda se o registro ainda não existir).
//
// Senha de todas as contas novas: Viridis2026 (mesma senha padrão
// documentada em frontend/README.md)

return static function (PDO $db): void {
    $statements = [
        // 1) A turma "teste" e o aluno "teste" eram contas manuais de teste
        //    (não faziam parte do seed oficial). Em vez de apagar (o aluno já
        //    tem missões e lições registradas), elas são renomeadas para
        //    ficarem consistentes com o restante do ranking.
        "UPDATE turma_escolar
         SET nome = '7B', codigo_acesso = '7B-9K3M'
         WHERE nome = 'teste' AND instituicao_id = 1",

        "UPDATE usuario
         SET nome = 'Rafael Nogueira',
             turma = '7B',
             turma_id = (SELECT id FROM turma_escolar WHERE nome = '7B' AND instituicao_id = 1 LIMIT 1),
             instituicao_id = 1
         WHERE username = 'teste'",

        // 2) Uma segunda escola, para o ranking "Escolas" ter mais de uma linha
        "INSERT INTO instituicao (nome)
         SELECT 'Colégio Semente Verde'
         WHERE NOT EXISTS (SELECT 1 FROM instituicao WHERE nome = 'Colégio Semente Verde')",

        // 3) Mais turmas: mais uma na Escola Viridis e duas no novo colégio
        "INSERT INTO turma_escolar (instituicao_id, nome, ano_letivo, codigo_acesso, codigo_ativo)
         SELECT id, '8A', 2026, '8A-4T7Q', 1 FROM instituicao WHERE nome = 'Escola Viridis'
           AND NOT EXISTS (
             SELECT 1 FROM turma_escolar WHERE nome = '8A'
               AND instituicao_id = (SELECT id FROM instituicao WHERE nome = 'Escola Viridis')
           )",

        "INSERT INTO turma_escolar (instituicao_id, nome, ano_letivo, codigo_acesso, codigo_ativo)
         SELECT id, '6A', 2026, '6A-77B3', 1 FROM instituicao WHERE nome = 'Colégio Semente Verde'
           AND NOT EXISTS (
             SELECT 1 FROM turma_escolar WHERE nome = '6A'
               AND instituicao_id = (SELECT id FROM instituicao WHERE nome = 'Colégio Semente Verde')
           )",

        "INSERT INTO turma_escolar (instituicao_id, nome, ano_letivo, codigo_acesso, codigo_ativo)
         SELECT id, '6B', 2026, '6B-91FZ', 1 FROM instituicao WHERE nome = 'Colégio Semente Verde'
           AND NOT EXISTS (
             SELECT 1 FROM turma_escolar WHERE nome = '6B'
               AND instituicao_id = (SELECT id FROM instituicao WHERE nome = 'Colégio Semente Verde')
           )",

        // 4) Novos alunos distribuídos entre as turmas, com pontuações
        //    variadas para o pódio e a classificação ficarem visíveis
        "INSERT INTO usuario (nome, username, email, senha, turma, turma_id, instituicao_id, pontos_totais, nivel, xp, xp_proximo_nivel, streak_dias, ultima_atividade_em, perfil_id)
         SELECT 'Bruno Alves Costa','bruno.alves','bruno.alves@escola.edu.br','\$2y\$10\$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',
                '7A',(SELECT id FROM turma_escolar WHERE nome='7A' AND instituicao_id=1),1,
                900,6,900,1100,5,'2026-09-02',(SELECT id FROM perfil WHERE nome='aluno')
         WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username='bruno.alves')",

        "INSERT INTO usuario (nome, username, email, senha, turma, turma_id, instituicao_id, pontos_totais, nivel, xp, xp_proximo_nivel, streak_dias, ultima_atividade_em, perfil_id)
         SELECT 'Carla Souza Lima','carla.souza','carla.souza@escola.edu.br','\$2y\$10\$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',
                '7A',(SELECT id FROM turma_escolar WHERE nome='7A' AND instituicao_id=1),1,
                700,5,700,900,3,'2026-09-01',(SELECT id FROM perfil WHERE nome='aluno')
         WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username='carla.souza')",

        "INSERT INTO usuario (nome, username, email, senha, turma, turma_id, instituicao_id, pontos_totais, nivel, xp, xp_proximo_nivel, streak_dias, ultima_atividade_em, perfil_id)
         SELECT 'Diego Martins','diego.martins','diego.martins@escola.edu.br','\$2y\$10\$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',
                '7B',(SELECT id FROM turma_escolar WHERE nome='7B' AND instituicao_id=1),1,
                450,3,450,600,2,'2026-08-30',(SELECT id FROM perfil WHERE nome='aluno')
         WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username='diego.martins')",

        "INSERT INTO usuario (nome, username, email, senha, turma, turma_id, instituicao_id, pontos_totais, nivel, xp, xp_proximo_nivel, streak_dias, ultima_atividade_em, perfil_id)
         SELECT 'Felipe Rocha','felipe.rocha','felipe.rocha@escola.edu.br','\$2y\$10\$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',
                '8A',(SELECT id FROM turma_escolar WHERE nome='8A' AND instituicao_id=1),1,
                1100,7,1100,1300,9,'2026-09-03',(SELECT id FROM perfil WHERE nome='aluno')
         WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username='felipe.rocha')",

        "INSERT INTO usuario (nome, username, email, senha, turma, turma_id, instituicao_id, pontos_totais, nivel, xp, xp_proximo_nivel, streak_dias, ultima_atividade_em, perfil_id)
         SELECT 'Giovanna Ramos','giovanna.ramos','giovanna.ramos@escola.edu.br','\$2y\$10\$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',
                '8A',(SELECT id FROM turma_escolar WHERE nome='8A' AND instituicao_id=1),1,
                950,6,950,1150,6,'2026-09-02',(SELECT id FROM perfil WHERE nome='aluno')
         WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username='giovanna.ramos')",

        "INSERT INTO usuario (nome, username, email, senha, turma, turma_id, instituicao_id, pontos_totais, nivel, xp, xp_proximo_nivel, streak_dias, ultima_atividade_em, perfil_id)
         SELECT 'Isabela Nunes','isabela.nunes','isabela.nunes@colegio.edu.br','\$2y\$10\$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',
                '6A',(SELECT id FROM turma_escolar WHERE nome='6A' AND instituicao_id=(SELECT id FROM instituicao WHERE nome='Colégio Semente Verde')),
                (SELECT id FROM instituicao WHERE nome='Colégio Semente Verde'),
                800,5,800,1000,4,'2026-09-01',(SELECT id FROM perfil WHERE nome='aluno')
         WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username='isabela.nunes')",

        "INSERT INTO usuario (nome, username, email, senha, turma, turma_id, instituicao_id, pontos_totais, nivel, xp, xp_proximo_nivel, streak_dias, ultima_atividade_em, perfil_id)
         SELECT 'João Pedro Farias','joao.farias','joao.farias@colegio.edu.br','\$2y\$10\$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',
                '6A',(SELECT id FROM turma_escolar WHERE nome='6A' AND instituicao_id=(SELECT id FROM instituicao WHERE nome='Colégio Semente Verde')),
                (SELECT id FROM instituicao WHERE nome='Colégio Semente Verde'),
                600,4,600,800,2,'2026-08-29',(SELECT id FROM perfil WHERE nome='aluno')
         WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username='joao.farias')",

        "INSERT INTO usuario (nome, username, email, senha, turma, turma_id, instituicao_id, pontos_totais, nivel, xp, xp_proximo_nivel, streak_dias, ultima_atividade_em, perfil_id)
         SELECT 'Karina Duarte','karina.duarte','karina.duarte@colegio.edu.br','\$2y\$10\$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',
                '6B',(SELECT id FROM turma_escolar WHERE nome='6B' AND instituicao_id=(SELECT id FROM instituicao WHERE nome='Colégio Semente Verde')),
                (SELECT id FROM instituicao WHERE nome='Colégio Semente Verde'),
                1000,6,1000,1200,7,'2026-09-03',(SELECT id FROM perfil WHERE nome='aluno')
         WHERE NOT EXISTS (SELECT 1 FROM usuario WHERE username='karina.duarte')",
    ];

    $db->beginTransaction();
    try {
        foreach ($statements as $sql) {
            $db->exec($sql);
        }
        $db->commit();
    } catch (\Throwable $e) {
        $db->rollBack();
        throw $e;
    }
};
