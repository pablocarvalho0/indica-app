# Indica

**Vaga boa sempre foi QI. A gente só abriu o Q.**

Oportunidades que circulam por indicação nas melhores faculdades do Brasil —
reunidas num lugar só. Sem login, sem cadastro.

Este repositório é a **v0**: a implementação do documento de escopo do
produto (`escopo-v0-e-visao.pdf`, mantido fora do repositório por ser interno).
Nada além do que está lá foi construído, e as decisões de produto do documento
estão marcadas nos comentários do código, onde elas viram consequência
técnica.

---

## O recorte, dito com honestidade

O Indica quebra a bolha **entre** faculdades: quem entrou no ITA não deveria
perder uma oportunidade só porque ela circulou na Insper. Ele **não** quebra o
privilégio de acesso mais amplo — o recorte segue sendo faculdade seletiva.
Isso está no rodapé do site de propósito. A expressão "democratizar
oportunidade" não é usada em lugar nenhum.

## O critério de entrada

> Se a pessoa acharia essa oportunidade sozinha buscando no LinkedIn por 20
> minutos, ela não entra.

Área é filtro, não critério. O posicionamento é o ativo: no dia em que isso
virar "vagas em geral", o valor para quem posta evapora e o supply seca.

---

## Rodar em 30 segundos

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000` com **dados de exemplo** — 28 oportunidades
fictícias que existem só para mostrar o formato do produto. Nenhum banco é
necessário para isso.

> As empresas, pessoas e links dos dados de exemplo são **inventados**. Nada
> ali é vaga real. Eles vivem em `lib/demo.ts`.

---

## Ligar num banco de verdade

### 1. Supabase

1. Crie um projeto em [supabase.com/dashboard](https://supabase.com/dashboard)
   (plano free serve para a v0).
2. Abra o **SQL Editor** e rode `supabase/schema.sql` inteiro, uma vez.
3. Opcional, para não ver a lista vazia enquanto a coleta real não chega nos
   ~25–30 itens: rode também `supabase/seed.sql`. Ele carrega os mesmos dados
   fictícios, e o próprio arquivo traz o `delete` que os apaga depois.

### 2. Variáveis de ambiente

```bash
cp .env.example .env
```

Preencha:

| Variável | Onde achar | Vai para o browser? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase › Project Settings › API | sim |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | idem | sim |
| `SUPABASE_SERVICE_ROLE_KEY` | idem (chave secreta) | **nunca** |
| `ADMIN_PASSWORD` | você escolhe | não |
| `ADMIN_SECRET` | gere abaixo | não |
| `NEXT_PUBLIC_CONTATO_INDICACAO` | seu WhatsApp/e-mail | sim |

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Reinicie o `npm run dev` — variável de ambiente só é lida na inicialização.

### 3. Deploy na Vercel

1. Suba o repositório no GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório. O Next.js
   é detectado sozinho; não precisa configurar build.
3. Cole as mesmas variáveis em **Settings › Environment Variables**
   (Production e Preview).
4. Deploy.

**Duas notas do documento, confirme antes de fechar:** o plano Hobby da Vercel
é para uso não-comercial (revisar se a Fase 6 acontecer), e projeto Supabase
inativo é pausado — vale conferir os limites atuais nas páginas de pricing.

---

## O painel

`/admin`, protegido por senha única. Um curador só na v0 — é assim de
propósito: a Fase 3 (embaixadores) só existe depois de o modelo de curadoria
estar afinado.

- **Cadastrar em menos de 60 segundos.** Requisito de produto, não de UX. Se
  demorar mais, o projeto morre no mês 2 por fadiga de admin. Daí vêm as
  pastilhas no lugar de `select`, os opcionais escondidos atrás de "mais
  campos" e o botão "publicar e cadastrar outra".
- **Expiração automática.** Item com prazo vencido some da lista sozinho —
  nenhum cron, é a própria consulta que filtra.
- **"Vence essa semana".** A visão que evita a lista apodrecer.
- **Contador de cliques.** O único proxy de valor entregue na v0.
- **Aviso de lançamento.** Abaixo de 25 itens vivos, o painel avisa. Lista
  vazia parece morta e queima a primeira impressão.

---

## As duas features que valem mais do que parecem

**"Quem trouxe"** — crédito público é a moeda que faz os amigos mandarem
oportunidade de graça. Quem trouxe escolhe como aparece: nome completo,
primeiro nome + faculdade, ou anônimo. Essa escolha é respeitada **no banco**:
a view pública devolve o crédito já resolvido em texto, e quando é anônimo o
nome real simplesmente não sai do Postgres.

**"O que você precisa saber"** — é o efeito QI engarrafado. É a informação que
circula no grupo junto com o link e que gera a vantagem injusta. Custa um
`text` no schema e é a coisa mais difícil de copiar no produto inteiro. Por
isso é o bloco com mais peso visual no card, e por isso está no topo do
formulário e não escondido entre os opcionais.

### Os três modos de candidatura

| Modo | O que é |
| --- | --- |
| `link` | Link público. A pessoa se candidata direto. |
| `ponte` | O contato é de quem trouxe. Ele faz a indicação. Preserva o valor social de quem indica — mantém um QI, mas abre quem pode acessá-lo. |
| `contato` | Contato do dono da vaga, exibido **só com autorização explícita dele**. Sem autorização, cai para `ponte`. Contato que chegou em privado nunca vai para o site. |

---

## Privacidade — como isso está resolvido no código

O card é uma página aberta com dado pessoal de terceiro. Três decisões:

1. **A tabela base é fechada.** A chave `anon` do Supabase é pública por design
   (ela vai no bundle do browser). Se ela pudesse dar `SELECT` na tabela,
   qualquer pessoa leria o nome de quem pediu anonimato e o contato de todo
   mundo. Não existe policy de leitura na tabela — só na view.
2. **A view mascara colunas.** `oportunidades_publicas` resolve o crédito
   conforme o consentimento, aplica a expiração e **não expõe** o campo de
   destino.
3. **O destino só sai depois de um clique.** A função `registrar_clique()`
   conta o clique e devolve o link/contato na mesma transação. Contato de
   ponte e de dono de vaga não está no HTML da listagem.

Tudo isso está comentado em `supabase/schema.sql`.

---

## Estrutura

```
app/
  (publico)/         home com a lista e os filtros, /sobre com o critério
  admin/             login, painel, formulário (guard de rota + server actions)
  api/ir/[id]        conta o clique e redireciona para fora do app
  api/contato/[id]   conta o clique e devolve o contato (ponte / contato direto)
components/          card, filtros, formulário
lib/
  queries.ts         leitura, filtros e a regra do filtro que não pode dar vazio
  types.ts           vocabulário do domínio; espelha os CHECKs do schema
  auth.ts            sessão do admin (cookie assinado com HMAC)
  format.ts          datas e prazos no fuso de Brasília
  demo.ts            dados de exemplo (fictícios) — fonte do seed
supabase/
  schema.sql         tabela, RLS, view pública, função de clique
  seed.sql           gerado por `npm run seed` a partir de lib/demo.ts
```

### Decisões que talvez surpreendam

- **Uma entidade só.** `vaga`, `off-cycle`, `programa` e `freela` são um enum,
  não quatro tabelas. O campo `tipo` existe desde o dia 1 a custo zero, mas a
  curadoria da v0 usa só dois valores.
- **O filtro de tipo não aparece.** Ele só entra quando houver volume nos
  quatro tipos. A regra está em `TIPOS_MINIMOS_PARA_FILTRAR`, uma linha.
- **Filtro que retornaria vazio não é renderizado.** As opções são contadas já
  considerando os outros filtros ativos — não existe combinação clicável que
  leve a uma lista vazia.
- **Faculdade-alvo vazia = aberta a todas**, e essas aparecem em qualquer
  recorte de faculdade. O número na pastilha é de vagas *exclusivas*: é o que
  ajuda a decidir se vale filtrar.
- **Ordenação é por recência, não relevância.** Frescor é metade do valor.
- **Filtrar não usa JavaScript.** O estado mora na URL, o recorte é
  compartilhável e o botão voltar do celular funciona.

---

## Fora da v0, de propósito

Login · perfil de usuário · candidatura dentro do app · upload de currículo ·
submissão aberta com fila de curadoria · comentários · busca full-text · alerta
por e-mail · dashboard de analytics · qualquer PII além do que está no card.

## O que vem depois (guia, não escopo)

Cada fase só existe se a anterior funcionou.

| Fase | O quê |
| --- | --- |
| 1 | **v0** — provar que existe dor e que há supply. Um curador só. |
| 2 | Push e frescor: alerta com filtro salvo. Exige login — primeira vez que há dado pessoal no sistema. |
| 3 | Embaixadores: um amigo de confiança por faculdade publica. Três papéis. |
| 3b | Submissão aberta, só se necessário — traz moderação, vaga falsa, XSS de terceiro. É o salto de risco real. |
| 4 | Contexto como ativo: a camada de contexto crescendo por contribuição. O fosso competitivo. |
| 5 | Amplitude de tipos, cada um com volume que justifique o filtro. |
| 6 | Monetização, só se consolidar. Nunca cobrar do candidato. |

## Métricas que importam

Não é usuário cadastrado. É: **oportunidades novas por semana** (saúde do
supply, o gargalo real), **cliques por item** (o único proxy de valor na v0) e
**pelo menos uma contratação que só existiu por causa da lista**.

---

## Comandos

| | |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm run typecheck` | checagem de tipos |
| `npm run seed` | regenera `supabase/seed.sql` a partir de `lib/demo.ts` |

## Licença

MIT — ver `LICENSE`. Open source e gratuito o tempo todo, repo público desde a
v0.
