# Como contribuir com o Indica

Obrigado por querer ajudar. O fluxo aqui é curto de propósito: **branch → commit → PR para `main` → validação do Pablo**. Nada entra em `main` sem review.

Antes de escrever código, vale ler o [`docs/idea.md`](docs/idea.md) — ele explica o que o produto é, o que está no escopo da v0 e o que ficou **deliberadamente de fora**. A maior parte das dúvidas de "isso faz sentido?" está respondida lá.

> **Estado do repo hoje:** só documentação (`docs/`). Ainda não existe aplicação, então também não existe comando de instalar/rodar. Quando o código entrar, as instruções de execução vão para o `README.md`; este arquivo cuida só do processo de contribuição.

---

## As 4 regras

1. **Nunca commitar direto na `main`.** Sempre uma branch.
2. **Suba o que você quiser** na sua branch — commit quebrado, experimento, rascunho. A branch é sua, ninguém julga.
3. **Toda mudança entra por Pull Request** para `main`.
4. **Só com validação do Pablo o PR é mergeado.** Nem código bom entra sem review — é o que mantém o posicionamento e a curadoria coerentes.

---

## ⭐ O caminho normal: você é colaborador do repo

**Se o Pablo te adicionou como colaborador, esqueça fork.** Você tem permissão de escrita: clona o repositório de verdade, cria a sua branch dentro dele e dá `push` direto. O único lugar onde você **não** escreve é a `main` — ela só recebe merge de PR aprovado.

Esses 6 comandos são o ciclo inteiro. Dá pra colar e seguir:

```bash
git clone https://github.com/pablocarvalho0/indica-app.git   # 0. uma vez só
cd indica-app

git checkout main && git pull origin main                    # 1. partir da main atualizada
git checkout -b feat/minha-ideia                             # 2. abrir a sua branch
#    ... codar o que quiser ...
git add . && git commit -m "feat: minha ideia"               # 3. commitar
git push -u origin feat/minha-ideia                          # 4. subir a branch
gh pr create --base main                                     # 5. abrir o PR e me chamar
```

Pronto — a partir daqui é só esperar o review. O passo a passo abaixo é o mesmo fluxo destrinchado, com as convenções de nome de branch, de mensagem de commit e o que fazer depois do merge.

(Não é colaborador e quer contribuir de fora? O fluxo é idêntico, só muda o começo — ver [Contribuindo de fora](#contribuindo-de-fora-sem-acesso-de-escrita) no fim.)

---

## Passo a passo (é só seguir)

### 0. Uma vez só: clonar o projeto

```bash
git clone https://github.com/pablocarvalho0/indica-app.git
cd indica-app
```

Confere se deu certo — o remote `origin` tem que apontar para o repositório do projeto, e não para um fork seu:

```bash
git remote -v
```

### 1. Antes de começar: pegar a `main` atualizada

```bash
git checkout main
git pull origin main
```

Fazer isso *antes* de criar a branch evita conflito bobo depois.

### 2. Abrir a sua branch

```bash
git checkout -b feat/nome-curto-do-que-voce-vai-fazer
```

Prefixo pelo tipo do trabalho: `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/`. Exemplos reais:

```bash
git checkout -b feat/formulario-nova-oportunidade
git checkout -b fix/expiracao-de-prazo
git checkout -b docs/instrucoes-de-setup
```

### 3. Trabalhar e commitar

```bash
git status                 # o que mudou
git add .                  # ou: git add caminho/do/arquivo
git commit -m "feat: adiciona filtro por área na listagem"
```

Padrão de mensagem: **prefixo convencional + descrição curta em português**. Se a mudança merecer explicação, use o corpo do commit para dizer **o porquê**, não o quê (o diff já mostra o quê):

```bash
git commit -m "feat: adiciona expiração automática por prazo" -m "Item vencido na lista mata a confiança na curadoria. Expirar sozinho evita depender de limpeza manual."
```

Commits pequenos são melhores que um commit gigante. E nada de `wip`: se a mensagem não sai com honestidade, a decisão ainda não está fechada — o que é ótimo motivo para abrir o PR como rascunho e conversar.

### 4. Subir a branch

```bash
git push -u origin feat/nome-curto-do-que-voce-vai-fazer
```

Da segunda vez em diante, na mesma branch, é só `git push`.

### 5. Abrir o Pull Request para `main`

Com o [GitHub CLI](https://cli.github.com):

```bash
gh pr create --base main --title "feat: filtro por área na listagem" --body "O que faz e por quê. Se resolve uma issue, cite: closes #12"
```

Ainda em construção e quer feedback antes de terminar? Abra como rascunho:

```bash
gh pr create --base main --draft --title "feat: filtro por área" --body "Rascunho — quero validar a abordagem antes de seguir."
```

Sem o `gh` instalado, o `git push` já imprime no terminal um link para abrir o PR no navegador. Funciona igual.

### 6. Esperar a validação

O Pablo revisa e uma de três coisas acontece: aprova e mergeia, pede ajuste, ou explica por que aquilo não entra agora (normalmente porque está listado como fora do escopo da v0). Para responder a um pedido de ajuste, é só commitar mais na **mesma branch** e dar `push` — o PR atualiza sozinho, não precisa abrir outro.

```bash
git add .
git commit -m "fix: ajusta o que foi apontado no review"
git push
```

### 7. Depois do merge: limpar

```bash
git checkout main
git pull origin main
git branch -d feat/nome-curto-do-que-voce-vai-fazer
```

---

## O que ajuda o seu PR a ser aprovado rápido

- **Um assunto por PR.** PR que mexe em três coisas independentes demora três vezes mais para revisar.
- **Diga o porquê na descrição.** Qual dor isso resolve, e por que dessa forma e não de outra.
- **Cheque se está no escopo.** Se o que você quer fazer aparece na lista "Fora da v0" do [`docs/idea.md`](docs/idea.md), abra uma issue para discutir antes de escrever o código — evita você trabalhar de graça.
- **Não deixe instrução que o código não suporta.** Se você documentar um comando, rode-o antes de commitar.
- **Confira o `git status` antes do push.** Nada de `node_modules/`, `.env`, build (`dist/`, `.next/`) ou log no commit.

## O que não pode subir, em nenhuma circunstância

Esse projeto lida com oportunidades que circulam por indicação, então tem dado de gente real no meio:

- **Nenhum dado pessoal de terceiro** em código, seed, teste ou print — nome, telefone, e-mail, currículo, print de conversa de WhatsApp.
- **Nenhum contato de dono de vaga** sem autorização explícita dele. A regra do produto é clara: sem autorização, a candidatura vai como "via ponte".
- **Nenhuma credencial.** Chave de API, `service_role` do Supabase, token, URL com segredo. Se vazar uma, avise imediatamente — rotacionar é rápido, descobrir tarde é caro.

## Contribuindo de fora (sem acesso de escrita)

Só para quem **não** é colaborador do repositório — se você é, ignore esta seção inteira e use o clone direto acima.

Sem permissão de escrita, o `git push` falha. A volta é trabalhar num fork seu:

```bash
gh repo fork pablocarvalho0/indica-app --clone --remote
cd indica-app
```

Isso deixa dois remotes: `origin` é o seu fork (onde você dá `push`) e `upstream` é o repositório original (de onde você puxa atualização). Duas diferenças no fluxo, o resto é igual:

```bash
git pull upstream main                   # atualizar vem do upstream
git push -u origin feat/minha-ideia      # push continua no seu fork
```

O `gh pr create --base main` já abre o PR do seu fork para o repositório original.

## Achou um problema e não vai codar?

Abre uma issue, é contribuição de valor igual:

```bash
gh issue create --title "Filtro de área volta vazio quando não há item na categoria" --body "Como reproduzir, o que esperava, o que aconteceu."
```

---

Dúvida de processo ou de escopo? Pergunta na issue ou no PR mesmo. Perguntar antes é sempre mais barato que refazer depois.
