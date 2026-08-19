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

- `CHANGELOG.md`: registro de mudanças por release e do estado do projeto.
- `.github/PULL_REQUEST_TEMPLATE.md`: checklist curto de documentação no PR.
- `docs/spec-v0.md`: spec técnica da v0, antes fora do controle de versão.
- `scripts-uteis/retomar-frentes.sh` e a skill `/frentes`: retomada de frentes de
  trabalho paralelas a partir dos checkpoints do gstack, com um terminal por
  frente no `Ctrl+Shift+B` do VS Code. O `frentes.conf` fica fora do git por
  guardar caminho absoluto da máquina — versionado é o `frentes.conf.example`.
  Os comandos da skill derivam a raiz via `git rev-parse --show-toplevel` e o
  script aceita `GSTACK_SLUG_BIN` e `FRENTES_CONF` por ambiente, então funcionam
  em qualquer clone, não só na máquina onde foram escritos.

### Alterado

- `CLAUDE.md`: a seção de estado do repositório deixou de afirmar o que existe
  e passou a instruir como verificar. Afirmação de estado apodrece no primeiro
  commit de código, e num arquivo que agentes leem como autoridade isso é pior
  que ausência.
- `CONTRIBUTING.md`: o fluxo de PR passou a incluir o passo de documentação.
- `.gitignore`: exclui `scripts-uteis/frentes.conf` e documenta por que
  `.vscode/tasks.json` fica de fora (é gerado, não escrito à mão).

---

## Estado do projeto

A stack está decidida — Next.js (App Router), React, Tailwind, Postgres com
Drizzle — e a spec da v0 está fechada em `docs/spec-v0.md`, dividida nas fatias
F0 a F6.

Ainda não há código: o repo tem documentação, `.gitignore` e `.env.example`, sem
`package.json` nem comando de execução. A próxima fatia é a F0 (fundação).

Quando a F0 entrar, esta seção some — o histórico de releases abaixo passa a
contar o estado, que é o trabalho dele.
