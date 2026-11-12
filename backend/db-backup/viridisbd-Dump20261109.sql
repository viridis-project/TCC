-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: viridisbd
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agenda`
--

DROP TABLE IF EXISTS `agenda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agenda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` int NOT NULL,
  `professor_id` int NOT NULL,
  `turma_id` int DEFAULT NULL,
  `missao_id` int DEFAULT NULL,
  `titulo` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `data_hora` datetime NOT NULL,
  `status` enum('agendado','concluido','cancelado') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'agendado',
  `criado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `grupo_id` char(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_agenda_aluno_data` (`aluno_id`,`data_hora`),
  KEY `idx_agenda_professor_data` (`professor_id`,`data_hora`),
  KEY `fk_agenda_turma` (`turma_id`),
  KEY `fk_agenda_missao` (`missao_id`),
  KEY `idx_agenda_missao_grupo` (`missao_id`,`grupo_id`,`status`),
  CONSTRAINT `fk_agenda_aluno` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_agenda_missao` FOREIGN KEY (`missao_id`) REFERENCES `missao` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_agenda_professor` FOREIGN KEY (`professor_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_agenda_turma` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agenda`
--

LOCK TABLES `agenda` WRITE;
/*!40000 ALTER TABLE `agenda` DISABLE KEYS */;
INSERT INTO `agenda` VALUES (1,1,2,1,5,'Teste técnico agenda 20260825','2026-08-26 09:30:00','concluido','2026-08-25 18:50:59','d2e027a1dca611f1b2a7641c67b623d3'),(2,1,2,1,6,'Teste vínculo turma agenda 20260825','2026-08-27 10:15:00','agendado','2026-08-25 19:14:11','d2e02e5fdca611f1b2a7641c67b623d3');
/*!40000 ALTER TABLE `agenda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `certificado`
--

DROP TABLE IF EXISTS `certificado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `certificado` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` int NOT NULL,
  `codigo_verificacao` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `url_pdf` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `data_emissao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_verificacao` (`codigo_verificacao`),
  KEY `aluno_id` (`aluno_id`),
  CONSTRAINT `certificado_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `certificado`
--

LOCK TABLES `certificado` WRITE;
/*!40000 ALTER TABLE `certificado` DISABLE KEYS */;
/*!40000 ALTER TABLE `certificado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conquista`
--

DROP TABLE IF EXISTS `conquista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conquista` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `icone` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `regra` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_conquista_regra` (`regra`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conquista`
--

LOCK TABLES `conquista` WRITE;
/*!40000 ALTER TABLE `conquista` DISABLE KEYS */;
INSERT INTO `conquista` VALUES (1,'Primeira Semente','Concluiu sua primeira lição','Sprout','licoes:1'),(2,'Compostador','Completou o módulo de nutrição','Recycle','modulo_completo:2'),(3,'Sequência de 7 dias','Estudou 7 dias seguidos','Flame','streak:7'),(4,'Conhecedor de Pragas','Terminou o módulo 3','Bug','modulo_completo:3'),(5,'Mestre Jardineiro','Concluiu todos os módulos','Trophy','todos_modulos'),(6,'Top 3 Ranking','Entrou nos 3 primeiros','Medal','ranking:3');
/*!40000 ALTER TABLE `conquista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convite_professor`
--

DROP TABLE IF EXISTS `convite_professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `convite_professor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `instituicao_id` int NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `criado_por` int NOT NULL,
  `expira_em` datetime NOT NULL,
  `usado_em` datetime DEFAULT NULL,
  `usuario_criado_id` int DEFAULT NULL,
  `criado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_convite_token` (`token`),
  KEY `idx_convite_instituicao_email` (`instituicao_id`,`email`),
  KEY `fk_convite_diretor` (`criado_por`),
  KEY `fk_convite_usuario` (`usuario_criado_id`),
  CONSTRAINT `fk_convite_diretor` FOREIGN KEY (`criado_por`) REFERENCES `usuario` (`id`),
  CONSTRAINT `fk_convite_instituicao` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`),
  CONSTRAINT `fk_convite_usuario` FOREIGN KEY (`usuario_criado_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convite_professor`
--

LOCK TABLES `convite_professor` WRITE;
/*!40000 ALTER TABLE `convite_professor` DISABLE KEYS */;
/*!40000 ALTER TABLE `convite_professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cronograma_aluno`
--

DROP TABLE IF EXISTS `cronograma_aluno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cronograma_aluno` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` int NOT NULL,
  `missao_id` int NOT NULL,
  `data_sugerida` datetime DEFAULT NULL,
  `data_limite_personalizada` datetime DEFAULT NULL,
  `status_atividade` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'Pendente',
  PRIMARY KEY (`id`),
  KEY `aluno_id` (`aluno_id`),
  KEY `missao_id` (`missao_id`),
  CONSTRAINT `cronograma_aluno_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `cronograma_aluno_ibfk_2` FOREIGN KEY (`missao_id`) REFERENCES `missao` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cronograma_aluno`
--

LOCK TABLES `cronograma_aluno` WRITE;
/*!40000 ALTER TABLE `cronograma_aluno` DISABLE KEYS */;
INSERT INTO `cronograma_aluno` VALUES (1,3,1,'2026-08-11 18:29:00',NULL,'Concluída');
/*!40000 ALTER TABLE `cronograma_aluno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curso`
--

DROP TABLE IF EXISTS `curso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descricao` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `escopo` enum('app','escola','turma') COLLATE utf8mb4_general_ci NOT NULL,
  `instituicao_id` int DEFAULT NULL,
  `turma_id` int DEFAULT NULL,
  `criador_id` int DEFAULT NULL,
  `publicado` tinyint(1) NOT NULL DEFAULT '0',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `legado` tinyint(1) NOT NULL DEFAULT '0',
  `criado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_curso_publico` (`escopo`,`instituicao_id`,`turma_id`,`publicado`,`ativo`),
  KEY `fk_curso_instituicao` (`instituicao_id`),
  KEY `fk_curso_turma` (`turma_id`),
  KEY `fk_curso_criador` (`criador_id`),
  CONSTRAINT `fk_curso_criador` FOREIGN KEY (`criador_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `fk_curso_instituicao` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`),
  CONSTRAINT `fk_curso_turma` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curso`
--

LOCK TABLES `curso` WRITE;
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
INSERT INTO `curso` VALUES (1,'Trilha de sustentabilidade','Conteúdo original do Viridis.','app',NULL,NULL,NULL,1,1,1,'2026-08-25 17:59:57');
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horta`
--

DROP TABLE IF EXISTS `horta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `instituicao_id` int NOT NULL,
  `localizacao` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `instituicao_id` (`instituicao_id`),
  CONSTRAINT `horta_ibfk_1` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horta`
--

LOCK TABLES `horta` WRITE;
/*!40000 ALTER TABLE `horta` DISABLE KEYS */;
/*!40000 ALTER TABLE `horta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspecao_horta`
--

DROP TABLE IF EXISTS `inspecao_horta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inspecao_horta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `horta_id` int NOT NULL,
  `responsavel_id` int NOT NULL,
  `qtd_plantas` int DEFAULT NULL,
  `observacoes` text COLLATE utf8mb4_general_ci,
  `data_inspecao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `horta_id` (`horta_id`),
  KEY `responsavel_id` (`responsavel_id`),
  CONSTRAINT `inspecao_horta_ibfk_1` FOREIGN KEY (`horta_id`) REFERENCES `horta` (`id`),
  CONSTRAINT `inspecao_horta_ibfk_2` FOREIGN KEY (`responsavel_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspecao_horta`
--

LOCK TABLES `inspecao_horta` WRITE;
/*!40000 ALTER TABLE `inspecao_horta` DISABLE KEYS */;
/*!40000 ALTER TABLE `inspecao_horta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instituicao`
--

DROP TABLE IF EXISTS `instituicao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instituicao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `cnpj` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `data_cadastro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instituicao`
--

LOCK TABLES `instituicao` WRITE;
/*!40000 ALTER TABLE `instituicao` DISABLE KEYS */;
INSERT INTO `instituicao` VALUES (1,'Escola Viridis',NULL,'2026-08-25 17:59:57'),(3,'Colégio Semente Verde',NULL,'2026-11-09 22:34:07');
/*!40000 ALTER TABLE `instituicao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `licao`
--

DROP TABLE IF EXISTS `licao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `licao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `modulo_id` int NOT NULL,
  `titulo` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `kind` enum('lesson','challenge','exam','certificate','trophy') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'lesson',
  `xp` int NOT NULL DEFAULT '0',
  `ordem` int NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_licao_modulo_ordem` (`modulo_id`,`ordem`),
  CONSTRAINT `fk_licao_modulo` FOREIGN KEY (`modulo_id`) REFERENCES `modulo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `licao`
--

LOCK TABLES `licao` WRITE;
/*!40000 ALTER TABLE `licao` DISABLE KEYS */;
INSERT INTO `licao` VALUES (1,1,'Sementes e germinação','lesson',50,1,1),(2,1,'Tipos de solo','lesson',50,2,1),(3,1,'Desafio: Primeira muda','challenge',100,3,1),(4,1,'Avaliação do módulo','exam',150,4,1),(5,2,'Macronutrientes','lesson',50,1,1),(6,2,'Composto orgânico','lesson',50,2,1),(7,2,'Desafio: Composteira','challenge',100,3,1),(8,3,'Insetos benéficos','lesson',50,1,1),(9,3,'Repelentes naturais','lesson',60,2,1),(10,3,'Desafio: Calda caseira','challenge',100,3,1),(11,3,'Avaliação','exam',150,4,1),(12,4,'Grupos alimentares','lesson',50,1,1),(13,4,'Receitas da horta','lesson',50,2,1),(14,5,'Minhocário','lesson',80,1,1),(15,6,'Certificado Viridis','certificate',500,1,1);
/*!40000 ALTER TABLE `licao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `missao`
--

DROP TABLE IF EXISTS `missao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `missao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `descricao` text COLLATE utf8mb4_general_ci,
  `tipo` enum('plant','water','compost','share','outro') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'outro',
  `pontos_recompensa` int NOT NULL DEFAULT '10',
  `criador_id` int NOT NULL,
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  `turma_id` int DEFAULT NULL,
  `imagem` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `max_alunos` int NOT NULL DEFAULT '1',
  `modo_participacao` enum('escolher','aberto','particular') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'escolher',
  `ativa` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `criador_id` (`criador_id`),
  KEY `idx_missao_turma` (`turma_id`,`ativa`,`data_criacao`),
  CONSTRAINT `fk_missao_turma` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`),
  CONSTRAINT `missao_ibfk_1` FOREIGN KEY (`criador_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missao`
--

LOCK TABLES `missao` WRITE;
/*!40000 ALTER TABLE `missao` DISABLE KEYS */;
INSERT INTO `missao` VALUES (1,'Plantio','Registre o plantio de uma muda ou semente.','plant',50,2,'2026-08-25 17:59:57',NULL,NULL,1,'escolher',0),(2,'Rega consciente','Registre uma rega feita sem desperdício.','water',20,2,'2026-08-25 17:59:57',NULL,NULL,1,'escolher',0),(3,'Compostagem','Transforme resíduos orgânicos em composto.','compost',75,2,'2026-08-25 17:59:57',NULL,NULL,1,'escolher',0),(4,'Compartilhar','Compartilhe uma prática sustentável.','share',25,2,'2026-08-25 17:59:57',NULL,NULL,1,'escolher',0),(5,'Teste técnico agenda 20260825','','outro',0,2,'2026-11-09 22:34:07',1,NULL,1,'escolher',1),(6,'Teste vínculo turma agenda 20260825','','outro',0,2,'2026-11-09 22:34:07',1,NULL,1,'escolher',1);
/*!40000 ALTER TABLE `missao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `missao_convite`
--

DROP TABLE IF EXISTS `missao_convite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `missao_convite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `missao_id` int NOT NULL,
  `grupo_id` char(32) COLLATE utf8mb4_general_ci NOT NULL,
  `convidado_id` int NOT NULL,
  `convidante_id` int NOT NULL,
  `status` enum('pendente','aceito','recusado') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pendente',
  `criado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_missao_convite` (`missao_id`,`grupo_id`,`convidado_id`),
  KEY `idx_missao_convite_usuario` (`convidado_id`,`status`),
  KEY `convidante_id` (`convidante_id`),
  CONSTRAINT `missao_convite_ibfk_1` FOREIGN KEY (`missao_id`) REFERENCES `missao` (`id`) ON DELETE CASCADE,
  CONSTRAINT `missao_convite_ibfk_2` FOREIGN KEY (`convidado_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `missao_convite_ibfk_3` FOREIGN KEY (`convidante_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missao_convite`
--

LOCK TABLES `missao_convite` WRITE;
/*!40000 ALTER TABLE `missao_convite` DISABLE KEYS */;
/*!40000 ALTER TABLE `missao_convite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulo`
--

DROP TABLE IF EXISTS `modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `curso_id` int DEFAULT NULL,
  `titulo` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `cor` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `ordem` int NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_modulo_curso_ordem` (`curso_id`,`ordem`),
  KEY `idx_modulo_curso` (`curso_id`),
  CONSTRAINT `fk_modulo_curso` FOREIGN KEY (`curso_id`) REFERENCES `curso` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulo`
--

LOCK TABLES `modulo` WRITE;
/*!40000 ALTER TABLE `modulo` DISABLE KEYS */;
INSERT INTO `modulo` VALUES (1,1,'Plantio Básico','Fundamentos do cultivo e preparação do solo','oklch(0.62 0.18 150)',1,1),(2,1,'Nutrição do Solo','Compostagem, adubos e ciclo de nutrientes','oklch(0.62 0.18 150)',2,1),(3,1,'Controle de Pragas','Manejo natural e prevenção integrada','oklch(0.65 0.17 95)',3,1),(4,1,'Alimentação Saudável','Da horta ao prato: nutrição consciente','oklch(0.62 0.16 240)',4,1),(5,1,'Compostagem Avançada','Vermicompostagem e bioinsumos','oklch(0.70 0.18 50)',5,1),(6,1,'Certificado Final','Conclusão da trilha de sustentabilidade','oklch(0.75 0.16 75)',6,1);
/*!40000 ALTER TABLE `modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacao`
--

DROP TABLE IF EXISTS `notificacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `tipo` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `titulo` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `mensagem` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `lida` tinyint(1) NOT NULL DEFAULT '0',
  `link` varchar(120) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `criada_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notificacao_usuario_lida` (`usuario_id`,`lida`,`criada_em`),
  CONSTRAINT `fk_notificacao_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacao`
--

LOCK TABLES `notificacao` WRITE;
/*!40000 ALTER TABLE `notificacao` DISABLE KEYS */;
INSERT INTO `notificacao` VALUES (1,1,'conquista','Bem-vinda à Viridis!','Sua central de notificações já está ativa.',1,'/jardim','2026-08-25 18:40:26'),(2,1,'missao_agendada','Nova tarefa agendada','Teste técnico agenda 20260825 em 26/08/2026 09:30',1,'/horarios','2026-08-25 18:50:59'),(3,2,'designacao_professor','Nova turma designada','Você foi designado para a turma teste',1,'/horarios','2026-08-25 18:57:37'),(4,1,'missao_agendada','Nova tarefa agendada','Teste vínculo turma agenda 20260825 em 27/08/2026 10:15',1,'/horarios','2026-08-25 19:14:11');
/*!40000 ALTER TABLE `notificacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opcao_quiz`
--

DROP TABLE IF EXISTS `opcao_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opcao_quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pergunta_id` int NOT NULL,
  `texto_opcao` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `is_correta` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `pergunta_id` (`pergunta_id`),
  CONSTRAINT `opcao_quiz_ibfk_1` FOREIGN KEY (`pergunta_id`) REFERENCES `pergunta_quiz` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opcao_quiz`
--

LOCK TABLES `opcao_quiz` WRITE;
/*!40000 ALTER TABLE `opcao_quiz` DISABLE KEYS */;
INSERT INTO `opcao_quiz` VALUES (1,1,'Realizar fotossíntese',0),(2,1,'Absorver água e nutrientes do solo',1),(3,1,'Atrair polinizadores',0),(4,1,'Produzir sementes',0);
/*!40000 ALTER TABLE `opcao_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parceiro`
--

DROP TABLE IF EXISTS `parceiro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parceiro` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` enum('Vegetais','Padaria','Educação','Ferramentas','Reciclagem','Outros') COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_parceiro_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parceiro`
--

LOCK TABLES `parceiro` WRITE;
/*!40000 ALTER TABLE `parceiro` DISABLE KEYS */;
INSERT INTO `parceiro` VALUES (1,'Horta da Esquina','Vegetais','contato@hortadaesquina.local',NULL,1),(2,'Pão Quente','Padaria','contato@paoquente.local',NULL,1),(3,'Livraria Verde','Educação','contato@livrariaverde.local',NULL,1),(4,'Jardinagem & Cia','Ferramentas','contato@jardinagemcia.local',NULL,1),(5,'EcoLab','Reciclagem','contato@ecolab.local',NULL,1),(6,'Viveiro Local','Vegetais','contato@viveirolocal.local',NULL,1);
/*!40000 ALTER TABLE `parceiro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil`
--

DROP TABLE IF EXISTS `perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `descricao` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil`
--

LOCK TABLES `perfil` WRITE;
/*!40000 ALTER TABLE `perfil` DISABLE KEYS */;
INSERT INTO `perfil` VALUES (1,'aluno','Estudante'),(2,'professor','Professor responsável'),(3,'admin','Administrador'),(4,'diretor','Diretor da instituição');
/*!40000 ALTER TABLE `perfil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pergunta_quiz`
--

DROP TABLE IF EXISTS `pergunta_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pergunta_quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `criador_id` int NOT NULL,
  `licao_id` int DEFAULT NULL,
  `texto_pergunta` text COLLATE utf8mb4_general_ci NOT NULL,
  `explicacao` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pontos_recompensa` int DEFAULT '5',
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `criador_id` (`criador_id`),
  KEY `idx_pergunta_licao` (`licao_id`),
  CONSTRAINT `fk_pergunta_licao` FOREIGN KEY (`licao_id`) REFERENCES `licao` (`id`) ON DELETE SET NULL,
  CONSTRAINT `pergunta_quiz_ibfk_1` FOREIGN KEY (`criador_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pergunta_quiz`
--

LOCK TABLES `pergunta_quiz` WRITE;
/*!40000 ALTER TABLE `pergunta_quiz` DISABLE KEYS */;
INSERT INTO `pergunta_quiz` VALUES (1,2,1,'Qual é a principal função das raízes de uma planta?','As raízes fixam a planta e absorvem água e minerais essenciais para seu desenvolvimento.',5,1);
/*!40000 ALTER TABLE `pergunta_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progresso_quiz`
--

DROP TABLE IF EXISTS `progresso_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progresso_quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` int NOT NULL,
  `pergunta_id` int NOT NULL,
  `acertou` tinyint(1) NOT NULL,
  `data_resposta` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `aluno_id` (`aluno_id`),
  KEY `pergunta_id` (`pergunta_id`),
  CONSTRAINT `progresso_quiz_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `progresso_quiz_ibfk_2` FOREIGN KEY (`pergunta_id`) REFERENCES `pergunta_quiz` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progresso_quiz`
--

LOCK TABLES `progresso_quiz` WRITE;
/*!40000 ALTER TABLE `progresso_quiz` DISABLE KEYS */;
INSERT INTO `progresso_quiz` VALUES (1,3,1,0,'2026-08-25 18:26:28'),(2,3,1,1,'2026-08-25 18:26:35');
/*!40000 ALTER TABLE `progresso_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recompensa`
--

DROP TABLE IF EXISTS `recompensa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recompensa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `escopo` enum('app','escola') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'app',
  `parceiro_id` int DEFAULT NULL,
  `instituicao_id` int DEFAULT NULL,
  `pontos_necessarios` int NOT NULL,
  `imagem` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_recompensa_parceiro` (`parceiro_id`),
  KEY `idx_recompensa_escopo` (`escopo`),
  KEY `idx_recompensa_instituicao` (`instituicao_id`),
  CONSTRAINT `fk_recompensa_instituicao` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`),
  CONSTRAINT `fk_recompensa_parceiro` FOREIGN KEY (`parceiro_id`) REFERENCES `parceiro` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recompensa`
--

LOCK TABLES `recompensa` WRITE;
/*!40000 ALTER TABLE `recompensa` DISABLE KEYS */;
INSERT INTO `recompensa` VALUES (1,'Cesta de Legumes do Bairro','app',1,NULL,500,'?',1),(2,'Desconto na Padaria Local','app',2,NULL,300,'?',1),(3,'Livro sobre Sustentabilidade','app',3,NULL,800,'?',1),(4,'Kit de Jardinagem','app',4,NULL,1200,'?',1),(5,'Workshop de Compostagem','app',5,NULL,700,'♻️',1),(6,'Muda de Árvore Frutífera','app',6,NULL,400,'?',1),(9,'teste','escola',2,1,100,'?',1);
/*!40000 ALTER TABLE `recompensa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resgate`
--

DROP TABLE IF EXISTS `resgate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resgate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `recompensa_id` int NOT NULL,
  `pontos_debitados` int NOT NULL,
  `criado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_resgate_usuario` (`usuario_id`),
  KEY `idx_resgate_recompensa` (`recompensa_id`),
  CONSTRAINT `fk_resgate_recompensa` FOREIGN KEY (`recompensa_id`) REFERENCES `recompensa` (`id`),
  CONSTRAINT `fk_resgate_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resgate`
--

LOCK TABLES `resgate` WRITE;
/*!40000 ALTER TABLE `resgate` DISABLE KEYS */;
/*!40000 ALTER TABLE `resgate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schema_migration`
--

DROP TABLE IF EXISTS `schema_migration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schema_migration` (
  `nome` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `aplicada_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schema_migration`
--

LOCK TABLES `schema_migration` WRITE;
/*!40000 ALTER TABLE `schema_migration` DISABLE KEYS */;
INSERT INTO `schema_migration` VALUES ('20260909_learning.php','2026-11-09 22:34:06'),('20260909_learning_indexes.php','2026-11-09 22:34:06'),('20260909_optional_reward_partner.php','2026-11-09 22:34:07'),('20260909_seed_ranking_demo.php','2026-11-09 22:34:07'),('20261023_open_tasks.php','2026-11-09 22:34:07'),('20261024_team_task_participation.php','2026-11-09 22:34:07'),('20261025_unify_missions_tasks.php','2026-11-09 22:34:08');
/*!40000 ALTER TABLE `schema_migration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissao_missao`
--

DROP TABLE IF EXISTS `submissao_missao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissao_missao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `aluno_id` int NOT NULL,
  `missao_id` int NOT NULL,
  `descricao` varchar(280) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `url_foto` varchar(500) COLLATE utf8mb4_general_ci NOT NULL,
  `ia_validada` tinyint(1) DEFAULT NULL,
  `professor_validado` tinyint(1) DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `comentario_professor` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `revisado_por` int DEFAULT NULL,
  `revisado_em` datetime DEFAULT NULL,
  `data_envio` datetime DEFAULT CURRENT_TIMESTAMP,
  `grupo_id` char(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `aluno_id` (`aluno_id`),
  KEY `missao_id` (`missao_id`),
  KEY `idx_submissao_status` (`status`),
  KEY `idx_submissao_revisor` (`revisado_por`),
  KEY `idx_submissao_grupo` (`missao_id`,`grupo_id`,`status`),
  CONSTRAINT `fk_submissao_revisor` FOREIGN KEY (`revisado_por`) REFERENCES `usuario` (`id`),
  CONSTRAINT `submissao_missao_ibfk_1` FOREIGN KEY (`aluno_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `submissao_missao_ibfk_2` FOREIGN KEY (`missao_id`) REFERENCES `missao` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissao_missao`
--

LOCK TABLES `submissao_missao` WRITE;
/*!40000 ALTER TABLE `submissao_missao` DISABLE KEYS */;
INSERT INTO `submissao_missao` VALUES (1,3,1,'plantei','/uploads/4246460f2aee61d2b48e2ba5d85278a0.png',NULL,1,'approved','Ótimo trabalho! ?',2,'2026-08-25 18:24:45','2026-08-25 18:23:37',NULL),(2,3,3,'teste','/uploads/b3f9962a576dd869d80f19b8abed0919.png',NULL,1,'approved','Adicione mais detalhes da foto',2,'2026-08-25 18:38:37','2026-08-25 18:38:28',NULL);
/*!40000 ALTER TABLE `submissao_missao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turma_escolar`
--

DROP TABLE IF EXISTS `turma_escolar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turma_escolar` (
  `id` int NOT NULL AUTO_INCREMENT,
  `instituicao_id` int NOT NULL,
  `nome` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `ano_letivo` year NOT NULL,
  `codigo_acesso` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `codigo_ativo` tinyint(1) NOT NULL DEFAULT '1',
  `criado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_turma_instituicao_nome_ano` (`instituicao_id`,`nome`,`ano_letivo`),
  UNIQUE KEY `uq_turma_codigo_acesso` (`codigo_acesso`),
  CONSTRAINT `fk_turma_instituicao` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turma_escolar`
--

LOCK TABLES `turma_escolar` WRITE;
/*!40000 ALTER TABLE `turma_escolar` DISABLE KEYS */;
INSERT INTO `turma_escolar` VALUES (1,1,'7A',2026,'7A-4CF7',1,'2026-08-25 18:40:26'),(2,1,'7B',2026,'7B-9K3M',1,'2026-08-25 18:57:35'),(6,1,'8A',2026,'8A-4T7Q',1,'2026-11-09 22:34:07'),(7,3,'6A',2026,'6A-77B3',1,'2026-11-09 22:34:07'),(8,3,'6B',2026,'6B-91FZ',1,'2026-11-09 22:34:07');
/*!40000 ALTER TABLE `turma_escolar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turma_professor`
--

DROP TABLE IF EXISTS `turma_professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turma_professor` (
  `turma_id` int NOT NULL,
  `professor_id` int NOT NULL,
  `designado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`turma_id`,`professor_id`),
  KEY `fk_tp_professor` (`professor_id`),
  CONSTRAINT `fk_tp_professor` FOREIGN KEY (`professor_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tp_turma` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turma_professor`
--

LOCK TABLES `turma_professor` WRITE;
/*!40000 ALTER TABLE `turma_professor` DISABLE KEYS */;
INSERT INTO `turma_professor` VALUES (1,2,'2026-08-25 18:40:26'),(2,2,'2026-08-25 18:57:37');
/*!40000 ALTER TABLE `turma_professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `senha` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `cpf` varchar(14) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `turma` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `turma_id` int DEFAULT NULL,
  `pontos_totais` int DEFAULT '0',
  `nivel` int NOT NULL DEFAULT '1',
  `xp` int NOT NULL DEFAULT '0',
  `xp_proximo_nivel` int NOT NULL DEFAULT '100',
  `streak_dias` int NOT NULL DEFAULT '0',
  `ultima_atividade_em` date DEFAULT NULL,
  `notificacoes_ativas` tinyint(1) NOT NULL DEFAULT '1',
  `tema_escuro` tinyint(1) NOT NULL DEFAULT '0',
  `perfil_id` int NOT NULL,
  `instituicao_id` int DEFAULT NULL,
  `data_criacao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cpf` (`cpf`),
  UNIQUE KEY `uq_usuario_username` (`username`),
  KEY `perfil_id` (`perfil_id`),
  KEY `instituicao_id` (`instituicao_id`),
  KEY `idx_usuario_pontos` (`pontos_totais`),
  KEY `idx_usuario_turma` (`turma`),
  KEY `idx_usuario_turma_id` (`turma_id`),
  CONSTRAINT `fk_usuario_turma` FOREIGN KEY (`turma_id`) REFERENCES `turma_escolar` (`id`) ON DELETE SET NULL,
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`perfil_id`) REFERENCES `perfil` (`id`),
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`instituicao_id`) REFERENCES `instituicao` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Ana Clara Ferreira','ana.clara','ana@escola.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,'7A',1,1250,7,1250,1500,12,NULL,1,0,1,1,'2026-08-25 17:59:57'),(2,'Professor Viridis','prof.viridis','professor@escola.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,NULL,NULL,0,1,0,100,0,NULL,1,0,2,1,'2026-08-25 17:59:57'),(3,'Rafael Nogueira','teste','teste@email.com','$2y$10$DyEmpSvFWmPX6EQO.Za/c.TJzEYQcWOkfaViTRLfSacC5ZUPVtJDG',NULL,'','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYIFpkwgnWmQP6CuNinEP0T7fzFT6HEq819-f8jasWMtrqcDk5Zt72SL3f&s=10','7B',2,130,1,75,200,0,'2026-08-25',1,0,1,1,'2026-08-25 18:23:05'),(4,'Administrador Viridis','admin.viridis','admin@escola.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,NULL,NULL,0,1,0,100,0,NULL,1,0,3,1,'2026-08-25 18:24:36'),(5,'Diretora Viridis','diretor.viridis','diretor@escola.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,NULL,NULL,0,1,0,100,0,NULL,1,0,4,1,'2026-08-25 18:40:26'),(9,'Bruno Alves Costa','bruno.alves','bruno.alves@escola.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,'7A',1,900,6,900,1100,5,'2026-09-02',1,0,1,1,'2026-11-09 22:34:07'),(10,'Carla Souza Lima','carla.souza','carla.souza@escola.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,'7A',1,700,5,700,900,3,'2026-09-01',1,0,1,1,'2026-11-09 22:34:07'),(11,'Diego Martins','diego.martins','diego.martins@escola.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,'7B',2,450,3,450,600,2,'2026-08-30',1,0,1,1,'2026-11-09 22:34:07'),(12,'Felipe Rocha','felipe.rocha','felipe.rocha@escola.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,'8A',6,1100,7,1100,1300,9,'2026-09-03',1,0,1,1,'2026-11-09 22:34:07'),(13,'Giovanna Ramos','giovanna.ramos','giovanna.ramos@escola.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,'8A',6,950,6,950,1150,6,'2026-09-02',1,0,1,1,'2026-11-09 22:34:07'),(14,'Isabela Nunes','isabela.nunes','isabela.nunes@colegio.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,'6A',7,800,5,800,1000,4,'2026-09-01',1,0,1,3,'2026-11-09 22:34:07'),(15,'João Pedro Farias','joao.farias','joao.farias@colegio.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,'6A',7,600,4,600,800,2,'2026-08-29',1,0,1,3,'2026-11-09 22:34:07'),(16,'Karina Duarte','karina.duarte','karina.duarte@colegio.edu.br','$2y$10$FInAb7Fv1ncs210gAJAInORjXwKn/.chmO7s0gXe80JmlJSgUDOii',NULL,NULL,NULL,'6B',8,1000,6,1000,1200,7,'2026-09-03',1,0,1,3,'2026-11-09 22:34:07');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_conquista`
--

DROP TABLE IF EXISTS `usuario_conquista`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_conquista` (
  `usuario_id` int NOT NULL,
  `conquista_id` int NOT NULL,
  `conquistada_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`,`conquista_id`),
  KEY `fk_uc_conquista` (`conquista_id`),
  CONSTRAINT `fk_uc_conquista` FOREIGN KEY (`conquista_id`) REFERENCES `conquista` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_uc_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_conquista`
--

LOCK TABLES `usuario_conquista` WRITE;
/*!40000 ALTER TABLE `usuario_conquista` DISABLE KEYS */;
INSERT INTO `usuario_conquista` VALUES (3,1,'2026-08-25 18:26:28');
/*!40000 ALTER TABLE `usuario_conquista` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_licao_progresso`
--

DROP TABLE IF EXISTS `usuario_licao_progresso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario_licao_progresso` (
  `usuario_id` int NOT NULL,
  `licao_id` int NOT NULL,
  `status` enum('completed','current','available','locked') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'locked',
  `concluida_em` datetime DEFAULT NULL,
  PRIMARY KEY (`usuario_id`,`licao_id`),
  KEY `idx_ulp_usuario` (`usuario_id`),
  KEY `fk_ulp_licao` (`licao_id`),
  CONSTRAINT `fk_ulp_licao` FOREIGN KEY (`licao_id`) REFERENCES `licao` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ulp_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_licao_progresso`
--

LOCK TABLES `usuario_licao_progresso` WRITE;
/*!40000 ALTER TABLE `usuario_licao_progresso` DISABLE KEYS */;
INSERT INTO `usuario_licao_progresso` VALUES (3,1,'completed','2026-08-25 18:26:28'),(3,2,'completed','2026-08-25 18:26:35'),(3,3,'current',NULL);
/*!40000 ALTER TABLE `usuario_licao_progresso` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-09 22:50:03
