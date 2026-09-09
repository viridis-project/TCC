# Gestão de cursos e quizzes

## Instalação e atualização

Depois de importar o banco original ou atualizar o projeto, execute a partir da raiz:

```sh
php backend/migrate.php
```

O comando registra as migrações aplicadas e não repete uma migração concluída. A migração
`20260909_learning.php` adiciona cursos, alcance, publicação e arquivamento; vincula a
trilha existente ao curso global **Trilha de sustentabilidade**, sem substituir IDs de
lições, perguntas ou progresso. Perguntas sem lição são vinculadas a um quiz complementar.
As antigas lições sem perguntas não ficam disponíveis até receberem conteúdo próprio.

## Uso

A gestão está em `/cursos`, com atalhos em **Aprender**, **Administração** e **Direção**.
O endereço antigo `/admin/quiz` redireciona para a gestão de cursos.

1. Crie um curso (inicialmente rascunho).
2. Adicione módulos e defina a ordem.
3. Adicione lições com ordem e XP.
4. Adicione perguntas com quatro alternativas distintas e uma resposta correta.
5. Publique o curso. Cada módulo precisa de uma lição e cada lição precisa de perguntas.

Todos os campos do curso e seu conteúdo podem ser editados depois da publicação. O
arquivamento preserva o progresso, mas retira o conteúdo da visualização. A publicação
continua exigindo pelo menos um módulo, uma lição por módulo e uma pergunta válida por lição.
O alcance é definido na criação e não pode ser alterado por uma atualização.

| Perfil | Criação e gestão | Alcance |
| --- | --- | --- |
| Admin | Cursos globais | Todos os usuários |
| Diretor | Cursos da própria escola | Usuários da escola |
| Professor | Seus próprios cursos, em turmas ainda vinculadas a ele | Turma escolhida |

O professor cria um curso separado para cada turma quando precisa de conteúdos diferentes.
O aluno recebe os cursos publicados globais, da sua escola e da sua turma atual. Cada curso
tem progressão independente; concluir um curso não é pré-requisito para iniciar outro.
Cursos de outro professor não podem ser editados apenas por compartilhar a mesma turma.

## API

- `GET/POST /api/gestao/cursos`
- `GET/PUT/DELETE /api/gestao/cursos/{id}`
- `PUT /api/gestao/cursos/{id}/publicacao` com `{"publicado": true/false}`
- `POST /api/gestao/modulos`, `PUT/DELETE /api/gestao/modulos/{id}`
- `POST /api/gestao/licoes`, `PUT/DELETE /api/gestao/licoes/{id}`
- `POST /api/gestao/perguntas`, `PUT/DELETE /api/gestao/perguntas/{id}`

DELETE arquiva, sem apagar o histórico. Os endpoints antigos `/api/admin/quiz/perguntas`
foram substituídos pelos endpoints de gestão, com validação do curso pai em toda operação.
`/api/modulos` e os endpoints de quiz validam o público, publicação, conteúdo ativo e
progressão. O quiz não busca perguntas de outras lições nem entrega o gabarito ao aluno.
O envio deve conter cada pergunta ativa exatamente uma vez e não recompensa uma lição
que já foi concluída.

## Validação

```sh
php backend/tests/learning_access.php
php backend/tests/garden_access.php
```

Os testes de gestão usam SQLite em memória. Os testes de pontuação usam a conexão MySQL
configurada, com tabelas TEMPORARY privadas da conexão, sem alterar as tabelas da aplicação.
É necessário PHP com PDO SQLite e PDO MySQL para rodar a suíte completa.
