# Viridis 🌱

**Cultivando sustentabilidade por meio da aprendizagem e da prática.**

O Viridis é uma plataforma gamificada para apoiar projetos de hortas escolares. Alunos aprendem sobre sustentabilidade, participam de missões e acompanham seu progresso; professores e gestores organizam as atividades e acompanham os resultados.

> **Acesse a plataforma:** [regisrusiglocks1793188226000.1751247.meusitehostgator.com.br](https://regisrusiglocks1793188226000.1751247.meusitehostgator.com.br)

## O que você encontra

- Trilhas de aprendizagem com lições e quizzes.
- Missões de horta, agendamento e envio de atividades para avaliação.
- Acompanhamento de progresso, histórico, conquistas e ranking.
- Recompensas para alunos e ferramentas de gestão para professores, diretores e administradores.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React 19, TypeScript, TanStack Start/Router/Query, Vite e Tailwind CSS |
| Backend | PHP 8+, API REST, PDO e MySQL |
| Sessões | Sessões PHP com cookies e chamadas autenticadas pelo frontend |

## Estrutura do projeto

- **backend/** — API PHP, migrations, uploads e configuração do banco.
- **design-system/** — referências e documentação visual do Viridis.
- **frontend/** — aplicação web em React e TypeScript.

## Executar localmente

### 1. Preparar o banco e a API

Você precisa de PHP com PDO MySQL, mbstring e fileinfo, além de um servidor MySQL.

1. Crie o banco viridisbd com suporte a utf8mb4.
2. Importe [backend/viridisbd-banco-base.sql](backend/viridisbd-banco-base.sql).
3. No diretório backend, crie seu arquivo de configuração:

       Copy-Item .env.example .env

4. Ajuste as credenciais do banco em backend/.env e aplique as migrations:

       php migrate.php

5. Inicie a API:

       php -S localhost:8081 router.php

### 2. Iniciar o frontend

Em outro terminal:

    cd frontend
    Copy-Item .env.example .env
    npm install
    npm run dev

O frontend inicia em http://localhost:8080 e usa http://localhost:8081/api como API local. Se necessário, altere VITE_API_URL em frontend/.env.

## Scripts do frontend

| Comando | Ação |
| --- | --- |
| npm run dev | Inicia o servidor de desenvolvimento |
| npm run build | Gera a versão de produção |
| npm run preview | Pré-visualiza a versão gerada |
| npm run lint | Verifica o código com ESLint |

## Documentação adicional

- [Instruções do backend](backend/BACKEND_README.md)
- [Instruções do frontend](frontend/README.md)
- [Regras de gamificação](backend/GAMIFICATION_RULES.md)
- [Gestão de conteúdos de aprendizagem](backend/LEARNING_MANAGEMENT.md)
