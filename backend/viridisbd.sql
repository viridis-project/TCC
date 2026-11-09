-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 28-Out-2026 às 13:49
-- Versão do servidor: 10.4.28-MariaDB
-- versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `viridisbd`
--
CREATE DATABASE IF NOT EXISTS `viridisbd` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `viridisbd`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `agenda`
--

CREATE TABLE `agenda` (
  `id` int(11) NOT NULL,
  `aluno_id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `turma_id` int(11) DEFAULT NULL,
  `missao_id` int(11) DEFAULT NULL,
  `titulo` varchar(150) NOT NULL,
  `data_hora` datetime NOT NULL,
  `status` enum('agendado','concluido','cancelado') NOT NULL DEFAULT 'agendado',
  `criado_em` datetime NOT NULL DEFAULT current_timestamp(),
  `task_id` int(11) DEFAULT NULL,
  `grupo_id` char(36) DEFAULT NULL,
  `missao_publicada_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `agenda`
--

INSERT INTO `agenda` (`id`, `aluno_id`, `professor_id`, `turma_id`, `missao_id`, `titulo`, `data_hora`, `status`, `criado_em`, `task_id`, `grupo_id`, `missao_publicada_id`) VALUES
(1, 1, 2, 1, NULL, 'Teste técnico agenda 20260825', '2026-08-26 09:30:00', 'concluido', '2026-08-25 18:50:59', 1, NULL, 1),
(2, 1, 2, 1, NULL, 'Teste vínculo turma agenda 20260825', '2026-08-27 10:15:00', 'agendado', '2026-08-25 19:14:11', 2, NULL, 2);

-- --------------------------------------------------------

--
-- Estrutura da tabela `certificado`
--

CREATE TABLE `certificado` (
  `id` int(11) NOT NULL,
  `aluno_id` int(11) NOT NULL,
  `codigo_verificacao` varchar(100) NOT NULL,
  `url_pdf` varchar(500) DEFAULT NULL,
  `data_emissao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `conquista`
--

CREATE TABLE `conquista` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `icone` varchar(50) NOT NULL,
  `regra` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `conquista`
--

INSERT INTO `conquista` (`id`, `titulo`, `descricao`, `icone`, `regra`) VALUES
(1, 'Primeira Semente', 'Concluiu sua primeira lição', 'Sprout', 'licoes:1'),
(2, 'Compostador', 'Completou o módulo de nutrição', 'Recycle', 'modulo_completo:2'),
(3, 'Sequência de 7 dias', 'Estudou 7 dias seguidos', 'Flame', 'streak:7'),
(4, 'Conhecedor de Pragas', 'Terminou o módulo 3', 'Bug', 'modulo_completo:3'),
(5, 'Mestre Jardineiro', 'Concluiu todos os módulos', 'Trophy', 'todos_modulos'),
(6, 'Top 3 Ranking', 'Entrou nos 3 primeiros', 'Medal', 'ranking:3');

-- --------------------------------------------------------

--
-- Estrutura da tabela `convite_professor`
--

CREATE TABLE `convite_professor` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `instituicao_id` int(11) NOT NULL,
  `token` varchar(64) NOT NULL,
  `criado_por` int(11) NOT NULL,
  `expira_em` datetime NOT NULL,
  `usado_em` datetime DEFAULT NULL,
  `usuario_criado_id` int(11) DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cronograma_aluno`
--

CREATE TABLE `cronograma_aluno` (
  `id` int(11) NOT NULL,
  `aluno_id` int(11) NOT NULL,
  `missao_id` int(11) NOT NULL,
  `data_sugerida` datetime DEFAULT NULL,
  `data_limite_personalizada` datetime DEFAULT NULL,
  `status_atividade` varchar(20) DEFAULT 'Pendente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `cronograma_aluno`
--

INSERT INTO `cronograma_aluno` (`id`, `aluno_id`, `missao_id`, `data_sugerida`, `data_limite_personalizada`, `status_atividade`) VALUES
(1, 3, 1, '2026-08-11 18:29:00', NULL, 'Concluída');

-- --------------------------------------------------------

--
-- Estrutura da tabela `curso`
--

CREATE TABLE `curso` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` varchar(1000) NOT NULL DEFAULT '',
  `escopo` enum('app','escola','turma') NOT NULL,
  `instituicao_id` int(11) DEFAULT NULL,
  `turma_id` int(11) DEFAULT NULL,
  `criador_id` int(11) DEFAULT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT 0,
  `ativo` tinyint(1) NOT NULL DEFAULT 1,
  `legado` tinyint(1) NOT NULL DEFAULT 0,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `curso`
--

INSERT INTO `curso` (`id`, `titulo`, `descricao`, `escopo`, `instituicao_id`, `turma_id`, `criador_id`, `publicado`, `ativo`, `legado`, `criado_em`) VALUES
(1, 'Trilha de sustentabilidade', 'Conteúdo original do Viridis.', 'app', NULL, NULL, NULL, 1, 1, 1, '2026-08-25 17:59:57');

-- --------------------------------------------------------

--
-- Estrutura da tabela `horta`
--

CREATE TABLE `horta` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `instituicao_id` int(11) NOT NULL,
  `localizacao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `inspecao_horta`
--

CREATE TABLE `inspecao_horta` (
  `id` int(11) NOT NULL,
  `horta_id` int(11) NOT NULL,
  `responsavel_id` int(11) NOT NULL,
  `qtd_plantas` int(11) DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `data_inspecao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `instituicao`
--

CREATE TABLE `instituicao` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `cnpj` varchar(20) DEFAULT NULL,
  `data_cadastro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `instituicao`
--

INSERT INTO `instituicao` (`id`, `nome`, `cnpj`, `data_cadastro`) VALUES
(1, 'Escola Viridis', NULL, '2026-08-25 17:59:57'),
(3, 'Colégio Semente Verde', NULL, '2026-10-28 08:10:20');

-- --------------------------------------------------------

--
-- Estrutura da tabela `licao`
--

CREATE TABLE `licao` (
  `id` int(11) NOT NULL,
  `modulo_id` int(11) NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `kind` enum('lesson','challenge','exam','certificate','trophy') NOT NULL DEFAULT 'lesson',
  `xp` int(11) NOT NULL DEFAULT 0,
  `ordem` int(11) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `licao`
--

INSERT INTO `licao` (`id`, `modulo_id`, `titulo`, `kind`, `xp`, `ordem`, `ativo`) VALUES
(1, 1, 'Sementes e germinação', 'lesson', 50, 1, 1),
(2, 1, 'Tipos de solo', 'lesson', 50, 2, 1),
(3, 1, 'Desafio: Primeira muda', 'challenge', 100, 3, 1),
(4, 1, 'Avaliação do módulo', 'exam', 150, 4, 1),
(5, 2, 'Macronutrientes', 'lesson', 50, 1, 1),
(6, 2, 'Composto orgânico', 'lesson', 50, 2, 1),
(7, 2, 'Desafio: Composteira', 'challenge', 100, 3, 1),
(8, 3, 'Insetos benéficos', 'lesson', 50, 1, 1),
(9, 3, 'Repelentes naturais', 'lesson', 60, 2, 1),
(10, 3, 'Desafio: Calda caseira', 'challenge', 100, 3, 1),
(11, 3, 'Avaliação', 'exam', 150, 4, 1),
(12, 4, 'Grupos alimentares', 'lesson', 50, 1, 1),
(13, 4, 'Receitas da horta', 'lesson', 50, 2, 1),
(14, 5, 'Minhocário', 'lesson', 80, 1, 1),
(15, 6, 'Certificado Viridis', 'certificate', 500, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `missao`
--

CREATE TABLE `missao` (
  `id` int(11) NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `tipo` enum('plant','water','compost','share','outro') NOT NULL DEFAULT 'outro',
  `pontos_recompensa` int(11) NOT NULL DEFAULT 10,
  `criador_id` int(11) NOT NULL,
  `data_criacao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `missao`
--

INSERT INTO `missao` (`id`, `titulo`, `descricao`, `tipo`, `pontos_recompensa`, `criador_id`, `data_criacao`) VALUES
(1, 'Plantio', 'Registre o plantio de uma muda ou semente.', 'plant', 50, 2, '2026-08-25 17:59:57'),
(2, 'Rega consciente', 'Registre uma rega feita sem desperdício.', 'water', 20, 2, '2026-08-25 17:59:57'),
(3, 'Compostagem', 'Transforme resíduos orgânicos em composto.', 'compost', 75, 2, '2026-08-25 17:59:57'),
(4, 'Compartilhar', 'Compartilhe uma prática sustentável.', 'share', 25, 2, '2026-08-25 17:59:57');

-- --------------------------------------------------------

--
-- Estrutura da tabela `missao_convite`
--

CREATE TABLE `missao_convite` (
  `id` int(11) NOT NULL,
  `missao_publicada_id` int(11) NOT NULL,
  `grupo_id` char(36) NOT NULL,
  `convidado_id` int(11) NOT NULL,
  `convidante_id` int(11) NOT NULL,
  `status` enum('pendente','aceito','recusado') NOT NULL DEFAULT 'pendente',
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `missao_pontuacao`
--

CREATE TABLE `missao_pontuacao` (
  `missao_publicada_id` int(11) NOT NULL,
  `grupo_id` char(36) NOT NULL,
  `aluno_id` int(11) NOT NULL,
  `pontos` int(11) NOT NULL DEFAULT 0,
  `fonte` enum('submissao','conclusao_legada') NOT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `missao_pontuacao`
--

INSERT INTO `missao_pontuacao` (`missao_publicada_id`, `grupo_id`, `aluno_id`, `pontos`, `fonte`, `criado_em`) VALUES
(1, 'legacy-1', 1, 0, 'conclusao_legada', '2026-08-25 18:50:59');

-- --------------------------------------------------------

--
-- Estrutura da tabela `missao_publicada`
--

CREATE TABLE `missao_publicada` (
  `id` int(11) NOT NULL,
  `turma_id` int(11) NOT NULL,
  `criador_id` int(11) NOT NULL,
  `missao_id` int(11) DEFAULT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text NOT NULL,
  `instrucoes` text DEFAULT NULL,
  `imagem` varchar(500) DEFAULT NULL,
  `tipo` enum('plant','water','compost','share','outro') NOT NULL DEFAULT 'outro',
  `pontos` int(11) NOT NULL DEFAULT 0,
  `max_alunos` int(11) NOT NULL DEFAULT 1,
  `modo_participacao` enum('aberto','particular') NOT NULL DEFAULT 'aberto',
  `requer_submissao` tinyint(1) NOT NULL DEFAULT 1,
  `ativa` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `missao_publicada`
--

INSERT INTO `missao_publicada` (`id`, `turma_id`, `criador_id`, `missao_id`, `titulo`, `descricao`, `instrucoes`, `imagem`, `tipo`, `pontos`, `max_alunos`, `modo_participacao`, `requer_submissao`, `ativa`, `criado_em`) VALUES
(1, 1, 2, NULL, 'Teste técnico agenda 20260825', '', '', NULL, 'outro', 0, 1, 'aberto', 0, 1, '2026-10-28 08:10:20'),
(2, 1, 2, NULL, 'Teste vínculo turma agenda 20260825', '', '', NULL, 'outro', 0, 1, 'aberto', 0, 1, '2026-10-28 08:10:20');

-- --------------------------------------------------------

--
-- Estrutura da tabela `modulo`
--

CREATE TABLE `modulo` (
  `id` int(11) NOT NULL,
  `curso_id` int(11) DEFAULT NULL,
  `titulo` varchar(100) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `cor` varchar(50) NOT NULL,
  `ordem` int(11) NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `modulo`
--

INSERT INTO `modulo` (`id`, `curso_id`, `titulo`, `descricao`, `cor`, `ordem`, `ativo`) VALUES
(1, 1, 'Plantio Básico', 'Fundamentos do cultivo e preparação do solo', 'oklch(0.62 0.18 150)', 1, 1),
(2, 1, 'Nutrição do Solo', 'Compostagem, adubos e ciclo de nutrientes', 'oklch(0.62 0.18 150)', 2, 1),
(3, 1, 'Controle de Pragas', 'Manejo natural e prevenção integrada', 'oklch(0.65 0.17 95)', 3, 1),
(4, 1, 'Alimentação Saudável', 'Da horta ao prato: nutrição consciente', 'oklch(0.62 0.16 240)', 4, 1),
(5, 1, 'Compostagem Avançada', 'Vermicompostagem e bioinsumos', 'oklch(0.70 0.18 50)', 5, 1),
(6, 1, 'Certificado Final', 'Conclusão da trilha de sustentabilidade', 'oklch(0.75 0.16 75)', 6, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `notificacao`
--

CREATE TABLE `notificacao` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `tipo` varchar(40) NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `mensagem` varchar(500) NOT NULL,
  `lida` tinyint(1) NOT NULL DEFAULT 0,
  `link` varchar(120) DEFAULT NULL,
  `criada_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `notificacao`
--

INSERT INTO `notificacao` (`id`, `usuario_id`, `tipo`, `titulo`, `mensagem`, `lida`, `link`, `criada_em`) VALUES
(1, 1, 'conquista', 'Bem-vinda à Viridis!', 'Sua central de notificações já está ativa.', 1, '/jardim', '2026-08-25 18:40:26'),
(2, 1, 'tarefa_agendada', 'Nova tarefa agendada', 'Teste técnico agenda 20260825 em 26/08/2026 09:30', 1, '/horarios', '2026-08-25 18:50:59'),
(3, 2, 'designacao_professor', 'Nova turma designada', 'Você foi designado para a turma teste', 1, '/horarios', '2026-08-25 18:57:37'),
(4, 1, 'tarefa_agendada', 'Nova tarefa agendada', 'Teste vínculo turma agenda 20260825 em 27/08/2026 10:15', 1, '/horarios', '2026-08-25 19:14:11');

-- --------------------------------------------------------

--
-- Estrutura da tabela `opcao_quiz`
--

CREATE TABLE `opcao_quiz` (
  `id` int(11) NOT NULL,
  `pergunta_id` int(11) NOT NULL,
  `texto_opcao` varchar(255) NOT NULL,
  `is_correta` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `opcao_quiz`
--

INSERT INTO `opcao_quiz` (`id`, `pergunta_id`, `texto_opcao`, `is_correta`) VALUES
(1, 1, 'Realizar fotossíntese', 0),
(2, 1, 'Absorver água e nutrientes do solo', 1),
(3, 1, 'Atrair polinizadores', 0),
(4, 1, 'Produzir sementes', 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `parceiro`
--

CREATE TABLE `parceiro` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `tipo` enum('Vegetais','Padaria','Educação','Ferramentas','Reciclagem','Outros') NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `parceiro`
--

INSERT INTO `parceiro` (`id`, `nome`, `tipo`, `email`, `telefone`, `ativo`) VALUES
(1, 'Horta da Esquina', 'Vegetais', 'contato@hortadaesquina.local', NULL, 1),
(2, 'Pão Quente', 'Padaria', 'contato@paoquente.local', NULL, 1),
(3, 'Livraria Verde', 'Educação', 'contato@livrariaverde.local', NULL, 1),
(4, 'Jardinagem & Cia', 'Ferramentas', 'contato@jardinagemcia.local', NULL, 1),
(5, 'EcoLab', 'Reciclagem', 'contato@ecolab.local', NULL, 1),
(6, 'Viveiro Local', 'Vegetais', 'contato@viveirolocal.local', NULL, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `perfil`
--

CREATE TABLE `perfil` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `descricao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `perfil`
--

INSERT INTO `perfil` (`id`, `nome`, `descricao`) VALUES
(1, 'aluno', 'Estudante'),
(2, 'professor', 'Professor responsável'),
(3, 'admin', 'Administrador'),
(4, 'diretor', 'Diretor da instituição');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pergunta_quiz`
--

CREATE TABLE `pergunta_quiz` (
  `id` int(11) NOT NULL,
  `criador_id` int(11) NOT NULL,
  `licao_id` int(11) DEFAULT NULL,
  `texto_pergunta` text NOT NULL,
  `explicacao` varchar(500) DEFAULT NULL,
  `pontos_recompensa` int(11) DEFAULT 5,
  `ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `pergunta_quiz`
--

INSERT INTO `pergunta_quiz` (`id`, `criador_id`, `licao_id`, `texto_pergunta`, `explicacao`, `pontos_recompensa`, `ativo`) VALUES
(1, 2, 1, 'Qual é a principal função das raízes de uma planta?', 'As raízes fixam a planta e absorvem água e minerais essenciais para seu desenvolvimento.', 5, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `progresso_quiz`
--

CREATE TABLE `progresso_quiz` (
  `id` int(11) NOT NULL,
  `aluno_id` int(11) NOT NULL,
  `pergunta_id` int(11) NOT NULL,
  `acertou` tinyint(1) NOT NULL,
  `data_resposta` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `progresso_quiz`
--

INSERT INTO `progresso_quiz` (`id`, `aluno_id`, `pergunta_id`, `acertou`, `data_resposta`) VALUES
(1, 3, 1, 0, '2026-08-25 18:26:28'),
(2, 3, 1, 1, '2026-08-25 18:26:35');

-- --------------------------------------------------------

--
-- Estrutura da tabela `recompensa`
--

CREATE TABLE `recompensa` (
  `id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `escopo` enum('app','escola') NOT NULL DEFAULT 'app',
  `parceiro_id` int(11) DEFAULT NULL,
  `instituicao_id` int(11) DEFAULT NULL,
  `pontos_necessarios` int(11) NOT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `recompensa`
--

INSERT INTO `recompensa` (`id`, `titulo`, `escopo`, `parceiro_id`, `instituicao_id`, `pontos_necessarios`, `imagem`, `ativo`) VALUES
(1, 'Cesta de Legumes do Bairro', 'app', 1, NULL, 500, '🥬', 1),
(2, 'Desconto na Padaria Local', 'app', 2, NULL, 300, '🥖', 1),
(3, 'Livro sobre Sustentabilidade', 'app', 3, NULL, 800, '📗', 1),
(4, 'Kit de Jardinagem', 'app', 4, NULL, 1200, '🌱', 1),
(5, 'Workshop de Compostagem', 'app', 5, NULL, 700, '♻️', 1),
(6, 'Muda de Árvore Frutífera', 'app', 6, NULL, 400, '🌳', 1),
(9, 'teste', 'escola', 2, 1, 100, '🎁', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `resgate`
--

CREATE TABLE `resgate` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `recompensa_id` int(11) NOT NULL,
  `pontos_debitados` int(11) NOT NULL,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `schema_migration`
--

CREATE TABLE `schema_migration` (
  `nome` varchar(150) NOT NULL,
  `aplicada_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `schema_migration`
--

INSERT INTO `schema_migration` (`nome`, `aplicada_em`) VALUES
('20260909_learning.php', '2026-10-28 08:09:16'),
('20260909_learning_indexes.php', '2026-10-28 08:09:16'),
('20260909_optional_reward_partner.php', '2026-10-28 08:09:16'),
('20260909_seed_ranking_demo.php', '2026-10-28 08:10:20'),
('20261023_open_tasks.php', '2026-10-28 08:10:20'),
('20261024_team_task_participation.php', '2026-10-28 08:10:20'),
('20261028_published_missions.php', '2026-10-28 09:48:04');

-- --------------------------------------------------------

--
-- Estrutura da tabela `submissao_missao`
--

CREATE TABLE `submissao_missao` (
  `id` int(11) NOT NULL,
  `aluno_id` int(11) NOT NULL,
  `missao_id` int(11) NOT NULL,
  `descricao` varchar(280) NOT NULL DEFAULT '',
  `url_foto` varchar(500) NOT NULL,
  `ia_validada` tinyint(1) DEFAULT NULL,
  `professor_validado` tinyint(1) DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `comentario_professor` varchar(255) DEFAULT NULL,
  `revisado_por` int(11) DEFAULT NULL,
  `revisado_em` datetime DEFAULT NULL,
  `data_envio` datetime DEFAULT current_timestamp(),
  `missao_publicada_id` int(11) DEFAULT NULL,
  `grupo_id` char(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `submissao_missao`
--

INSERT INTO `submissao_missao` (`id`, `aluno_id`, `missao_id`, `descricao`, `url_foto`, `ia_validada`, `professor_validado`, `status`, `comentario_professor`, `revisado_por`, `revisado_em`, `data_envio`, `missao_publicada_id`, `grupo_id`) VALUES
(1, 3, 1, 'plantei', '/uploads/4246460f2aee61d2b48e2ba5d85278a0.png', NULL, 1, 'approved', 'Ótimo trabalho! 🌱', 2, '2026-08-25 18:24:45', '2026-08-25 18:23:37', NULL, NULL),
(2, 3, 3, 'teste', '/uploads/b3f9962a576dd869d80f19b8abed0919.png', NULL, 1, 'approved', 'Adicione mais detalhes da foto', 2, '2026-08-25 18:38:37', '2026-08-25 18:38:28', NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `tarefa_aberta`
--

CREATE TABLE `tarefa_aberta` (
  `id` int(11) NOT NULL,
  `turma_id` int(11) NOT NULL,
  `criador_id` int(11) NOT NULL,
  `missao_id` int(11) DEFAULT NULL,
  `titulo` varchar(150) NOT NULL,
  `descricao` text NOT NULL,
  `pontos` int(11) NOT NULL DEFAULT 0,
  `max_alunos` int(11) NOT NULL DEFAULT 1,
  `modo_participacao` enum('escolher','aberto','particular') NOT NULL DEFAULT 'escolher',
  `ativa` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `tarefa_aberta`
--

INSERT INTO `tarefa_aberta` (`id`, `turma_id`, `criador_id`, `missao_id`, `titulo`, `descricao`, `pontos`, `max_alunos`, `modo_participacao`, `ativa`, `criado_em`) VALUES
(1, 1, 2, NULL, 'Teste técnico agenda 20260825', '', 0, 1, 'escolher', 1, '2026-10-28 08:10:20'),
(2, 1, 2, NULL, 'Teste vínculo turma agenda 20260825', '', 0, 1, 'escolher', 1, '2026-10-28 08:10:20');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tarefa_convite`
--

CREATE TABLE `tarefa_convite` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `grupo_id` char(36) NOT NULL,
  `convidado_id` int(11) NOT NULL,
  `convidante_id` int(11) NOT NULL,
  `status` enum('pendente','aceito','recusado') NOT NULL DEFAULT 'pendente',
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `turma_escolar`
--

CREATE TABLE `turma_escolar` (
  `id` int(11) NOT NULL,
  `instituicao_id` int(11) NOT NULL,
  `nome` varchar(30) NOT NULL,
  `ano_letivo` year(4) NOT NULL,
  `codigo_acesso` varchar(10) NOT NULL,
  `codigo_ativo` tinyint(1) NOT NULL DEFAULT 1,
  `criado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `turma_escolar`
--

INSERT INTO `turma_escolar` (`id`, `instituicao_id`, `nome`, `ano_letivo`, `codigo_acesso`, `codigo_ativo`, `criado_em`) VALUES
(1, 1, '7A', '2026', '7A-4CF7', 1, '2026-08-25 18:40:26'),
(2, 1, '7B', '2026', '7B-9K3M', 1, '2026-08-25 18:57:35'),
(6, 1, '8A', '2026', '8A-4T7Q', 1, '2026-10-28 08:10:20'),
(7, 3, '6A', '2026', '6A-77B3', 1, '2026-10-28 08:10:20'),
(8, 3, '6B', '2026', '6B-91FZ', 1, '2026-10-28 08:10:20');

-- --------------------------------------------------------

--
-- Estrutura da tabela `turma_professor`
--

CREATE TABLE `turma_professor` (
  `turma_id` int(11) NOT NULL,
  `professor_id` int(11) NOT NULL,
  `designado_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `turma_professor`
--

INSERT INTO `turma_professor` (`turma_id`, `professor_id`, `designado_em`) VALUES
(1, 2, '2026-08-25 18:40:26'),
(2, 2, '2026-08-25 18:57:37');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
--

CREATE TABLE `usuario` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `turma` varchar(20) DEFAULT NULL,
  `turma_id` int(11) DEFAULT NULL,
  `pontos_totais` int(11) DEFAULT 0,
  `nivel` int(11) NOT NULL DEFAULT 1,
  `xp` int(11) NOT NULL DEFAULT 0,
  `xp_proximo_nivel` int(11) NOT NULL DEFAULT 100,
  `streak_dias` int(11) NOT NULL DEFAULT 0,
  `ultima_atividade_em` date DEFAULT NULL,
  `notificacoes_ativas` tinyint(1) NOT NULL DEFAULT 1,
  `tema_escuro` tinyint(1) NOT NULL DEFAULT 0,
  `perfil_id` int(11) NOT NULL,
  `instituicao_id` int(11) DEFAULT NULL,
  `data_criacao` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`id`, `nome`, `username`, `email`, `senha`, `cpf`, `telefone`, `avatar`, `turma`, `turma_id`, `pontos_totais`, `nivel`, `xp`, `xp_proximo_nivel`, `streak_dias`, `ultima_atividade_em`, `notificacoes_ativas`, `tema_escuro`, `perfil_id`, `instituicao_id`, `data_criacao`) VALUES
(1, 'Ana Clara Ferreira', 'ana.clara', 'ana@escola.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, '7A', 1, 1250, 7, 1250, 1500, 12, NULL, 1, 0, 1, 1, '2026-08-25 17:59:57'),
(2, 'Professor Viridis', 'prof.viridis', 'professor@escola.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, 100, 0, NULL, 1, 0, 2, 1, '2026-08-25 17:59:57'),
(3, 'Rafael Nogueira', 'teste', 'teste@email.com', '$2y$10$DyEmpSvFWmPX6EQO.Za/c.TJzEYQcWOkfaViTRLfSacC5ZUPVtJDG', NULL, '', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYIFpkwgnWmQP6CuNinEP0T7fzFT6HEq819-f8jasWMtrqcDk5Zt72SL3f&s=10', '7B', 2, 130, 1, 75, 200, 0, '2026-08-25', 1, 0, 1, 1, '2026-08-25 18:23:05'),
(4, 'Administrador Viridis', 'admin.viridis', 'admin@escola.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, 100, 0, NULL, 1, 0, 3, 1, '2026-08-25 18:24:36'),
(5, 'Diretora Viridis', 'diretor.viridis', 'diretor@escola.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, 100, 0, NULL, 1, 0, 4, 1, '2026-08-25 18:40:26'),
(9, 'Bruno Alves Costa', 'bruno.alves', 'bruno.alves@escola.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, '7A', 1, 900, 6, 900, 1100, 5, '2026-09-02', 1, 0, 1, 1, '2026-10-28 08:10:20'),
(10, 'Carla Souza Lima', 'carla.souza', 'carla.souza@escola.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, '7A', 1, 700, 5, 700, 900, 3, '2026-09-01', 1, 0, 1, 1, '2026-10-28 08:10:20'),
(11, 'Diego Martins', 'diego.martins', 'diego.martins@escola.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, '7B', 2, 450, 3, 450, 600, 2, '2026-08-30', 1, 0, 1, 1, '2026-10-28 08:10:20'),
(12, 'Felipe Rocha', 'felipe.rocha', 'felipe.rocha@escola.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, '8A', 6, 1100, 7, 1100, 1300, 9, '2026-09-03', 1, 0, 1, 1, '2026-10-28 08:10:20'),
(13, 'Giovanna Ramos', 'giovanna.ramos', 'giovanna.ramos@escola.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, '8A', 6, 950, 6, 950, 1150, 6, '2026-09-02', 1, 0, 1, 1, '2026-10-28 08:10:20'),
(14, 'Isabela Nunes', 'isabela.nunes', 'isabela.nunes@colegio.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, '6A', 7, 800, 5, 800, 1000, 4, '2026-09-01', 1, 0, 1, 3, '2026-10-28 08:10:20'),
(15, 'João Pedro Farias', 'joao.farias', 'joao.farias@colegio.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, '6A', 7, 600, 4, 600, 800, 2, '2026-08-29', 1, 0, 1, 3, '2026-10-28 08:10:20'),
(16, 'Karina Duarte', 'karina.duarte', 'karina.duarte@colegio.edu.br', '$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii', NULL, NULL, NULL, '6B', 8, 1000, 6, 1000, 1200, 7, '2026-09-03', 1, 0, 1, 3, '2026-10-28 08:10:20');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario_conquista`
--

CREATE TABLE `usuario_conquista` (
  `usuario_id` int(11) NOT NULL,
  `conquista_id` int(11) NOT NULL,
  `conquistada_em` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `usuario_conquista`
--

INSERT INTO `usuario_conquista` (`usuario_id`, `conquista_id`, `conquistada_em`) VALUES
(3, 1, '2026-08-25 18:26:28');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario_licao_progresso`
--

CREATE TABLE `usuario_licao_progresso` (
  `usuario_id` int(11) NOT NULL,
  `licao_id` int(11) NOT NULL,
  `status` enum('completed','current','available','locked') NOT NULL DEFAULT 'locked',
  `concluida_em` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `usuario_licao_progresso`
--

INSERT INTO `usuario_licao_progresso` (`usuario_id`, `licao_id`, `status`, `concluida_em`) VALUES
(3, 1, 'completed', '2026-08-25 18:26:28'),
(3, 2, 'completed', '2026-08-25 18:26:35'),
(3, 3, 'current', NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `agenda`
--
ALTER TABLE `agenda`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_agenda_aluno_data` (`aluno_id`,`data_hora`),
  ADD KEY `idx_agenda_professor_data` (`professor_id`,`data_hora`),
  ADD KEY `fk_agenda_turma` (`turma_id`),
  ADD KEY `fk_agenda_missao` (`missao_id`),
  ADD KEY `idx_agenda_task_id` (`task_id`),
  ADD KEY `idx_agenda_missao_publicada` (`missao_publicada_id`,`aluno_id`,`status`);

--
-- Índices para tabela `certificado`
--
ALTER TABLE `certificado`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_verificacao` (`codigo_verificacao`),
  ADD KEY `aluno_id` (`aluno_id`);

--
-- Índices para tabela `conquista`
--
ALTER TABLE `conquista`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_conquista_regra` (`regra`);

--
-- Índices para tabela `convite_professor`
--
ALTER TABLE `convite_professor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_convite_token` (`token`),
  ADD KEY `idx_convite_instituicao_email` (`instituicao_id`,`email`),
  ADD KEY `fk_convite_diretor` (`criado_por`),
  ADD KEY `fk_convite_usuario` (`usuario_criado_id`);

--
-- Índices para tabela `cronograma_aluno`
--
ALTER TABLE `cronograma_aluno`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aluno_id` (`aluno_id`),
  ADD KEY `missao_id` (`missao_id`);

--
-- Índices para tabela `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_curso_publico` (`escopo`,`instituicao_id`,`turma_id`,`publicado`,`ativo`),
  ADD KEY `fk_curso_instituicao` (`instituicao_id`),
  ADD KEY `fk_curso_turma` (`turma_id`),
  ADD KEY `fk_curso_criador` (`criador_id`);

--
-- Índices para tabela `horta`
--
ALTER TABLE `horta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `instituicao_id` (`instituicao_id`);

--
-- Índices para tabela `inspecao_horta`
--
ALTER TABLE `inspecao_horta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `horta_id` (`horta_id`),
  ADD KEY `responsavel_id` (`responsavel_id`);

--
-- Índices para tabela `instituicao`
--
ALTER TABLE `instituicao`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cnpj` (`cnpj`);

--
-- Índices para tabela `licao`
--
ALTER TABLE `licao`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_licao_modulo_ordem` (`modulo_id`,`ordem`);

--
-- Índices para tabela `missao`
--
ALTER TABLE `missao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `criador_id` (`criador_id`);

--
-- Índices para tabela `missao_convite`
--
ALTER TABLE `missao_convite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_missao_convite` (`missao_publicada_id`,`grupo_id`,`convidado_id`),
  ADD KEY `idx_missao_convite_usuario` (`convidado_id`,`status`),
  ADD KEY `fk_missao_convite_convidante` (`convidante_id`);

--
-- Índices para tabela `missao_pontuacao`
--
ALTER TABLE `missao_pontuacao`
  ADD PRIMARY KEY (`missao_publicada_id`,`grupo_id`,`aluno_id`),
  ADD KEY `idx_missao_pontuacao_aluno` (`aluno_id`,`criado_em`);

--
-- Índices para tabela `missao_publicada`
--
ALTER TABLE `missao_publicada`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_missao_publicada_turma` (`turma_id`,`ativa`,`criado_em`),
  ADD KEY `idx_missao_publicada_criador` (`criador_id`,`criado_em`),
  ADD KEY `fk_missao_publicada_catalogo` (`missao_id`);

--
-- Índices para tabela `modulo`
--
ALTER TABLE `modulo`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_modulo_curso_ordem` (`curso_id`,`ordem`),
  ADD KEY `idx_modulo_curso` (`curso_id`);

--
-- Índices para tabela `notificacao`
--
ALTER TABLE `notificacao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_notificacao_usuario_lida` (`usuario_id`,`lida`,`criada_em`);

--
-- Índices para tabela `opcao_quiz`
--
ALTER TABLE `opcao_quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pergunta_id` (`pergunta_id`);

--
-- Índices para tabela `parceiro`
--
ALTER TABLE `parceiro`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_parceiro_email` (`email`);

--
-- Índices para tabela `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `pergunta_quiz`
--
ALTER TABLE `pergunta_quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `criador_id` (`criador_id`),
  ADD KEY `idx_pergunta_licao` (`licao_id`);

--
-- Índices para tabela `progresso_quiz`
--
ALTER TABLE `progresso_quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aluno_id` (`aluno_id`),
  ADD KEY `pergunta_id` (`pergunta_id`);

--
-- Índices para tabela `recompensa`
--
ALTER TABLE `recompensa`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_recompensa_parceiro` (`parceiro_id`),
  ADD KEY `idx_recompensa_escopo` (`escopo`),
  ADD KEY `idx_recompensa_instituicao` (`instituicao_id`);

--
-- Índices para tabela `resgate`
--
ALTER TABLE `resgate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_resgate_usuario` (`usuario_id`),
  ADD KEY `idx_resgate_recompensa` (`recompensa_id`);

--
-- Índices para tabela `schema_migration`
--
ALTER TABLE `schema_migration`
  ADD PRIMARY KEY (`nome`);

--
-- Índices para tabela `submissao_missao`
--
ALTER TABLE `submissao_missao`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aluno_id` (`aluno_id`),
  ADD KEY `missao_id` (`missao_id`),
  ADD KEY `idx_submissao_status` (`status`),
  ADD KEY `idx_submissao_revisor` (`revisado_por`),
  ADD KEY `idx_submissao_missao_publicada` (`missao_publicada_id`,`aluno_id`,`status`),
  ADD KEY `idx_submissao_missao_publicada_grupo` (`missao_publicada_id`,`grupo_id`,`status`);

--
-- Índices para tabela `tarefa_aberta`
--
ALTER TABLE `tarefa_aberta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tarefa_aberta_turma` (`turma_id`,`ativa`,`criado_em`),
  ADD KEY `criador_id` (`criador_id`),
  ADD KEY `missao_id` (`missao_id`);

--
-- Índices para tabela `tarefa_convite`
--
ALTER TABLE `tarefa_convite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tarefa_convite` (`task_id`,`grupo_id`,`convidado_id`),
  ADD KEY `idx_tarefa_convite_usuario` (`convidado_id`,`status`),
  ADD KEY `convidante_id` (`convidante_id`);

--
-- Índices para tabela `turma_escolar`
--
ALTER TABLE `turma_escolar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_turma_instituicao_nome_ano` (`instituicao_id`,`nome`,`ano_letivo`),
  ADD UNIQUE KEY `uq_turma_codigo_acesso` (`codigo_acesso`);

--
-- Índices para tabela `turma_professor`
--
ALTER TABLE `turma_professor`
  ADD PRIMARY KEY (`turma_id`,`professor_id`),
  ADD KEY `fk_tp_professor` (`professor_id`);

--
-- Índices para tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `cpf` (`cpf`),
  ADD UNIQUE KEY `uq_usuario_username` (`username`),
  ADD KEY `perfil_id` (`perfil_id`),
  ADD KEY `instituicao_id` (`instituicao_id`),
  ADD KEY `idx_usuario_pontos` (`pontos_totais`),
  ADD KEY `idx_usuario_turma` (`turma`),
  ADD KEY `idx_usuario_turma_id` (`turma_id`);

--
-- Índices para tabela `usuario_conquista`
--
ALTER TABLE `usuario_conquista`
  ADD PRIMARY KEY (`usuario_id`,`conquista_id`),
  ADD KEY `fk_uc_conquista` (`conquista_id`);

--
-- Índices para tabela `usuario_licao_progresso`
--
ALTER TABLE `usuario_licao_progresso`
  ADD PRIMARY KEY (`usuario_id`,`licao_id`),
  ADD KEY `idx_ulp_usuario` (`usuario_id`),
  ADD KEY `fk_ulp_licao` (`licao_id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `agenda`
--
ALTER TABLE `agenda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `certificado`
--
ALTER TABLE `certificado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `conquista`
--
ALTER TABLE `conquista`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `convite_professor`
--
ALTER TABLE `convite_professor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `cronograma_aluno`
--
ALTER TABLE `cronograma_aluno`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `curso`
--
ALTER TABLE `curso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `horta`
--
ALTER TABLE `horta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `inspecao_horta`
--
ALTER TABLE `inspecao_horta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `instituicao`
--
ALTER TABLE `instituicao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `licao`
--
ALTER TABLE `licao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `missao`
--
ALTER TABLE `missao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `missao_convite`
--
ALTER TABLE `missao_convite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `missao_publicada`
--
ALTER TABLE `missao_publicada`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `modulo`
--
ALTER TABLE `modulo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `notificacao`
--
ALTER TABLE `notificacao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `opcao_quiz`
--
ALTER TABLE `opcao_quiz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `parceiro`
--
ALTER TABLE `parceiro`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `perfil`
--
ALTER TABLE `perfil`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `pergunta_quiz`
--
ALTER TABLE `pergunta_quiz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `progresso_quiz`
--
ALTER TABLE `progresso_quiz`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `recompensa`
--
ALTER TABLE `recompensa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de tabela `resgate`
--
ALTER TABLE `resgate`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `submissao_missao`
--
ALTER TABLE `submissao_missao`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `tarefa_aberta`
--
ALTER TABLE `tarefa_aberta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `tarefa_convite`
--
ALTER TABLE `tarefa_convite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `turma_escolar`
--
ALTER TABLE `turma_escolar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `agenda`
--
ALTER TABLE `agenda`
  ADD CONSTRAINT `fk_agenda_aluno` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_agenda_missao` FOREIGN KEY (`missao_id`) REFERENCES `missao` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_agenda_missao_publicada` FOREIGN KEY (`missao_publicada_id`) REFERENCES `missao_publicada` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_agenda_professor` FOREIGN KEY (`professor_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_agenda_tarefa_aberta` FOREIGN KEY (`task_id`) REFERENCES `tarefa_aberta` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_agenda_turma` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`) ON DELETE SET NULL;

--
-- Limitadores para a tabela `certificado`
--
ALTER TABLE `certificado`
  ADD CONSTRAINT `certificado_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`);

--
-- Limitadores para a tabela `convite_professor`
--
ALTER TABLE `convite_professor`
  ADD CONSTRAINT `fk_convite_diretor` FOREIGN KEY (`criado_por`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `fk_convite_instituicao` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`),
  ADD CONSTRAINT `fk_convite_usuario` FOREIGN KEY (`usuario_criado_id`) REFERENCES `usuario` (`id`);

--
-- Limitadores para a tabela `cronograma_aluno`
--
ALTER TABLE `cronograma_aluno`
  ADD CONSTRAINT `cronograma_aluno_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `cronograma_aluno_ibfk_2` FOREIGN KEY (`missao_id`) REFERENCES `missao` (`id`);

--
-- Limitadores para a tabela `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `fk_curso_criador` FOREIGN KEY (`criador_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `fk_curso_instituicao` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`),
  ADD CONSTRAINT `fk_curso_turma` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`);

--
-- Limitadores para a tabela `horta`
--
ALTER TABLE `horta`
  ADD CONSTRAINT `horta_ibfk_1` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`);

--
-- Limitadores para a tabela `inspecao_horta`
--
ALTER TABLE `inspecao_horta`
  ADD CONSTRAINT `inspecao_horta_ibfk_1` FOREIGN KEY (`horta_id`) REFERENCES `horta` (`id`),
  ADD CONSTRAINT `inspecao_horta_ibfk_2` FOREIGN KEY (`responsavel_id`) REFERENCES `usuario` (`id`);

--
-- Limitadores para a tabela `licao`
--
ALTER TABLE `licao`
  ADD CONSTRAINT `fk_licao_modulo` FOREIGN KEY (`modulo_id`) REFERENCES `modulo` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `missao`
--
ALTER TABLE `missao`
  ADD CONSTRAINT `missao_ibfk_1` FOREIGN KEY (`criador_id`) REFERENCES `usuario` (`id`);

--
-- Limitadores para a tabela `missao_convite`
--
ALTER TABLE `missao_convite`
  ADD CONSTRAINT `fk_missao_convite_convidado` FOREIGN KEY (`convidado_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_missao_convite_convidante` FOREIGN KEY (`convidante_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_missao_convite_publicada` FOREIGN KEY (`missao_publicada_id`) REFERENCES `missao_publicada` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `missao_pontuacao`
--
ALTER TABLE `missao_pontuacao`
  ADD CONSTRAINT `fk_missao_pontuacao_aluno` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_missao_pontuacao_publicada` FOREIGN KEY (`missao_publicada_id`) REFERENCES `missao_publicada` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `missao_publicada`
--
ALTER TABLE `missao_publicada`
  ADD CONSTRAINT `fk_missao_publicada_catalogo` FOREIGN KEY (`missao_id`) REFERENCES `missao` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_missao_publicada_criador` FOREIGN KEY (`criador_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `fk_missao_publicada_turma` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`);

--
-- Limitadores para a tabela `modulo`
--
ALTER TABLE `modulo`
  ADD CONSTRAINT `fk_modulo_curso` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`);

--
-- Limitadores para a tabela `notificacao`
--
ALTER TABLE `notificacao`
  ADD CONSTRAINT `fk_notificacao_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `opcao_quiz`
--
ALTER TABLE `opcao_quiz`
  ADD CONSTRAINT `opcao_quiz_ibfk_1` FOREIGN KEY (`pergunta_id`) REFERENCES `pergunta_quiz` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `pergunta_quiz`
--
ALTER TABLE `pergunta_quiz`
  ADD CONSTRAINT `fk_pergunta_licao` FOREIGN KEY (`licao_id`) REFERENCES `licao` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pergunta_quiz_ibfk_1` FOREIGN KEY (`criador_id`) REFERENCES `usuario` (`id`);

--
-- Limitadores para a tabela `progresso_quiz`
--
ALTER TABLE `progresso_quiz`
  ADD CONSTRAINT `progresso_quiz_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `progresso_quiz_ibfk_2` FOREIGN KEY (`pergunta_id`) REFERENCES `pergunta_quiz` (`id`);

--
-- Limitadores para a tabela `recompensa`
--
ALTER TABLE `recompensa`
  ADD CONSTRAINT `fk_recompensa_instituicao` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`),
  ADD CONSTRAINT `fk_recompensa_parceiro` FOREIGN KEY (`parceiro_id`) REFERENCES `parceiro` (`id`) ON DELETE SET NULL;

--
-- Limitadores para a tabela `resgate`
--
ALTER TABLE `resgate`
  ADD CONSTRAINT `fk_resgate_recompensa` FOREIGN KEY (`recompensa_id`) REFERENCES `recompensa` (`id`),
  ADD CONSTRAINT `fk_resgate_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Limitadores para a tabela `submissao_missao`
--
ALTER TABLE `submissao_missao`
  ADD CONSTRAINT `fk_submissao_missao_publicada` FOREIGN KEY (`missao_publicada_id`) REFERENCES `missao_publicada` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_submissao_revisor` FOREIGN KEY (`revisado_por`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `submissao_missao_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `submissao_missao_ibfk_2` FOREIGN KEY (`missao_id`) REFERENCES `missao` (`id`);

--
-- Limitadores para a tabela `tarefa_aberta`
--
ALTER TABLE `tarefa_aberta`
  ADD CONSTRAINT `tarefa_aberta_ibfk_1` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`),
  ADD CONSTRAINT `tarefa_aberta_ibfk_2` FOREIGN KEY (`criador_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `tarefa_aberta_ibfk_3` FOREIGN KEY (`missao_id`) REFERENCES `missao` (`id`);

--
-- Limitadores para a tabela `tarefa_convite`
--
ALTER TABLE `tarefa_convite`
  ADD CONSTRAINT `tarefa_convite_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tarefa_aberta` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarefa_convite_ibfk_2` FOREIGN KEY (`convidado_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tarefa_convite_ibfk_3` FOREIGN KEY (`convidante_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `turma_escolar`
--
ALTER TABLE `turma_escolar`
  ADD CONSTRAINT `fk_turma_instituicao` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`);

--
-- Limitadores para a tabela `turma_professor`
--
ALTER TABLE `turma_professor`
  ADD CONSTRAINT `fk_tp_professor` FOREIGN KEY (`professor_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_tp_turma` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_turma` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`perfil_id`) REFERENCES `perfil` (`id`),
  ADD CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`);

--
-- Limitadores para a tabela `usuario_conquista`
--
ALTER TABLE `usuario_conquista`
  ADD CONSTRAINT `fk_uc_conquista` FOREIGN KEY (`conquista_id`) REFERENCES `conquista` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_uc_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `usuario_licao_progresso`
--
ALTER TABLE `usuario_licao_progresso`
  ADD CONSTRAINT `fk_ulp_licao` FOREIGN KEY (`licao_id`) REFERENCES `licao` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ulp_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
