# Viridis — Frontend

Interface em React 19, TanStack Start/Router/Query, Tailwind e shadcn/ui. Todas as chamadas passam por `src/lib/api.ts`, usam a URL definida em `VITE_API_URL` e enviam o cookie de sessão do backend.

## Execução

Crie um arquivo `.env` a partir de `.env.example` e inicie o projeto:

```powershell
npm install
npm run dev
```

O frontend abre em `http://localhost:8080` e espera a API em `http://localhost:8081/api` por padrão.

## Rotas principais

| Rota | Perfil | Descrição |
|---|---|---|
| `/login` e `/registro` | público | autenticação e criação de conta |
| `/convite-professor/$token` | público | aceite seguro de convite e criação da conta do professor |
| `/aprender` | autenticado | trilha de módulos, lições e quiz |
| `/jardim` | aluno | progresso, missões e envio de atividades |
| `/horarios` | aluno/professor | agenda pessoal do aluno ou agenda consolidada e criação de tarefas pelo professor |
| `/recompensas` | autenticado | recompensas separadas entre escola e catálogo geral |
| `/perfil` | autenticado | dados pessoais e preferências |
| `/admin` | professor/admin | dashboard e aprovações; parceiros e recompensas gerais ficam restritos ao admin |
| `/admin/quiz` | admin | criação, edição e exclusão de perguntas do quiz |
| `/diretor` | diretor | dashboard, códigos e alunos das turmas, convites de professores e recompensas escolares |

O sino da navegação consulta notificações não lidas a cada 30 segundos. O modal permite abrir uma notificação, marcar uma individualmente ou marcar todas como lidas.

## Contas locais

Após importar as migrations do backend, use a senha `Viridis2026` com um destes usuários:

- `ana.clara` — aluno
- `prof.viridis` — professor
- `admin.viridis` — administrador
- `diretor.viridis` — diretor

Essas credenciais são apenas para desenvolvimento local.
