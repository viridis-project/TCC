# Regras de gamificação

## Missões e pontos

| Tipo | Pontos | Impacto usado no jardim |
|---|---:|---|
| `plant` | 50 | +1 planta ativa e +1,5 kg de CO₂ reduzido |
| `water` | 20 | +10 litros economizados |
| `compost` | 75 | +2 kg de resíduos reciclados e +0,5 kg de CO₂ reduzido |
| `share` | 25 | contabilizado como engajamento |

Os pontos de missão só entram no saldo quando uma submissão `pending` muda para `approved`. Em missões de equipe, cada integrante do turno recebe os pontos da missão (uma única vez por turno), e o impacto no jardim também conta para todos. Os pontos vêm da missão publicada pelo professor; a tabela acima traz apenas os valores sugeridos por tipo. A revisão bloqueia a submissão em transação, impedindo crédito duplicado.

## Quiz, XP e nível

- XP da lição: `round(xp_base × (0,5 + 0,5 × acurácia))`.
- Pontos do quiz: soma de `pergunta_quiz.pontos_recompensa` apenas para respostas corretas.
- Repetir uma lição concluída grava o histórico de respostas, mas não concede XP ou pontos novamente.
- Nível: `floor(xp_total / 200) + 1`.
- Próximo marco exibido: `(floor(xp_total / 200) + 1) × 200` XP.

## Streak

- A sequência considera a conclusão de lições novas. Repetições e aprovações de missões não alteram a sequência.
- Na primeira conclusão, a sequência começa em 1. Se a última conclusão foi ontem, incrementa 1. Se já houve conclusão hoje, mantém. Depois de um intervalo maior que um dia, reinicia em 1 na próxima conclusão.

## Conquistas seed

- `licoes:1`: Primeira Semente.
- `modulo_completo:2`: Compostador, ao completar o módulo Nutrição do Solo (ID 2).
- `streak:7`: Sequência de 7 dias.
- `modulo_completo:3`: Conhecedor de Pragas, ao completar o módulo Controle de Pragas (ID 3).
- `todos_modulos`: Mestre Jardineiro, ao completar todos os módulos disponíveis para o aluno naquele momento.
- `ranking:3`: Top 3 Ranking, ao figurar entre os três primeiros do ranking individual com saldo positivo. A ordem é por pontos, nome e ID.

As conquistas são avaliadas ao concluir uma lição, receber aprovação de missão ou abrir o Jardim. A consulta ao Jardim também reconhece progresso registrado antes do lançamento. A chave composta de `usuario_conquista` mantém um registro por aluno e conquista. O desbloqueio é permanente e gera uma única notificação quando a preferência do aluno está ativada.

Administradores podem cadastrar novas conquistas pelo painel. O endpoint `POST /api/admin/conquistas` aceita as regras `licoes`, `streak`, `modulo_completo`, `todos_modulos` e `ranking`. Conquistas de módulo só podem apontar para módulos ativos de cursos gerais publicados. A coluna `regra` é única, impedindo que duas conquistas usem o mesmo critério e a mesma meta.

## Fórmulas do resumo do jardim

- Plantas ativas = quantidade de submissões `plant` aprovadas.
- Litros economizados = submissões `water` aprovadas × 10 L.
- Resíduos reciclados = submissões `compost` aprovadas × 2 kg.
- CO₂ reduzido = (`plant` × 1,5 kg) + (`compost` × 0,5 kg).

São fatores pedagógicos documentados, não medições científicas. Se o projeto passar a coletar quantidade real, substitua-os por colunas de medição e fatores versionados.

