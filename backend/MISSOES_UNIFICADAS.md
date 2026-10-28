# Mecânica unificada de missões

## Modelo de dados

`missao` continua sendo o catálogo opcional de modelos/referências. A atividade publicada para uma turma passa a ser representada por `missao_publicada`, que armazena título, descrição, instruções, imagem (URL), tipo, pontuação, capacidade, modo de participação, responsável, turma e estado de publicação.

`agenda.missao_publicada_id` vincula cada reserva à atividade publicada; `missao_convite` registra convites para grupos; `submissao_missao.missao_publicada_id` vincula a comprovação à missão específica; `missao_pontuacao` funciona como ledger idempotente para impedir créditos repetidos por participante/grupo.

## Migração

1. Faça backup do banco de dados.
2. Configure `backend/.env` para apontar para o banco correto.
3. Execute a migração incremental de acordo com o fluxo de deploy do ambiente. No fluxo do projeto, no diretório `backend`, use `php migrate.php` e confira que `20261028_published_missions.php` foi aplicada.
4. Confirme que a migração preservou os IDs das antigas `tarefa_aberta` em `missao_publicada`, associou `agenda` e `submissao_missao`, e copiou convites. As tabelas antigas são mantidas para histórico e compatibilidade; não as remova nesta versão.
5. Faça os testes abaixo antes de publicar em produção.

A migração define `requer_submissao=0` para registros migrados de Tasks já existentes, para preservar o fluxo de conclusão manual e sua pontuação. Novas missões usam `requer_submissao=1`: a pontuação só é processada após a aprovação da comprovação. Para registros legados já concluídos, o ledger marca a pontuação histórica como potencialmente creditada para evitar duplicação.

> Se o ambiente aplicou as migrações antigas manualmente e ainda não possui uma tabela `schema_migration` consistente, confira o estado do banco antes de executar o runner completo. Não rode migrações em produção sem backup e revisão do resultado.

## Endpoints canônicos

- `POST /api/missoes-publicadas`: professor/admin publica uma missão para uma turma. Corpo JSON: `turma_id`, `titulo`, `descricao`, `instrucoes`, `imagem` (URL opcional), `tipo`, `missao_id` (referência opcional), `pontos`, `max_alunos` e `modo_participacao`.
- `GET /api/agenda/aluno`: agenda da turma e missões disponíveis/assumidas para o aluno.
- `GET /api/agenda/professor` e `GET /api/agenda/diretor`: calendário, turmas e missões publicadas. A interface mostra as missões ainda disponíveis em uma seção junto ao calendário; a data/hora selecionada na adesão aparece como compromisso na grade.
- `POST /api/missoes-publicadas/{id}/aceitar`: aluno escolhe data/hora e cria a primeira reserva.
- `POST /api/missoes-publicadas/{id}/entrar`: aluno entra em uma equipe aberta existente.
- `GET /api/missoes-publicadas/{id}/alunos`: lista colegas elegíveis para convite ao grupo.
- `POST /api/missoes-publicadas/{id}/convidar` e `POST /api/convites-missao/{id}/responder`: convite e resposta de equipe.
- `PUT /api/missoes-publicadas/{id}`: professor/admin encerra ou reabre a missão.
- `POST /api/submissoes` com `missao_publicada_id`: envio de comprovação; `PUT /api/submissoes/{id}/revisar` registra a avaliação.
- `PUT /api/agenda/{id}/status`: conclusão/cancelamento da reserva, com a regra de pontuação correspondente ao registro.

`POST /api/agenda` e as rotas antigas `tarefas-abertas`/`convites-tarefa` permanecem aliases temporários para compatibilidade; a interface atual usa os endpoints e rótulos de missões.

## Regras importantes

- Se `max_alunos=1`, o backend força `modo_participacao='aberto'`; a interface não mostra a seleção aberta/convite e APIs de entrar/convidar recusam a operação.
- Para equipes, a escolha entre equipe aberta e por convite é definida na publicação; o aluno escolhe o horário, não o professor.
- A criação/adesão bloqueia a linha da missão dentro de transação antes de conferir capacidade, reduzindo risco de excesso de participantes em solicitações simultâneas.
- A chave única de `missao_pontuacao`, combinada com o bloqueio transacional da missão durante a avaliação, impede crédito duplicado por missão, grupo e aluno.
- Missões novas exigem submissão e aprovação para pontuar; Tasks legadas mantêm o comportamento histórico de conclusão manual.

## Verificações locais

No diretório `frontend`, execute `npm ci`, `npm run lint` e `npm run build`. No backend, execute `php -l` nos arquivos modificados e os testes de `backend/tests` com uma instalação PHP que possua o driver PDO necessário para SQLite e/ou o banco de teste configurado. O teste real da migração e das transações deve ser feito contra uma cópia de MySQL/MariaDB dos dados do projeto.
