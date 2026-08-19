# Indica — Spec técnica da v0

> Documento de engenharia. Deriva de [`docs/idea.md`](idea.md), que continua sendo a
> fonte de verdade do produto. Onde os dois divergirem, o `idea.md` vence no *o quê*
> e esta spec vence no *como* — as divergências deliberadas estão listadas na §12.
>
> Autor: Pablo · Agosto/2026 · Estado: aguardando `plan-eng-review` e `plan-design-review`

---

## 1. Contexto

Oportunidade que circula por indicação some rápido: fecha em 5 a 10 dias e nunca
aparece em canal aberto. Quem está no grupo de WhatsApp certo recebe o link com
contexto junto; quem não está, não recebe nada. O Indica reúne essas oportunidades
numa lista pública ordenada por recência, com curadoria fechada.

Hoje o repositório tem só documentação. Não existe aplicação, `package.json`,
dependência ou comando de execução — verificado por `git ls-files`, que retorna
cinco arquivos: `.env.example`, `.gitignore`, `CLAUDE.md`, `CONTRIBUTING.md` e
`docs/idea.md`.

O "por que agora" é operacional, não técnico: juntar as 25 a 30 oportunidades
necessárias para lançar leva semanas de calendário, e a coleta roda em paralelo ao
código desde o dia 1 (§5 do `idea.md`). O schema precisa existir cedo para ser
validado com dado real antes de haver migração para desfazer.

**Definição de pronto da v0**, herdada da §5 do `idea.md` e não negociável:
cadastrar uma oportunidade em menos de 60 segundos, e um amigo conseguir filtrar por
área e clicar no link, no celular, sem explicação.

---

## 2. Estado atual verificado

| Item | Estado | Como foi verificado |
|---|---|---|
| Aplicação | Não existe | `git ls-files` — 5 arquivos, nenhum de código |
| `package.json` | Não existe | `ls package.json` retorna erro |
| `.gitignore` | Existe e já cobre Next.js, Drizzle, Supabase, Vercel, Playwright | leitura do arquivo |
| `.env.example` | Existe, mas declara variáveis que nada lê (§12) | leitura do arquivo |
| Node | v22.23.1 | `node -v` |
| Docker | 29.7.2 | `docker --version` |
| Remote | `pablocarvalho0/indica-app`, **público** | `git remote -v`, `gh repo view` |
| Issues abertas | 0 | `gh issue list` |

Consequência de o repositório ser público: schema, seed, teste e exemplo são leitura
aberta. Nenhum dado de pessoa real entra em nenhum deles.

---

## 3. Stack e o porquê de cada peça

| Camada | Escolha | Por quê |
|---|---|---|
| App | Next.js (App Router), TypeScript | Deploy alvo é a Vercel. Um app só elimina CORS, segundo serviço e segundo pipeline. A renderização no servidor entrega a lista pronta no primeiro byte, o que importa no celular e para indexação. |
| UI | React + Tailwind CSS | Já vêm no scaffold do Next. Tailwind evita arquivo de CSS paralelo num projeto de poucas telas. |
| API | Route Handlers + Server Actions | Não há cliente externo consumindo a API na v0. Server Action em formulário funciona sem JavaScript no cliente, o que mantém a lista e o admin utilizáveis em conexão ruim. |
| ORM | Drizzle + drizzle-kit | Schema em TypeScript vira tipo do app sem geração de código paralela. Migração é SQL versionado e legível, não caixa-preta. |
| Banco | PostgreSQL | Supabase é Postgres gerenciado, então dev e produção rodam o mesmo banco. |
| Dev | docker-compose com imagem oficial `postgres` + volume nomeado | Ambiente reproduzível, offline, sem consumir o free tier do Supabase enquanto o schema ainda muda toda semana. |
| Testes | Vitest | Um runner só para unidade e integração, sem configuração extra sobre o TypeScript. |
| Produção | Vercel + Supabase | §3 do `idea.md`. Grátis no volume esperado. |

**Versões:** fixar no momento do scaffold com `npm view <pacote> version`. Esta spec
não fixa número de versão de propósito — número inventado em documento é dívida que
alguém descobre quebrada três meses depois.

**Driver de conexão:** `postgres` (postgres.js), que é o driver que o Drizzle
recomenda para Postgres e funciona atrás do pooler do Supabase. Em serverless com
pooler em modo transaction é obrigatório desligar prepared statements
(`prepare: false`) — sem isso a conexão quebra de forma intermitente e difícil de
diagnosticar.

---

## 4. Decisões travadas (com o porquê)

Estas foram decididas em conversa e não devem ser reabertas sem motivo novo. Estão
aqui para que o `plan-eng-review` tenha o que atacar.

**D1 — O banco guarda só o rótulo público de quem trouxe.**
A coluna é `quem_trouxe_exibicao`: o texto já pronto para a tela (`"Ana P. · Insper"`,
`"Anônimo"`). O nome completo de quem pediu anonimato não existe em lugar nenhum do
sistema. Propriedade resultante, fácil de auditar e de defender num repo aberto: *o
banco só contém o que já está na página pública*. Custo aceito: trocar o modo de
exibição depois exige redigitar o rótulo.

**D2 — Estado de exibição é derivado na consulta, não guardado.**
Três colunas (`publicado_em`, `despublicado_em`, `prazo`) e um único predicado
decidem se a oportunidade aparece. Não existe cron, então não existe job quebrado em
silêncio deixando vaga morta na lista — que é o risco "lista apodrece" da §8 do
`idea.md`. Custo aceito: o predicado precisa ser centralizado numa função só, para
não vazar cópia divergente pelo código.

**D3 — `area` é enum do Postgres; `faculdade_alvo` é texto validado no app.**
A lista de áreas está fechada no `idea.md` e não muda. A lista de faculdades cresce a
cada bolha nova coberta, e exigir migração + deploy para cadastrar a primeira vaga da
UFRJ é atrito de admin — o modo de falha número 1 do projeto. O filtro já precisa
consultar quais faculdades têm item vivo, então a lista da tela sai do dado real de
qualquer jeito.

**D4 — Clique vira linha numa tabela `clique`, com `oportunidade_id` e `criado_em`.**
Sem IP, sem cookie, sem user-agent — o produto promete não ter login e não vai
rastrear leitor anônimo pela porta dos fundos. Só INSERT, então não disputa trava com
a linha que a lista pública está lendo. Preserva a dimensão temporal, que é o que
responde se o clique veio no dia da publicação ou pingou a semana toda.

**D5 — Filtros por query string, renderizados no servidor.**
`/?area=vc_pe&faculdade=Insper`. URL compartilhável, funciona sem JavaScript, e o
estado do filtro não precisa de biblioteca de estado no cliente.

**D6 — Toda saída passa por `/vai/[id]`.**
Necessário para contar o clique (D4), e tem um efeito colateral bom: contato de
pessoa não fica no HTML da listagem, o que derruba a maior parte da coleta automática
de e-mail e telefone. Detalhe em §6.2.

**D7 — Autenticação do admin: senha única em variável de ambiente + cookie assinado.**
Sem tabela de usuário, sem PII, cerca de 60 linhas. Descartável inteiro quando a
Fase 3 (embaixadores) chegar e trouxer papéis de verdade.

**D8 — Testes: Vitest para unidade e integração; nada de e2e na v0.**
A integração roda contra o Postgres do Docker, que é o mesmo banco de produção. E2E
com navegador exige subir app + banco + fixture em CI para cobrir três telas — custo
alto para o retorno neste tamanho. Entra quando houver fluxo com estado suficiente
para justificar.

---

## 5. Modelo de dados

### 5.1 Tipos

```sql
CREATE TYPE tipo_oportunidade AS ENUM ('vaga', 'off_cycle', 'programa', 'freela');

CREATE TYPE area_oportunidade AS ENUM (
  'mercado_financeiro', 'vc_pe', 'tech_dev', 'produto', 'dados', 'consultoria', 'outros'
);

CREATE TYPE modo_candidatura AS ENUM (
  'link_publico', 'via_ponte', 'contato_direto_autorizado'
);
```

`formato` (estágio · CLT · PJ · projeto) fica como texto validado no app, junto com
`faculdade_alvo`: é opcional, não filtra nada na v0 e não vale um tipo no banco.

### 5.2 Tabela `oportunidade`

```sql
CREATE TABLE oportunidade (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- identidade
  titulo                   text NOT NULL,
  organizacao              text NOT NULL,
  tipo                     tipo_oportunidade NOT NULL,
  area                     area_oportunidade NOT NULL,

  -- opcionais de contexto
  formato                  text,
  local                    text,
  faculdade_alvo           text,          -- NULL = aberta a todas
  remuneracao              text,          -- faixa livre: "R$ 3.000–4.000", "a combinar"
  contexto                 text,          -- "o que você precisa saber"

  -- candidatura
  modo                     modo_candidatura NOT NULL,
  destino                  text NOT NULL, -- URL se link_publico; contato nos demais modos
  autorizacao_confirmada   boolean NOT NULL DEFAULT false,

  -- crédito
  quem_trouxe_exibicao     text NOT NULL, -- rótulo já pronto para a tela

  -- ciclo de vida
  prazo                    date,          -- NULL = sem prazo
  publicado_em             timestamptz NOT NULL DEFAULT now(),
  despublicado_em          timestamptz,   -- NULL = publicada
  criado_em                timestamptz NOT NULL DEFAULT now(),
  atualizado_em            timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT contato_direto_exige_autorizacao CHECK (
    modo <> 'contato_direto_autorizado' OR autorizacao_confirmada
  )
);

CREATE INDEX oportunidade_publicado_em_idx ON oportunidade (publicado_em DESC);
```

Três coisas merecem explicação.

**`id` é uuid, não serial.** Link de saída é compartilhado por WhatsApp e sobrevive à
oportunidade. Com id sequencial, um item apagado e outro criado depois podem reusar a
faixa e um link antigo passa a apontar para vaga errada. Com uuid isso não acontece.

**A `CHECK` que amarra `contato_direto_autorizado` a `autorizacao_confirmada`.** É a
regra 4 do `CLAUDE.md` ("nenhum contato de dono de vaga sem autorização explícita")
escrita no banco em vez de confiada à disciplina de quem preenche o formulário. Uma
regra de produto que só existe na cabeça de uma pessoa é uma regra que vaza numa noite
corrida. Vale a linha de SQL.

**Um índice só.** Com trinta linhas, índice é decoração — o Postgres faz varredura
completa mais rápido do que percorre a árvore. O de `publicado_em DESC` entra porque
é a ordenação de toda página da lista. Os outros esperam dor medida.

### 5.3 Tabela `clique`

```sql
CREATE TABLE clique (
  id               bigserial PRIMARY KEY,
  oportunidade_id  uuid NOT NULL REFERENCES oportunidade(id) ON DELETE CASCADE,
  criado_em        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX clique_oportunidade_idx ON clique (oportunidade_id);
```

Sem IP, sem user-agent, sem cookie, sem identificador de sessão. Se um dia alguém
propuser adicionar um desses, a pergunta a fazer antes é qual decisão de produto o
dado destrava — e a resposta precisa ser melhor do que "pode ser útil depois".

### 5.4 O predicado de "está viva"

Uma definição, um lugar, importada por todo mundo que lista oportunidade:

```sql
despublicado_em IS NULL AND (prazo IS NULL OR prazo >= CURRENT_DATE)
```

No código, isso vira uma única função em `db/consultas.ts`. Duplicar esse predicado
inline em uma segunda consulta é o bug mais provável desta spec inteira: as duas
cópias divergem, a lista pública e o admin discordam sobre o que está no ar, e nenhum
teste percebe.

---

## 6. Superfície da aplicação

### 6.1 Rotas públicas

| Rota | Tipo | O que faz |
|---|---|---|
| `/` | Página (servidor) | Lista viva, ordenada por `publicado_em DESC`. Lê `?area=` e `?faculdade=`. |
| `/vai/[id]` | Route Handler (GET) | Registra o clique e redireciona. Ver 6.2. |
| `/ponte/[id]` | Página (servidor) | Mostra o contato quando a candidatura não é por link público. |

Card da lista mostra, nesta ordem de peso visual: título, organização, o bloco
"o que você precisa saber" quando existe, remuneração quando existe, área, local,
prazo, quem trouxe e data de publicação. O layout fino é assunto do
`plan-design-review` — a spec fixa o conteúdo, não a forma.

**Filtro que retornaria vazio não aparece** (§5 do `idea.md`). As opções de área e de
faculdade são calculadas a partir das oportunidades vivas, não de uma lista fixa. Sai
de graça no caso de `faculdade_alvo`, que já é texto livre por D3.

### 6.2 A rota de saída

`GET /vai/[id]`:

1. Busca a oportunidade. Se não existe, ou não está viva pelo predicado de 5.4:
   responde **404**. Link antigo não vira redirect eterno para vaga morta.
2. `INSERT INTO clique`.
3. Se `modo = 'link_publico'` → **302** para `destino`.
4. Caso contrário → **302** para `/ponte/[id]`, que renderiza o contato e explica em
   uma frase o que fazer com ele ("fale com quem trouxe — a indicação parte dele").

O contador conta a intenção de se candidatar em todos os três modos, não só no link
público. Consequência para a métrica: o número é *cliques no botão de candidatura*,
não *conversões*, e a §7 do `idea.md` já o trata assim.

O link no card é uma tag `<a>` comum, **não** o componente `Link` do Next. O `Link`
faz prefetch, e prefetch numa rota que escreve no banco inventa clique que ninguém
deu. Isso vale um comentário no código, porque é o tipo de coisa que alguém
"corrige" de boa-fé seis meses depois.

### 6.3 Rotas de admin

| Rota | Tipo | O que faz |
|---|---|---|
| `/admin/login` | Página + Server Action | Formulário de senha. |
| `/admin` | Página (servidor) | Tudo: viva, vencida e despublicada. No topo, "vence essa semana". Contagem de cliques por item. |
| `/admin/nova` | Página + Server Action | Cadastro. É a tela do requisito dos 60 segundos. |
| `/admin/[id]/editar` | Página + Server Action | Edição, despublicar e republicar. |

Mutação por Server Action e não por Route Handler: o formulário funciona com
JavaScript desligado, a validação roda no servidor por definição, e não existe
endpoint público de escrita para alguém achar.

### 6.4 O formulário de 60 segundos

O requisito é de produto, então o desenho do formulário é decisão de spec, não de
implementação:

- **Cinco campos obrigatórios, nesta ordem:** título, organização, tipo, área, e o
  par modo + destino. `quem_trouxe_exibicao` é obrigatório mas quase sempre repetido —
  ver o parágrafo seguinte.
- **Tudo o mais é opcional e fica abaixo de uma divisória visual**, sem sanfona: item
  escondido atrás de clique é item que ninguém preenche.
- **Sem passo múltiplo, sem wizard.** Uma tela, um botão.
- **`quem_trouxe_exibicao` tem três botões que montam o rótulo** a partir do que você
  digitar: nome completo · primeiro nome + faculdade · anônimo. O que vai para o banco
  é o resultado, nunca o insumo (D1).
- **`autorizacao_confirmada` é um checkbox que só aparece** ao escolher
  "contato direto autorizado", com o texto explícito de que você confirmou a
  autorização com o dono da vaga.

**Critério mensurável:** cronometrar o cadastro de uma oportunidade real, do clique em
"nova" até a lista atualizada. Se passar de 60 segundos, o formulário está errado —
não o cronômetro.

### 6.5 Autenticação

```
POST /admin/login (Server Action)
  compara ADMIN_SENHA em tempo constante
  → cookie "indica_sessao": httpOnly, secure, sameSite=lax, 30 dias
     valor = base64url({exp}) + "." + HMAC-SHA256(payload, SESSAO_SEGREDO)

middleware.ts, matcher /admin/:path*
  cookie ausente, assinatura inválida ou exp vencido → 302 /admin/login
```

Dois detalhes que economizam uma tarde de depuração:

**Assinar com Web Crypto (`crypto.subtle`), não com `node:crypto`.** O middleware do
Next roda no Edge Runtime, onde o módulo `node:crypto` não existe. Escrever o
verificador com Web Crypto desde o começo evita ter o código funcionando em dev e
quebrando no deploy.

**Sem rate limit no login, de propósito.** Em serverless não existe memória
compartilhada entre invocações, então contador em memória não funciona, e trazer
Redis para proteger uma única senha é desproporcional. A defesa é entropia: o
`.env.example` instrui a gerar a senha com `openssl rand -base64 24`. Força bruta pela
rede contra 128 bits não é a ameaça real deste projeto. Se um dia houver mais de um
admin, isso muda junto com a Fase 3.

---

## 7. Fatias de entrega

Uma fatia por PR. Cada uma termina com algo verificável rodando.

```
F0 Fundação ──> F1 Schema e seed ──┬──> F2 Lista pública ──> F3 Saída e contador ──┐
                                   │                                               ├──> F6 Deploy
                                   └──> F4 Auth admin ──> F5 Admin CRUD ───────────┘
```

**Por que esta ordem.** F1 vem cedo porque o schema precisa encarar dado real de
coleta antes de existir migração para desfazer. F2 vem antes de F5 porque a lista é o
produto — se ela não convence, o admin não precisa existir. F3 depende de F2 porque
não há de onde clicar antes. F4 é pré-requisito de F5 e não o contrário: admin sem
porta na frente, mesmo por uma hora, é admin aberto na internet.

### F0 — Fundação
Scaffold do Next com TypeScript e Tailwind, `docker-compose.yml` com Postgres e volume
nomeado, `drizzle.config.ts`, Vitest configurado, `.env.example` enxugado (§12),
`README.md` com os comandos que existem de verdade.
**Pronto quando:** `docker compose up -d` sobe o banco, `npm run dev` responde em
`localhost:3000`, `npm test` passa.

### F1 — Schema e seed
`db/schema.ts` com as duas tabelas e os três enums, primeira migração gerada pelo
drizzle-kit, `db/consultas.ts` com o predicado de 5.4, e um seed com 8 a 10 itens
**obviamente fictícios** (`Fundo Alpha`, `Startup Beta`, `contato@exemplo.invalid`).
**Pronto quando:** a migração aplica limpa num banco zerado, o seed roda duas vezes
sem quebrar, e um teste de integração lê o que foi semeado.

### F2 — Lista pública
`/` renderizada no servidor, card, filtros por query string, filtro vazio omitido,
ordenação por recência, layout mobile-first.
**Pronto quando:** os critérios 1 a 6 da §8 passam.

### F3 — Saída e contador
`/vai/[id]` e `/ponte/[id]`, tabela `clique` em uso.
**Pronto quando:** os critérios 7 a 10 passam.

### F4 — Autenticação do admin
`middleware.ts`, `/admin/login`, logout, assinatura e verificação do cookie.
**Pronto quando:** os critérios 11 a 13 passam.

### F5 — Admin CRUD
`/admin`, `/admin/nova`, `/admin/[id]/editar`, despublicar e republicar,
"vence essa semana", contagem de cliques.
**Pronto quando:** os critérios 14 a 18 passam, incluindo o cronômetro dos 60 segundos.

### F6 — Deploy
Projeto no Supabase, migrações aplicadas em produção pela `DATABASE_URL_UNPOOLED`,
variáveis configuradas na Vercel, `DATABASE_URL` apontando para o pooler com
`prepare: false`, subdomínio no ar.
**Pronto quando:** os critérios 19 a 21 passam.

---

## 8. Critérios de aceite

Numerados, cada um passa ou falha.

**Lista pública**
1. `/` lista apenas oportunidades com `despublicado_em IS NULL` e (`prazo IS NULL` ou `prazo >= CURRENT_DATE`).
2. A ordenação é `publicado_em DESC`, sem exceção nem destaque.
3. `?area=vc_pe` retorna só as de VC/PE; `?faculdade=Insper` só as com essa `faculdade_alvo`; os dois juntos aplicam as duas condições.
4. Uma opção de filtro que não tem nenhum item vivo não é renderizada.
5. O card mostra data de publicação, prazo (quando existe), quem trouxe e o bloco de contexto (quando existe).
6. A página renderiza a lista completa com JavaScript desligado no navegador.

**Saída e contador**
7. `GET /vai/[id]` de item vivo com `modo = link_publico` responde 302 com `Location` igual ao `destino`.
8. `GET /vai/[id]` de item vivo nos outros dois modos responde 302 para `/ponte/[id]`, que exibe o contato.
9. Cada `GET /vai/[id]` de item vivo insere exatamente uma linha em `clique`.
10. `GET /vai/[id]` de item inexistente, despublicado ou vencido responde 404 e **não** insere linha em `clique`.

**Autenticação**
11. `GET /admin` sem cookie válido responde 302 para `/admin/login`.
12. Cookie com assinatura adulterada é rejeitado como se não existisse.
13. Cookie com `exp` no passado é rejeitado.

**Admin**
14. `/admin` lista viva, vencida e despublicada, cada uma identificável por rótulo próprio.
15. O bloco "vence essa semana" mostra os itens com `prazo` entre hoje e hoje mais 7 dias.
16. Cada linha mostra a contagem de cliques do item.
17. Despublicar preenche `despublicado_em` e o item some de `/` na requisição seguinte; republicar limpa a coluna e o item volta.
18. Cadastrar uma oportunidade real leva menos de 60 segundos cronometrados, do clique em "nova" até vê-la em `/`.

**Deploy**
19. As mesmas migrações do dev aplicam no Supabase sem edição manual.
20. O app em produção lê e escreve pelo pooler sem erro de prepared statement sob requisições consecutivas.
21. `grep -rn "process.env" .` não encontra nenhuma variável ausente do `.env.example`.

**Transversais**
22. Testes escritos e passando conforme §9.
23. Nenhum dado de pessoa real em schema, seed, teste, fixture ou comentário.
24. `git ls-files` não retorna `.env`, `node_modules/`, `.next/` nem arquivo de log.

---

## 9. Plano de testes

| Camada | O que | Quantidade |
|---|---|---|
| Unidade | Predicado de "está viva" nas quatro combinações de `prazo` e `despublicado_em`; rótulo de prazo ("vence hoje", "faltam 3 dias"); montagem do rótulo de quem trouxe nos três modos; assinatura e verificação do cookie (válido, adulterado, vencido); validação do formulário | +12 |
| Integração (Vitest contra o Postgres do Docker) | Consulta da lista sem filtro, com um filtro e com os dois; opções de filtro omitem valor sem item vivo; `/vai/[id]` insere clique e redireciona; `/vai/[id]` de item morto dá 404 sem inserir; a `CHECK` rejeita `contato_direto_autorizado` sem autorização; despublicar e republicar | +9 |
| E2E | Fora da v0 — ver D8 | 0 |

O banco de teste é um segundo database no mesmo container, com as migrações aplicadas
e truncado entre suítes. Rodar teste contra o banco de desenvolvimento apaga a coleta
manual, que é justamente o dado mais caro de reproduzir neste projeto.

---

## 10. Estimativa de esforço

| Fatia | Humano sozinho | Com Claude Code |
|---|---|---|
| F0 Fundação | ~2h | ~15 min |
| F1 Schema e seed | ~3h | ~25 min |
| F2 Lista pública | ~5h | ~45 min |
| F3 Saída e contador | ~2h | ~20 min |
| F4 Auth admin | ~3h | ~25 min |
| F5 Admin CRUD | ~6h | ~50 min |
| F6 Deploy | ~2h | ~30 min (limitado por espera de plataforma) |
| **Total** | **~23h** | **~3h30** |

Números de trabalho de código. Não incluem o `plan-design-review`, os ajustes de
layout que vierem dele, nem a coleta das 25 a 30 oportunidades — que é semanas de
calendário e é o caminho crítico real do lançamento.

---

## 11. Plano de rollback

| Situação | Como desfazer |
|---|---|
| Fatia quebrada antes do merge | A branch não entrou na `main`. Fechar o PR. |
| Regressão em produção | Redeploy do deployment anterior na Vercel, que é instantâneo e não toca no banco. |
| Migração ruim | Cada migração vai com um `.down` ou com o SQL inverso registrado no PR. Antes de rodar migração em produção, dump do Supabase — com trinta linhas o dump é instantâneo e não há desculpa para pular. |
| Vazamento de segredo | Rotacionar `ADMIN_SENHA` e `SESSAO_SEGREDO` na Vercel; trocar `SESSAO_SEGREDO` já invalida toda sessão existente. Se a `DATABASE_URL` vazar, rotacionar a senha do banco no Supabase. |
| Oportunidade publicada por engano | Despublicar pelo admin; sai da lista na requisição seguinte. |

---

## 12. Divergências deliberadas em relação ao `idea.md` e ao `.env.example`

Registradas aqui em vez de aplicadas em silêncio. Nenhuma foi feita no `idea.md`
ainda — decisão sua.

**1. O campo "exibição de quem trouxe" não vira coluna.** A tabela da §4 do `idea.md`
lista `exibição de quem trouxe` como campo obrigatório. Por D1, a escolha acontece no
formulário e o que persiste é só o rótulo montado. O campo continua existindo como
decisão de cadastro; deixa de existir como coluna.

**2. "link ou contato" e o contato da ponte são a mesma coluna `destino`.** O
`idea.md` já os trata como um campo só, cujo significado o modo define. Duas colunas
seriam sempre uma vazia.

**3. `autorizacao_confirmada` é campo novo, fora da tabela da §4.** Justificativa em
5.2: transforma uma regra dura do `CLAUDE.md` em restrição do banco. Não aparece na
tela pública e não custa tempo de cadastro (só existe num dos três modos).

**4. O `.env.example` declara três variáveis que a v0 não lê.**
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e
`SUPABASE_SERVICE_ROLE_KEY` só fazem sentido com o cliente JavaScript do Supabase,
que a v0 não usa — o Drizzle fala Postgres direto. Manter placeholder de variável que
nada consome é exatamente o que a regra "não documente o que o código não suporta"
proíbe, e a chave de serviço no arquivo é um convite a alguém colar o valor real ali
um dia. Proposta: o `.env.example` da v0 fica com `DATABASE_URL`,
`DATABASE_URL_UNPOOLED`, `NEXT_PUBLIC_APP_URL`, `ADMIN_SENHA` e `SESSAO_SEGREDO`. As
três voltam no dia em que algo importar `@supabase/supabase-js`.

**5. A §9 do `idea.md` ("Em aberto") perdeu um item.** "Framework e linguagem" está
decidido nesta spec, com o porquê na §3. Os dois itens que continuam abertos são o
formato do canal de push e o domínio próprio, e nenhum dos dois bloqueia código.

---

## 13. Fora do escopo

Confirmando a lista da §4 do `idea.md`, nenhum destes entra na v0: login de usuário,
perfil, candidatura dentro do app, upload de currículo, submissão aberta com fila de
curadoria, comentários, busca full-text, alerta por e-mail, dashboard de analytics.

Somando o que esta spec decide não fazer, com o gatilho que faria mudar de ideia:

| Fora agora | O que faria entrar |
|---|---|
| Testes e2e com navegador | Um fluxo com estado real de várias telas, ou uma regressão que a integração não pegou |
| Índice além de `publicado_em` | Consulta medida acima de ~200ms, com `EXPLAIN ANALYZE` no PR |
| Rate limit no login | Um segundo admin, ou tentativa de força bruta observada no log |
| Cron de expiração | Necessidade de saber *quando* um item expirou, não só que expirou |
| Cache da lista | Volume que faça a consulta pesar, o que com trinta linhas não acontece |
| Paginação | Passar de ~100 itens vivos |
| Tabela de faculdades | Precisar de nome de exibição, sigla ou ordenação própria |
| Cliente JS do Supabase | Usar Auth, Storage ou Realtime — nenhum dos três na v0 |

---

## 14. Arquivos que a v0 cria

| Arquivo | O que é |
|---|---|
| `package.json` | Dependências e scripts (`dev`, `build`, `test`, `db:generate`, `db:migrate`, `db:seed`) |
| `docker-compose.yml` | Postgres com volume nomeado |
| `drizzle.config.ts` | Aponta para `db/schema.ts` e usa `DATABASE_URL_UNPOOLED` |
| `db/schema.ts` | Tabelas e enums |
| `db/cliente.ts` | Conexão postgres.js com `prepare: false` |
| `db/consultas.ts` | Predicado de "está viva" e as consultas de lista |
| `db/seed.ts` | Dados fictícios |
| `drizzle/` | Migrações SQL versionadas |
| `middleware.ts` | Proteção de `/admin/*` |
| `lib/sessao.ts` | Assinatura e verificação do cookie via Web Crypto |
| `lib/dominio.ts` | Listas de área, tipo, formato e faculdade; montagem do rótulo de quem trouxe |
| `app/page.tsx` | Lista pública |
| `app/vai/[id]/route.ts` | Contador e redirect |
| `app/ponte/[id]/page.tsx` | Exibição de contato |
| `app/admin/**` | Login, listagem, cadastro, edição |
| `components/**` | Card, filtros, formulário |
| `tests/**` | Unidade e integração |
| `README.md` | Como rodar, conferido contra o `package.json` |
| `.env.example` | Atualizado conforme §12.4 |

---

## 15. Próximos passos

1. `plan-eng-review` sobre esta spec — os alvos mais prováveis são D6 (o redirect duplo do `/ponte`), a ausência de rate limit em 6.5 e a decisão de D8 de não ter e2e.
2. `plan-design-review` com mockups do card, da lista com filtros e do formulário de cadastro, para atacar visualmente o requisito dos 60 segundos antes de escrever componente.
3. Aplicar as divergências da §12 no `idea.md` e no `.env.example`, se aprovadas.
4. F0.
