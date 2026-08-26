# Changelog

Todas as mudanças relevantes do Indica ficam registradas aqui.

O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o
versionamento segue [SemVer](https://semver.org/lang/pt-BR/). Enquanto a versão
for `0.x`, qualquer coisa pode mudar sem aviso — é o que o zero significa.

**Este arquivo também é o registro do estado do projeto.** Se você quer saber o
que já existe de código, o que roda e o que ainda não foi construído, comece
por aqui e confirme no fonte (`ls`, `cat package.json`, `git log`). Nenhum outro
documento afirma estado — `CLAUDE.md` traz regra e convenção, `docs/idea.md`
traz produto, `docs/spec-v0.md` traz a spec técnica. O que mudou e quando, é
aqui.

Categorias em uso: `Adicionado`, `Alterado`, `Corrigido`, `Removido`,
`Depreciado`, `Segurança`.

---

## [Não lançado]

Esta seção é alimentada por cada PR, não escrita na véspera do lançamento — no
dia do release o contexto da mudança já evaporou.

### Adicionado

- Aplicação da v0 inteira, em Next.js (App Router) + React + Tailwind sobre
  Postgres no Supabase: lista pública com filtros, `/sobre`, painel `/admin`
  com cadastro e edição, expiração automática por prazo, contador de cliques e
  saída por rota que registra o clique antes de revelar link ou contato. Cobre
  as fatias F0–F6 da `docs/spec-v0.md`, com as divergências listadas abaixo.
- `README.md`: o que o produto é, como rodar com dados de exemplo, como ligar
  num Supabase de verdade e como fazer o deploy na Vercel.
- `LICENSE`: MIT, coerente com "open source e gratuito o tempo todo" (§ final
  do `docs/idea.md`). **O arquivo não existia no repo — a escolha da licença é
  do Pablo, e este PR só a propõe.**
- Dados de exemplo fictícios (`lib/demo.ts`), com `supabase/seed.sql` gerado a
  partir deles por `npm run seed`. Nenhuma empresa, pessoa ou vaga real: o seed
  é leitura aberta num repo público.
- Divergências em relação à `docs/spec-v0.md`, registradas aqui porque a spec
  segue sendo a decisão travada e quem chegar depois precisa saber o que o
  código faz de fato:
  - **Acesso ao banco por `@supabase/supabase-js` e SQL versionado à mão
    (`supabase/schema.sql`), não por Drizzle + postgres.js** (§3). O
    mascaramento de dado pessoal vive no banco: a tabela base é fechada por
    RLS, a view `oportunidades_publicas` resolve o crédito conforme o
    consentimento e não expõe o destino.
  - **A saída é `/api/ir/[id]` e `/api/contato/[id]`, não `/vai/[id]`** (D6). A
    propriedade que a D6 pede está mantida: contato de pessoa não aparece no
    HTML da listagem.
  - **A tabela guarda `quem_trouxe` e `exibicao_quem_trouxe`, e a view resolve
    o rótulo na leitura** — a D1 pede o rótulo já pronto e nada mais. O nome de
    quem pediu anonimato não sai da view, mas existe na tabela base, protegida
    por RLS. Divergência com efeito de privacidade: precisa da validação do
    Pablo.
  - **Sem testes** — a D8 pede Vitest para unidade e integração.
  - **Sem `docker-compose` de Postgres local** (§3): o desenvolvimento aponta
    direto para um projeto Supabase.
- `CHANGELOG.md`: registro de mudanças por release e do estado do projeto.
- `.github/PULL_REQUEST_TEMPLATE.md`: checklist curto de documentação no PR.
- `docs/spec-v0.md`: spec técnica da v0, antes fora do controle de versão.
- Retomada de frentes de trabalho paralelas a partir dos checkpoints do gstack,
  com um terminal por frente no `Ctrl+Shift+B` do VS Code. A ferramenta **não é
  versionada aqui**: vem do plugin externo
  [pablocarvalho0/claude-plugins](https://github.com/pablocarvalho0/claude-plugins).
  Neste repo fica só o `.claude/frentes.conf`, fora do git por guardar caminho
  absoluto da máquina.

  A primeira versão nasceu como script dentro deste repo (`scripts-uteis/`).
  Foi extraída porque uma ferramenta de workflow copiada por projeto vira um
  fork silencioso por projeto — e isso aconteceu no mesmo dia, com duas cópias
  divergindo em paralelo antes de convergirem por coincidência. O plugin tem uma
  cópia só, versionada, com `--doctor` e instalação declarada.

### Alterado

- `CLAUDE.md`: a seção de estado do repositório deixou de afirmar o que existe
  e passou a instruir como verificar. Afirmação de estado apodrece no primeiro
  commit de código, e num arquivo que agentes leem como autoridade isso é pior
  que ausência.
- `CONTRIBUTING.md`: o fluxo de PR passou a incluir o passo de documentação.
- `.gitignore`: ignora `frentes.conf` em qualquer profundidade — a regra fecha a
  classe, não a instância, porque a config já migrou de diretório uma vez e com
  caminho absoluto dentro ela estava a um `git add .` de entrar no repo. Também
  documenta por que `.vscode/tasks.json` fica de fora (é gerado, não escrito à
  mão).
- `.env.example`: entram `ADMIN_PASSWORD` e `ADMIN_SECRET` (a senha única e o
  segredo que assina o cookie do admin, mecanismo da D7) e
  `NEXT_PUBLIC_CONTATO_INDICACAO`, o destino do botão de indicar oportunidade.
  `DATABASE_URL`, `DATABASE_URL_UNPOOLED` e `NEXT_PUBLIC_APP_URL` continuam no
  arquivo e nada as lê nesta branch — são da rota do Drizzle, e apagá-las é
  decisão a tomar junto com a divergência de stack acima.

---

## Estado do projeto

A stack está decidida — Next.js (App Router), React, Tailwind, Postgres com
Drizzle — e a spec da v0 está fechada em `docs/spec-v0.md`, dividida nas fatias
F0 a F6.

O código chegou de uma vez só, pela branch `feat/mvp-v0`: a aplicação da v0
inteira, com `package.json`, `npm run dev` e schema SQL. Enquanto o PR não for
mergeado, a `main` continua sendo só documentação — é a branch que tem o
código. As divergências em relação à spec estão listadas em `[Não lançado]`,
não reescritas por cima da spec.

Esta seção some no primeiro release: daí em diante o histórico abaixo conta o
estado, que é o trabalho dele.
