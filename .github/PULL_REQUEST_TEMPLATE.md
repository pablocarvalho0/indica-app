## O que muda

<!-- Duas ou três frases. O diff mostra o quê; escreva aqui o porquê. -->

## Como testei

<!-- O que você rodou de verdade e o que viu. Se não testou, diga que não testou. -->

---

## Documentação

Quatro itens, e são quatro de propósito: checklist longo vira clique automático.
Item que não se aplica, marque e escreva o motivo numa linha — a resposta "não
se aplica" é informação, deixar em branco não é.

- [ ] **`CHANGELOG.md`** — entrada em `[Não lançado]`, na categoria certa.
- [ ] **`CLAUDE.md`** ainda é verdadeiro depois deste PR? Regra nova, convenção
      alterada, decisão que saiu de "em aberto": tudo isso vive lá.
- [ ] **`docs/idea.md` e `docs/spec-v0.md`** seguem coerentes com o código. Se
      este PR divergiu da spec, a divergência está registrada **com o motivo** —
      não reescrita por cima.
- [ ] **`.env.example`** tem o placeholder de toda variável nova, neste mesmo
      commit. Variável que só existe na máquina de um dev quebra a de todos.

## Antes de pedir revisão

- [ ] `git status` limpo do que não deve subir (`.env`, `node_modules/`,
      `.next/`, `*.log`, `.claude/settings.local.json`).
- [ ] Zero dado pessoal de terceiro em código, seed, fixture, comentário, print
      ou mensagem de commit. Dado de exemplo é obviamente fictício.
- [ ] Nenhuma credencial versionada.
- [ ] Está no escopo da v0 — ou a saída do escopo foi combinada antes.
