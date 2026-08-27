# Regras de gamificação

## Missões e pontos

| Tipo | Pontos | Impacto usado no jardim |
|---|---:|---|
| `plant` | 50 | +1 planta ativa e +1,5 kg de CO₂ reduzido |
| `water` | 20 | +10 litros economizados |
| `compost` | 75 | +2 kg de resíduos reciclados e +0,5 kg de CO₂ reduzido |
| `share` | 25 | contabilizado como engajamento |

Os pontos de missão só entram no saldo quando uma submissão `pending` muda para `approved`. A revisão bloqueia a submissão em transação, impedindo crédito duplicado.

## Quiz, XP e nível

- XP da lição: `round(xp_base × (0,5 + 0,5 × acurácia))`.
- Pontos do quiz: soma de `pergunta_quiz.pontos_recompensa` apenas para respostas corretas.
- Repetir uma lição concluída grava o histórico de respostas, mas não concede XP ou pontos novamente.
- Nível: `floor(xp_total / 200) + 1`.
- Próximo marco exibido: `(floor(xp_total / 200) + 1) × 200` XP.

## Streak

- Primeira atividade em um dia: inicia em 1.
- Se a última atividade foi ontem: incrementa 1.
- Se já houve atividade hoje: mantém.
- Se houve intervalo maior que um dia: reinicia em 1.

## Conquistas seed

- `licoes:1`: Primeira Semente.
- `modulo_completo:2`: Compostador.
- `streak:7`: Sequência de 7 dias.
- `modulo_completo:3`: Conhecedor de Pragas.
- `todos_modulos`: Mestre Jardineiro.
- `ranking:3`: Top 3 Ranking (regra cadastrada para apuração periódica; não é concedida na revisão/quiz).

`usuario_conquista` tem chave composta, logo uma conquista nunca é duplicada.

## Fórmulas do resumo do jardim

- Plantas ativas = quantidade de submissões `plant` aprovadas.
- Litros economizados = submissões `water` aprovadas × 10 L.
- Resíduos reciclados = submissões `compost` aprovadas × 2 kg.
- CO₂ reduzido = (`plant` × 1,5 kg) + (`compost` × 0,5 kg).

São fatores pedagógicos documentados, não medições científicas. Se o projeto passar a coletar quantidade real, substitua-os por colunas de medição e fatores versionados.

