# Auditoria do schema e do front

Auditoria feita antes da migration, comparando `database.sql` com `frontend/src/lib/mock-data.ts`, `frontend/src/lib/quiz-data.ts`, as oito rotas solicitadas e os cinco modais relacionados.

| Área do front | Dados usados | Cobertura no dump original | Incremento aplicado |
|---|---|---|---|
| Login/registro | username, email, senha; registro sem CPF | `usuario` tinha email/senha e CPF obrigatório | `username` único; CPF nullable; validação de senha no PHP |
| Perfil | nome, email, avatar, telefone, turma, preferências, nível/XP/streak/pontos | somente nome, email, telefone e pontos | avatar, turma, nível, XP, próximo nível, streak, última atividade, notificações e tema |
| Aprender | módulos, cor, ordem, lições, kind, XP, status/progresso | quiz existia sem trilha | `modulo`, `licao`, `usuario_licao_progresso`; `pergunta_quiz.licao_id` |
| Quiz modal | pergunta, opções, resposta correta e explicação | pergunta/opção/correção existiam, explicação e lição não | `pergunta_quiz.explicacao` e `licao_id`; API não expõe `is_correta` |
| Jardim | missões tipadas, submissão com texto/foto, impactos, ranking, conquistas | missão/submissão básicas e pontos | tipo, descrição, status/revisão; conquistas; agregações calculadas |
| Recompensas | título, parceiro, pontos, imagem e resgate | inexistente | parceiro, recompensa e resgate |
| Horários | missão, datas e status | `cronograma_aluno` já cobria os campos | CRUD e joins; nenhuma tabela duplicada |
| Admin | pendências, comentário, aprovação, turma, progresso semanal, parceiros | flags de validação sem status/comentário; sem turma/parceiro | revisão completa, turma, parceiros e agregações |
| Certificados | código, PDF e emissão | tabela já existente | emissão idempotente ao concluir todas as lições |

Observações preservadas:

- O dump real chama o campo da instituição de `data_cadastro`, portanto ele não foi renomeado.
- As tabelas originais, chaves e FKs foram mantidas.
- `professor_validado` continua existindo por compatibilidade, mas a API usa `status` como fonte de verdade.
- `ia_validada` permanece no schema e não participa do fluxo atual.
- O dump original não contém dados; a migration cria papéis, uma instituição e contas seed antes das missões que exigem `criador_id`.

