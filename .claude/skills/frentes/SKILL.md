---
name: frentes
description: Configura quais frentes de trabalho do Indica retomar no próximo dia. Recebe em texto livre os checkpoints/trabalhos a retomar ("amanhã quero voltar na fatia de schema e no mockup da lista"), casa com os checkpoints do gstack, escreve o scripts-uteis/frentes.conf e regenera o .vscode/tasks.json — que abre um terminal por frente com o contexto restaurado no Ctrl+Shift+B.
---

# /frentes — Configurar as frentes a retomar no dia seguinte

Esta skill vive dentro do repo do Indica. Diferente da versão do `work-leapy`
— que mora numa raiz guarda-chuva porque o trabalho lá cruza vários repos —
aqui o workspace **é** o repo, e as frentes são o próprio `indica-app` mais os
worktrees que nascerem dele.

## O mecanismo que ela opera

Quatro arquivos, com papéis separados:

| Arquivo | Papel | Quem edita |
|---|---|---|
| `scripts-uteis/retomar-frentes.sh` | toda a lógica | **ninguém** (só tarefa de código explícita) |
| `scripts-uteis/frentes.conf` | quais frentes retomar | **esta skill** |
| `scripts-uteis/frentes.conf.example` | template versionado | só quando o formato mudar |
| `.vscode/tasks.json` | as tasks do `Ctrl+Shift+B` | **gerado** pelo script |

O `frentes.conf` está no `.gitignore` porque guarda caminho absoluto da máquina;
o que vai pro repo é o `.example`. Mesma convenção do `.env` / `.env.example`
que o projeto já usa.

No dia seguinte é abrir o VS Code no `indica-app` e apertar `Ctrl+Shift+B`:
sobe um terminal dedicado por frente, cada um já com `cd` no diretório certo e
rodando `claude "/context-restore <checkpoint>"`.

### Regras invioláveis

- **Nunca editar `retomar-frentes.sh`** para configurar frentes. Se o pedido
  parecer exigir mudança de lógica (ex: "quero que abra em split em vez de
  aba"), dizer isso na cara e tratar como tarefa de código separada, não como
  uso da skill.
- **Nunca editar `.vscode/tasks.json` à mão.** Ele é gerado; edição manual some
  no próximo `--gerar-tasks`.
- **Não inventar checkpoint.** Se o Pablo citar um trabalho que não tem
  checkpoint salvo, avisar que falta rodar `/context-save` naquela sessão — não
  apontar a config pra um checkpoint parecido "que deve servir".
- **Não commitar nem dar push.** Regra 2 do `CLAUDE.md` deste repo. A skill
  escreve arquivo local e para aí; publicar é pedido explícito do Pablo.

## Fluxo

### 1. Descobrir o que existe (sempre rodar antes de perguntar qualquer coisa)

```bash
cd "$(git rev-parse --show-toplevel)/scripts-uteis"
./retomar-frentes.sh --descobrir 3    # aumente os dias se ele citar algo antigo
./retomar-frentes.sh                  # o que já está configurado hoje
```

O `--descobrir` varre o repo e os worktrees irmãos — o padrão é
`<pasta-do-repo>-*`, aqui `indica-app-*` — e devolve os diretórios candidatos
com a branch atual de cada um, mais os checkpoints recentes com data, branch
e título. Os outros projetos do `study-code`
(`api-notas`, `painel-*`) **não** aparecem: cada um tem slug próprio e frentes
próprias.

### 2. Entender o pedido

Se vier argumento (`/frentes schema e mockup da lista`), usar. Se vier vazio,
mostrar a lista numerada do `--descobrir` e perguntar quais ele quer — não
assumir "as mesmas de ontem", e não assumir "todos os de hoje".

O Pablo fala por assunto ("a fatia do schema", "aquele do mockup"), não por nome
de arquivo. Casar pelo título do checkpoint. Quando dois checkpoints do mesmo
assunto competirem, mostrar os dois com data e hora e perguntar — não chutar o
mais recente.

### 3. Escolher o diretório certo

Enquanto existir só o `indica-app`, não há escolha a fazer. Quando houver
worktree, todos compartilham o slug `pablocarvalho0-indica-app` (ele vem do
remote, não do nome da pasta), então a regra é:

- Um diretório só → usa ele.
- Vários → escolher aquele cuja **branch atual bate com a branch do
  checkpoint** (o `--descobrir` mostra as duas).
- Nenhuma branch bate → perguntar. Pode significar que o worktree foi removido
  ou que ele trocou de branch depois de salvar.

### 4. Fixar ou não fixar o checkpoint

Isso decide o formato da linha no `frentes.conf`:

- O checkpoint escolhido **é o mais recente** do slug → escrever **só o
  diretório**. Assim, quando ele rodar `/context-save` de novo amanhã, a config
  continua correta sozinha, sem passar aqui.
- **Não é o mais recente** (ele quer voltar num anterior) → fixar com
  `diretório | nome-do-arquivo.md`.

Preferir sempre a forma sem pin quando as duas servem. Pin é dívida: congela a
config e obriga a voltar aqui.

### 5. Escrever e gerar

Antes de sobrescrever, mostrar ao Pablo o `frentes.conf` que vai ficar e
confirmar. Preservar o bloco de comentário do topo do arquivo (ele documenta o
formato para quem abrir sem contexto).

```bash
cd "$(git rev-parse --show-toplevel)/scripts-uteis"
./retomar-frentes.sh --checar         # valida antes de gerar
./retomar-frentes.sh --gerar-tasks    # reescreve .vscode/tasks.json
./retomar-frentes.sh                  # confere o resultado final
```

Se o `--checar` reclamar, resolver antes de gerar as tasks. Um `tasks.json`
gerado em cima de config quebrada só descobre o problema amanhã de manhã, que é
exatamente a hora ruim.

### 6. Fechar

Resumir em três linhas: quantas frentes, quais, e a instrução final —
`Ctrl+Shift+B` no `indica-app`. Mencionar `--todas` só se ele não estiver usando
VS Code.

## Variações comuns do pedido

- **"adiciona X às frentes"** / **"tira o Y"** — ler o `frentes.conf` atual,
  alterar só a linha em questão, manter o resto intacto, regerar.
- **"o que tá configurado?"** — só `./retomar-frentes.sh`, sem escrever nada.
- **"limpa tudo"** — deixar o `frentes.conf` só com o cabeçalho de comentário e
  avisar que o `--gerar-tasks` vai falhar com zero frentes (é proposital); o
  `tasks.json` antigo fica no lugar até haver frente nova.
- **"salva o contexto de tudo e configura"** — a skill não roda `/context-save`
  nas outras sessões; ela não tem acesso a elas. Dizer isso e listar quais
  diretórios estão sem checkpoint de hoje, para ele salvar antes de fechar.
- **fechamento do dia** — sempre que a skill rodar, conferir se algum pin do
  `frentes.conf` aponta para um checkpoint que **não é mais o mais recente** do
  slug daquela frente. Se apontar, reapontar o pin para o checkpoint novo — sem
  perguntar, é o comportamento esperado. É o conserto do ciclo: o
  `/context-save` da noite cria arquivo novo mas não toca no `frentes.conf`,
  então pin desatualizado faria o terminal da manhã restaurar o estado do dia
  anterior. Dizer numa linha quais pins foram movidos.

## Quando o pin é obrigatório (não é dívida)

A regra "pin é dívida" vale enquanto o slug tiver **um** diretório. Ela
**inverte** assim que nascer o primeiro worktree: a função `checkpoint_de()` do
`retomar-frentes.sh` resolve o "mais recente" com `sort -r | head -1` sobre o
diretório de checkpoints do slug, então duas linhas sem pin no mesmo slug caem
no **mesmo** arquivo e o Pablo ganha terminais idênticos.

Nesse caso: pinar todas as frentes do slug, e assumir o reapontamento no
fechamento do dia (acima). Criar pasta com outro nome não resolve — o slug sai
do remote do git via `gstack-slug`, não do nome do diretório.

## Contexto de identidade (por que isso é frágil aqui)

O slug do Indica é `pablocarvalho0-indica-app`, derivado do remote
`pablocarvalho0/indica-app`. Isso só é verdade porque a raiz `study-code`
**não** tem marcador de projeto próprio.

O `gstack-slug` resolve o projeto pelo marcador forte **mais externo** da cadeia
de diretórios (`gstack-slug:70`, `:108-112`) — `.git`, `package.json`,
`pyproject.toml`, `Cargo.toml`, `Gemfile`, `go.mod`, `.project.yaml`. Até
19/08/2026 existia um `study-code/package.json` (só pra hospedar o ESLint dos
estudos), e ele vencia o `.git` do Indica: **todo** checkpoint do repo caía no
balde `study-code`, misturado com os outros projetos de estudo. Foi removido; o
ESLint continua funcionando via `study-code/eslint.config.mjs` + o
`node_modules/` da raiz, que não são marcadores.

Consequência prática, e o motivo desta seção existir: **se um `package.json`
reaparecer em `study-code/`, o slug colapsa de novo** e as frentes passam a
apontar pro balde errado. Um `npm install` rodado por engano na raiz recria o
arquivo. Se acontecer:

```bash
RAIZ="$(git rev-parse --show-toplevel)"        # a pasta do indica-app
rm "$(dirname "$RAIZ")/package.json"           # o marcador intruso na pasta-mãe

# A entrada do cache é o caminho absoluto com "/" trocado por "_".
rm -f "$HOME/.gstack/slug-cache/$(printf %s "$RAIZ" | tr / _)"

cd "$RAIZ" && ~/.claude/skills/gstack/bin/gstack-slug   # deve reimprimir o slug do repo
```

Apagar a entrada do cache não é opcional. O cache de slug é *sticky* de propósito
(`gstack-slug:122-141`): ele só se auto-cura quando o valor cacheado é igual ao
basename do diretório, e `study-code` ≠ `indica-app`, então sem apagar a entrada
à mão a remoção do `package.json` não muda nada.
