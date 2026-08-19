# Indica — instruções para agentes de IA

Este arquivo é lido automaticamente por agentes de código (Claude Code e similares) ao abrir o repositório. Ele existe para que qualquer pessoa consiga trabalhar aqui via LLM sem quebrar as decisões que já foram tomadas.

**Humano contribuindo:** o fluxo de branch/PR está em [`CONTRIBUTING.md`](CONTRIBUTING.md). O produto está em [`docs/idea.md`](docs/idea.md).

---

## O projeto em três linhas

Indica é uma lista pública e curada de oportunidades que circulam por **indicação** (não por campanha de campus) para universitários de faculdades seletivas no Brasil. Sem login, leitura aberta, curadoria fechada.

A **fonte de verdade do escopo é [`docs/idea.md`](docs/idea.md)** — leia antes de propor qualquer feature. Ele traz a dor, o critério de admissão de oportunidade, os campos da entidade `oportunidade`, o que está na v0 e o que ficou de fora de propósito.

## Stack decidida

Aplicação fullstack: **Next.js** (App Router) + **React** + **Tailwind CSS**, dados em **Postgres** com **Drizzle ORM**. Deploy futuro em **Vercel** + **Supabase**.

Variáveis de ambiente: copie `.env.example` para `.env` e preencha. Ao criar uma variável nova, **adicione o placeholder no `.env.example` no mesmo commit** — variável que só existe na máquina de um dev quebra a de todos os outros. Migração do Drizzle é código: vai versionada.

## Estado atual do repositório

**Este arquivo não afirma o que existe no repo — ele diz como descobrir.** Afirmação de estado envelhece no primeiro commit seguinte, e estado obsoleto aqui é pior que estado ausente: você o leria como autoridade, sem desconfiar.

Onde olhar: [`CHANGELOG.md`](CHANGELOG.md) conta o que mudou e em que release; o fonte confirma. `ls`, `cat package.json`, `git log` — olhe primeiro, sempre.

Consequência prática: não sugira `npm run dev` antes de existir script, não documente rota, comando ou variável que o código não suporta.

---

## Regras duras (não negociáveis)

1. **Nunca commitar ou dar push na `main`.** Sempre branch + PR. Só o Pablo mergeia.
2. **Não dar `git push`, abrir PR ou criar issue sem o humano pedir explicitamente.** Commitar local quando pedido, sim. Publicar, só sob pedido.
3. **Zero dado pessoal de terceiro** no repositório — em código, seed, teste, fixture, comentário, print ou mensagem de commit. Nome real, telefone, e-mail, currículo, print de WhatsApp: nada. Dado de exemplo tem que ser obviamente fictício.
4. **Nenhum contato de dono de vaga sem autorização explícita dele.** Regra de produto: sem autorização, o modo de candidatura vira "via ponte" (§6 do `docs/idea.md`).
5. **Nenhuma credencial versionada.** Chave de API, `service_role` do Supabase, token, URL com segredo. `.env` no `.gitignore`, sempre.
6. **Não inventar dado.** Sem métrica, número de usuário, nome de cliente ou vaga fictícia apresentada como real. Se não souber, diga que não sabe.

## Antes de implementar qualquer coisa

Passe por este filtro — ele economiza trabalho jogado fora:

- **Está na v0?** Se aparece na lista "Fora da v0" do `docs/idea.md` (login, perfil, candidatura interna, upload de currículo, submissão aberta, comentários, busca full-text, alerta por e-mail, dashboard), **não implemente**. Abra a discussão antes.
- **Respeita o requisito dos 60 segundos?** Cadastrar uma oportunidade tem que levar menos de um minuto. É requisito de produto, não de UX: fadiga de admin é o principal modo de falha do projeto. Campo obrigatório novo precisa de justificativa forte.
- **Aumenta a superfície sem necessidade?** A v0 é deliberadamente pequena. Nova dependência, nova tabela, nova abstração: só com dor concreta que a justifique. Prematuro é mais caro que faltando.
- **A decisão é do Pablo?** Escopo, posicionamento, nome, stack, domínio, monetização: apresente opções com trade-off e recomendação, não decida sozinho.

## Decisões ainda abertas — pergunte, não escolha

- **Como proteger a área administrativa.** A v0 não tem login de usuário, mas o cadastro de oportunidade precisa de alguma barreira. Ainda não decidido — não escolha o mecanismo sozinho.
- **Formato do canal de push** (WhatsApp, lista de transmissão, newsletter).
- **Domínio próprio** — adiado de propósito; v0 sobe em subdomínio.

Estrutura de pastas, biblioteca de UI e ferramenta de teste ainda não têm decisão registrada: proponha com trade-off antes de espalhar o padrão pelo projeto.

Se a tarefa depende de uma dessas, faça tudo o que não depende e pergunte no ponto exato onde travou.

---

## Convenções

**Idioma: português do Brasil, sem exceção.** Commits, PRs, issues, documentação, comentários de código, nome de branch, mensagem de erro exibida ao usuário. O vocabulário de domínio segue o `docs/idea.md` (`oportunidade`, `faculdade`, `quem trouxe`, `via ponte`) — manter o mesmo nome no schema, no código e na conversa evita tradução mental. Palavra-chave de linguagem e API de biblioteca, claro, ficam como são.

**Commits.** Prefixo convencional (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`) e descrição curta. Quando a mudança merecer, o corpo explica o **porquê**, não o quê — o diff já mostra o quê. Commits pequenos. Nunca `wip`: se a mensagem não sai com honestidade, a decisão ainda não está fechada.

**Branches.** `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/` + nome curto em kebab-case.

**Documentação.** Cada doc tem um papel e não invade o do outro: `docs/idea.md` é produto e raciocínio, `docs/spec-v0.md` é a spec técnica com as decisões travadas, `CHANGELOG.md` é o que mudou e o estado atual, este arquivo é regra e convenção. Se uma decisão mudar, **atualize o trecho e registre o motivo** — não reescreva por cima nem deixe o doc contradizendo o código. Nunca documente comando ou rota que o código não suporta: confira contra o fonte antes de escrever.

**Toda mudança alimenta o `CHANGELOG.md`, no PR — não na véspera do release.** Escreva na seção `[Não lançado]`, na categoria certa (`Adicionado`, `Alterado`, `Corrigido`, `Removido`, `Depreciado`, `Segurança`). Doc de release reconstruída depois é doc reconstruída de memória, e o que se perde primeiro é o porquê. Exceção honesta: mudança sem efeito observável de fora (formatação, comentário) não precisa de entrada.

**Higiene.** Antes de qualquer commit, `git status`. Fora do repo: `node_modules/`, `.env*`, `dist/`, `.next/`, `*.log`, `.claude/settings.local.json`.

## Como se comunicar aqui

Direto e sem enfeite. Prosa curta, bullet só quando a informação é genuinamente listável. Se discordar de um pedido por um motivo técnico ou de escopo, **diga em uma ou duas frases e siga** — capacidade crítica é bem-vinda, sermão não. Reporte o que aconteceu de verdade: se um teste falhou, mostre a saída; se pulou uma etapa, diga qual.
