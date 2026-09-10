# Backend Viridis

API JSON em PHP 8+, PDO e prepared statements. A autenticação usa sessão PHP: o logout revoga imediatamente a sessão e o navegador não precisa guardar tokens. O CORS permite credenciais somente para `FRONTEND_ORIGIN`; nunca usa `*`.

## Instalação do banco no phpMyAdmin

1. Crie ou selecione o banco `viridisbd` com `utf8mb4`.
2. Na aba **Importar**, importe `database.sql`.
3. Depois que o dump concluir, importe `migrations_viridis.sql` uma única vez.
4. Importe `migrations_viridis_v2.sql` uma única vez para criar agenda, notificações, turmas, diretor e escopo das recompensas.
5. Importe `migrations_incremento_turma_codigo.sql` para adicionar códigos de turma, o vínculo `usuario.turma_id` e convites de professores.
6. Copie `.env.example` para `.env` e preencha as credenciais.

As migrations são incrementais: não recriam nem renomeiam tabelas do dump. As contas seed são `ana.clara`, `prof.viridis`, `admin.viridis` e `diretor.viridis`, todas com senha `Viridis2026`; use-as somente localmente e troque/remova antes de publicar. `SESSION_SECRET` fica disponível para integrações futuras que assinem dados de sessão; a sessão atual é armazenada e validada no servidor pelo próprio PHP.

## Execução

No diretório `backend`:

```bash
php -S localhost:8081 router.php

C:\xampp\php\php.exe -S localhost:8081 router.php
```

Se o PHP do XAMPP não estiver no `PATH`, use no PowerShell:

```powershell
& "C:\xampp\php\php.exe" -S localhost:8081 router.php
```

No XAMPP/Laragon, aponte o host virtual para a pasta `backend`; o `.htaccess` em `api/` atende instalações Apache com `mod_rewrite`. Garanta permissão de escrita em `uploads/` e habilite PDO MySQL, `fileinfo` e `mbstring`.

No front, use `http://localhost:8081/api` como base e sempre envie cookies. O Vite do projeto usa a porta `8080`:

```ts
fetch("http://localhost:8081/api/perfil", { credentials: "include" })
```

## Endpoints

| Método e rota | Acesso | Corpo/resumo |
|---|---|---|
| `POST /api/auth/registro` | público | `{email, username, senha, nome?, codigo_turma}`; escola e turma são derivadas do código |
| `POST /api/auth/login` | público | `{login, senha}`; login aceita username ou email |
| `POST /api/auth/logout` | sessão | encerra a sessão |
| `GET /api/perfil` | autenticado | perfil e preferências |
| `PUT /api/perfil` | autenticado | campos editáveis de perfil |
| `GET /api/modulos` | autenticado | módulos, lições, status e progresso |
| `GET /api/licoes/{id}/quiz` | autenticado | perguntas/opções sem `is_correta` |
| `POST /api/licoes/{id}/quiz/submeter` | aluno | `{respostas:[{pergunta_id,opcao_id}]}` |
| `GET /api/missoes` | autenticado | quatro atividades padrão |
| `POST /api/submissoes` | aluno | multipart: `missao_id`, `descricao`, `foto` |
| `GET /api/submissoes?status=pending` | professor/admin | fila por status |
| `PUT /api/submissoes/{id}/revisar` | professor/admin | `{status, comentario?}` |
| `GET /api/recompensas` | autenticado | recompensas ativas |
| `POST /api/resgates` | aluno | `{recompensa_id}`; débito atômico |
| `GET/POST /api/parceiros` | admin | lista/cria parceiro |
| `GET/PUT/DELETE /api/parceiros/{id}` | admin | lê/edita/desativa parceiro |
| `GET /api/ranking?tipo=individual\|turma\|escola` | autenticado | ranking agregado |
| `GET/POST /api/cronograma` | aluno | lista/cria item |
| `PUT/DELETE /api/cronograma/{id}` | aluno | atualiza/remove item próprio |
| `GET /api/admin/dashboard` | professor/admin | pendências, turmas e semanas |
| `GET /api/jardim/resumo` | aluno | impactos derivados das aprovações |
| `GET /api/certificados` | aluno | lista e emite ao concluir a trilha |
| `GET /api/notificacoes` | autenticado | lista notificações mais recentes |
| `GET /api/notificacoes/contagem-nao-lidas` | autenticado | total não lido para polling |
| `PUT /api/notificacoes/{id}/marcar-lida` | autenticado | marca uma notificação própria |
| `PUT /api/notificacoes/marcar-todas-lidas` | autenticado | marca todas como lidas |
| `GET /api/agenda/aluno` | aluno | agenda pessoal |
| `GET /api/agenda/professor` | professor/admin | agenda consolidada e turmas disponíveis |
| `POST /api/agenda` | professor/admin | agenda tarefa para um ou mais alunos |
| `PUT /api/agenda/{id}/status` | professor/admin | conclui ou cancela uma tarefa |
| `GET/POST /api/admin/quiz/perguntas` | admin | lista/cria perguntas e opções |
| `PUT/DELETE /api/admin/quiz/perguntas/{id}` | admin | edita/exclui pergunta |
| `GET /api/diretor/dashboard` | diretor | indicadores da escola |
| `GET/POST /api/diretor/turmas` | diretor | lista/cria turmas |
| `GET/PUT/DELETE /api/diretor/turmas/{id}` | diretor | detalhe, edição ou exclusão sem alunos |
| `POST /api/diretor/turmas/{id}/regenerar-codigo` | diretor | invalida o código anterior e gera outro |
| `GET /api/diretor/turmas/{id}/alunos` | diretor | alunos vinculados à turma |
| `PUT/DELETE /api/diretor/turmas/{id}/alunos/{aluno_id}` | diretor | move ou desvincula aluno |
| `POST/DELETE /api/diretor/turmas/{id}/professores[/{professor_id}]` | diretor | designa/remove professor |
| `GET /api/diretor/professores-disponiveis` | diretor | professores da instituição |
| `GET/POST /api/diretor/convites-professor` | diretor | acompanha ou cria convite de professor |
| `DELETE /api/diretor/convites-professor/{id}` | diretor | cancela convite pendente |
| `GET /api/convites-professor/{token}` | público | valida convite e informa e-mail/escola |
| `POST /api/convites-professor/{token}/aceitar` | público | `{nome, senha}`; cria a conta do professor |
| `GET/POST/PUT/DELETE /api/admin/recompensas[/{id}]` | admin | catálogo geral de recompensas |
| `GET/POST/PUT/DELETE /api/diretor/recompensas[/{id}]` | diretor | catálogo escolar da instituição |

Erros usam JSON como `{ "erro": "Pontos insuficientes" }` e status adequados. Conflitos de unicidade usam 409; validações usam 422; métodos inválidos usam 405 adicionalmente aos códigos solicitados.

## Integração com o frontend

O projeto em `../frontend` já está integrado. O cliente central fica em `src/lib/api.ts`, usa `VITE_API_URL` e envia `credentials: "include"`. Login, registro, perfil, módulos, quiz, jardim, submissões multipart, recompensas, resgates, cronograma, ranking, dashboard, revisões e parceiros não dependem mais dos arquivos mockados.

Não envie `Content-Type` manualmente no upload multipart; o navegador adiciona o boundary. Em todas as chamadas use `credentials: "include"`.

## Códigos de turma e convites

O aluno não envia `instituicao_id`. No registro, `codigo_turma` deve corresponder a uma turma ativa; `turma_id` e a instituição são definidos exclusivamente pelo backend. Alunos legados que não possuem `turma_id` precisam ser vinculados manualmente na tela do diretor.

Convites de professor expiram em sete dias e só podem ser utilizados uma vez. O envio está isolado em `services/EmailService.php`. Enquanto não houver SMTP configurado, a API retorna `link` para cópia manual. Para envio real, instale um cliente como PHPMailer e configure provedor, porta, autenticação e remetente dentro desse serviço.

## Roteiro de teste escolar

1. Cadastre duas instituições e duas turmas em cada uma.
2. Copie os códigos das turmas e registre alunos com pontuações diferentes.
3. Consulte `GET /api/ranking?tipo=escola` e confirme que cada escola soma somente alunos ligados às próprias turmas.
4. Consulte `GET /api/ranking?tipo=turma` autenticado em cada escola e confirme o filtro institucional.
5. Crie um convite de professor, abra o link retornado e aceite com nome e senha.
6. Tente aceitar novamente o mesmo token: a API deve responder `410`.
7. Para testar expiração, ajuste `expira_em` para uma data passada e confirme a resposta `410`.

## Segurança e operação

- Prepared statements e emulação desabilitada no PDO.
- Senhas com `password_hash`/`password_verify`.
- Cookies HttpOnly, SameSite=Lax e Secure automaticamente sob HTTPS.
- Upload limitado a 5 MB e validado por MIME real; nomes aleatórios.
- Aprovação e resgate usam transações e bloqueios pessimistas.
- Em produção: `APP_DEBUG=false`, HTTPS, segredo forte, origem exata e diretório de uploads sem execução de PHP.
