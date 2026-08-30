# Indica

> **Vaga boa sempre foi QI. A gente só abriu o Q.**

Oportunidades que circulam por indicação nas melhores faculdades do Brasil —
reunidas num lugar só. Lista pública, ordenada por recência, com curadoria
fechada. Sem login, sem cadastro, sem candidatura dentro do app.

O produto inteiro está descrito em [`docs/idea.md`](docs/idea.md); a spec técnica
da v0, em [`docs/spec-v0.md`](docs/spec-v0.md).

---

## A dor

Vaga boa de time pequeno circula por canal fechado: grupo de WhatsApp por
faculdade, indicação, DM. Cada bolha — ITA, IME, Unicamp, Insper, USP — enxerga
um pedaço diferente do mercado. A dor tem três camadas, em ordem de importância:

1. **Cobertura** — a oportunidade existiu e você nunca soube dela.
2. **Frescor** — fecha em 5 a 10 dias, por indicação. Saber depois é não saber.
3. **Contexto** — quem está no grupo não recebe só o link. Recebe "o processo é
   rápido", "paga X", "eles querem Y". Essa informação é a vantagem real.

É a camada 3 que faz alguém bem preparado perder para alguém pior preparado que
estava no grupo certo. O Indica quebra o **QI dentro da bolha**: quem entrou no
ITA não deveria perder uma oportunidade só porque ela circulou na Insper.

**O que ele não quebra:** o privilégio de acesso mais amplo. O recorte continua
sendo faculdade seletiva, e isso é dito com todas as letras aqui e em qualquer
comunicação pública do projeto.

## O que entra na lista

O critério de admissão é um teste só:

> **Se a pessoa acharia essa oportunidade sozinha buscando no LinkedIn por 20
> minutos, ela não entra.**

Área é filtro, não critério.

**Entra:** off-cycle de fundo, sourcing ou analyst de VC, primeiro hire de
startup seed, tech em scale-up por indicação, vaga aberta especificamente para
uma faculdade, oportunidade que um amigo abriu no próprio time.

**Não entra:** programa de estágio de multinacional, trainee de banco, MBB,
qualquer coisa com landing page e campanha de campus própria. Não por ser ruim —
por já ser visível.

Aberto não é o mesmo que genérico. No dia em que a lista virar "vagas em geral",
o valor para quem posta evapora e o supply seca. O posicionamento é o ativo.

## As três coisas que o card carrega

- **Quem trouxe** — crédito público, com a exibição escolhida por quem indicou
  (nome, primeiro nome + faculdade, ou anônimo). É a moeda que faz oportunidade
  chegar de graça.
- **Modo de candidatura** — link público, *via ponte* (você fala com quem
  trouxe e ele indica) ou contato direto, este último **só** com autorização
  explícita do dono da vaga.
- **O que você precisa saber** — o contexto que circula no grupo junto com o
  link. É o efeito QI engarrafado, e a parte mais difícil de copiar.

## Estado do projeto

**Não pergunte a este arquivo o que já existe.** Estado afirmado em README
apodrece no commit seguinte. O registro vivo é o
[`CHANGELOG.md`](CHANGELOG.md) — e o fonte confirma (`ls`, `git log`,
`cat package.json`).

A v0 ainda não tem comando de instalar nem de rodar. Quando tiver, as instruções
de execução entram aqui.

## Stack decidida

Next.js (App Router) + React + Tailwind CSS, dados em Postgres com Drizzle ORM.
Deploy alvo: Vercel + Supabase. O porquê de cada peça está na §3 da
[`docs/spec-v0.md`](docs/spec-v0.md).

## Documentação

Cada arquivo tem um papel e não invade o do outro:

| Arquivo | O que traz |
|---|---|
| [`docs/idea.md`](docs/idea.md) | Produto: a dor, o critério de admissão, o escopo da v0 e o que ficou de fora de propósito. Fonte de verdade do **o quê**. |
| [`docs/spec-v0.md`](docs/spec-v0.md) | Spec técnica: stack, schema, fatias de implementação. Fonte de verdade do **como**. |
| [`CHANGELOG.md`](CHANGELOG.md) | O que mudou, em que release, e o estado atual. |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | O fluxo de branch, commit e PR. |
| [`CLAUDE.md`](CLAUDE.md) | Regras e convenções para quem trabalha aqui via agente de IA. |

## Contribuindo

Branch → commit → PR para `main` → validação do Pablo. Nada entra na `main` sem
review. O passo a passo, com os comandos, está no
[`CONTRIBUTING.md`](CONTRIBUTING.md).

Antes de propor feature, vale conferir a lista **Fora da v0** no
[`docs/idea.md`](docs/idea.md) — login, perfil, candidatura interna, upload de
currículo, submissão aberta, comentários, busca full-text e alerta por e-mail
estão de fora por decisão, não por esquecimento.

## Dado de terceiro

O repositório é público, e o produto lida com gente real. Nada de dado pessoal
de terceiro em código, seed, teste, fixture, comentário ou mensagem de commit —
nome, telefone, e-mail, currículo, print de conversa. Dado de exemplo tem que ser
obviamente fictício. Contato de dono de vaga só é publicado com autorização
explícita dele; sem ela, a candidatura vai como *via ponte*.

## Licença

[MIT](LICENSE). O projeto é aberto desde a v0 e nunca vai cobrar de quem se
candidata.
