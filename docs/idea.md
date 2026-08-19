# Indica — Escopo v0 e Visão

> Documento de produto. Input para spec técnica e plano de implementação.
> Autor: Pablo · Agosto/2026

---

## 1. A dor

Vagas boas para universitários de faculdades seletivas circulam por **canais fechados**: grupos de WhatsApp por faculdade, indicação, DM. Cada bolha (ITA, IME, Unicamp, Insper, USP) vê um subconjunto diferente do mercado.

A dor tem três camadas, em ordem de importância:

1. **Cobertura** — a oportunidade existiu e você nunca soube dela.
2. **Frescor** — vaga de time pequeno fecha em 5–10 dias, por indicação. Saber depois = não saber.
3. **Contexto** — quem está dentro do grupo não recebe só o link; recebe "o processo é rápido", "paga X", "eles querem Y". Essa informação é a vantagem real.

**Efeito QI (quem indica):** a camada 3 é o que faz alguém bem preparado perder para alguém pior preparado que estava no grupo certo.

### O que o produto quebra (e o que não quebra)

Quebra o **QI intra-bolha**: quem entrou no ITA não deveria perder uma oportunidade só porque ela circulou na Insper.

Não quebra o privilégio de acesso mais amplo — o recorte segue sendo faculdade seletiva. Isso deve ser dito com honestidade em qualquer comunicação pública. Não usar "democratizar oportunidade".

---

## 2. Critério de entrada: o teste do canal

> **Se a pessoa acharia essa oportunidade sozinha buscando no LinkedIn por 20 minutos, ela não entra.**

Este é o critério de admissão. Área é *filtro*, não critério.

**Entra:** off-cycle de fundo, sourcing/analyst de VC, primeiro hire de startup seed, tech em scale-up por indicação, vaga aberta especificamente para uma faculdade, oportunidade que um amigo abriu no próprio time.

**Não entra:** programa de estágio de multinacional, trainee de banco, MBB, qualquer coisa com landing page e campanha de campus própria. Não por ser ruim — por já ser visível.

### Frase pública

> Oportunidades que circulam por indicação nas melhores faculdades do Brasil — reunidas num lugar só.

---

## 3. Posicionamento e acesso

**Acesso aberto para leitura.** Sem login.

Tensão a gerenciar: quem posta em grupo fechado está comprando um filtro. Com acesso aberto, esse filtro migra da porta de entrada para o **perfil da audiência** — quem posta continua acessando um público selecionado *porque a audiência é selecionada*, não porque o acesso é restrito.

**Consequência:** o posicionamento é o ativo. No dia em que virar "vagas em geral", o valor para quem posta evapora e o supply seca. Aberto ≠ genérico.

### Nome e narrativa

**Nome: Indica.** Escolhido pelo teste de uso falado — "vi lá no Indica", "posta lá no Indica". Verbo, curto, é o que de fato acontece no produto.

**QI (quem indica) é a narrativa, não o nome.** Fica na home, no post de lançamento e no README:

> Vaga boa sempre foi QI. A gente só abriu o Q.

A separação é proposital: QI é forte como conceito e fraco como nome de uso diário (colide com quociente de inteligência na busca, e sigla de duas letras é ruim de encontrar). Como retórica, não precisa estar no domínio para funcionar.

**Domínio:** adiado. Subdomínio da hospedagem na v0. Quando comprar, preservar o nome curto na fala — `indica.app` ou `oindica.com.br`, nunca `indicavagas`, que empurra para "vi no IndicaVagas".

**Hospedagem v0:** Vercel (hobby) + Supabase (free) + GitHub. Grátis no volume esperado. Duas notas: plano hobby da Vercel é não-comercial (revisar se a Fase 6 acontecer) e projeto Supabase inativo pausa — confirmar limites atuais nas páginas de pricing antes de fechar.

---

## 4. Escopo v0

### Princípio

Uma entidade só: **`oportunidade`**. Os quatro tipos (vaga, off-cycle, programa, freela) compartilham quase todos os campos — são um produto com um enum, não quatro produtos.

O campo `tipo` existe no schema desde o dia 1 (custo zero). Mas a **curadoria da v0 foca no que há supply real** — provavelmente vaga e off-cycle. Programa e freela entram quando houver volume.

### Campos de `oportunidade`

| Campo | Obrigatório | Nota |
|---|---|---|
| título | sim | |
| organização | sim | |
| tipo | sim | vaga · off-cycle · programa · freela |
| área | sim | MF · VC/PE · tech/dev · produto · dados · consultoria · outros |
| formato | não | estágio · CLT · PJ · projeto |
| local | não | remoto ou cidade |
| faculdade-alvo | não | vazio = aberta a todas |
| prazo | não | dispara expiração automática |
| data de publicação | auto | |
| **modo de candidatura** | sim | link público · via ponte · contato direto autorizado — ver §6 |
| link ou contato | sim | conforme o modo acima |
| **quem trouxe** | sim | crédito público — ver §6 |
| exibição de quem trouxe | sim | nome · primeiro nome + faculdade · anônimo |
| **o que você precisa saber** | não | texto livre; a camada de contexto — ver §6 |
| remuneração | não | perseguir sempre; maior diferencial quando presente |

### Admin (Pablo)

- Criar oportunidade em **menos de 60 segundos** — requisito de produto, não de UX. Se demorar mais, o projeto morre no mês 2 por fadiga de admin. Máximo de campos opcionais, formulário curto.
- Editar e despublicar
- Expiração automática: item com prazo vencido sai da lista sozinho
- Visão "o que vence essa semana"
- Contador de cliques no link de candidatura

### Usuário final

- Lista ordenada por **recência** (não relevância)
- Filtros: **área** e **faculdade**. Tipo entra como filtro só quando houver volume nos quatro.
- Card mostra: data de publicação, prazo, quem trouxe, o contexto
- Link sai para fora do app
- Sem login, sem cadastro

### Fora da v0 (explicitamente)

Login · perfil de usuário · candidatura dentro do app · upload de currículo · submissão aberta com fila de curadoria · comentários · busca full-text · alerta por e-mail · dashboard de analytics · qualquer PII além do que está no card.

---

## 5. Regras de operação (não são código)

- **Não lançar com menos de ~25–30 itens vivos.** Lista vazia parece morta e queima a primeira impressão.
- **Filtro que retornaria vazio não aparece.**
- **Definição de pronto da v0:** *cadastrar uma oportunidade em menos de 60 segundos e um amigo conseguir filtrar por área e clicar no link, no celular, sem explicação.* Nada além disso entra antes do lançamento.
- **Coleta roda em paralelo ao código, desde o dia 1.** Juntar 25–30 itens leva semanas de calendário, não de trabalho. Coletar durante o desenvolvimento também valida o schema com dado real antes de existir migração para fazer.
- **Canal de push é parte do sistema.** Busca de emprego é comportamento em surto: a pessoa some por 4 meses e aparece por 3 semanas. Um app puramente passivo perde a janela de frescor, que é metade do valor. Na v0 o push pode ser manual (Pablo posta o link no grupo) — mas está na spec de propósito, para não sumir.

---

## 6. As duas features que valem mais do que parecem

**"Quem trouxe"** — crédito público é a moeda que faz os amigos mandarem oportunidade de graça. Resolve o problema de supply sem precisar de mecanismo nenhum, e materializa a camada de confiança que faz o grupo de WhatsApp funcionar melhor que o LinkedIn.

**Modo de candidatura** — "quem trouxe" e "com quem falar" são coisas diferentes:

- **Link público:** candidata direto, sem intermediário.
- **Via ponte:** o contato é quem trouxe. A pessoa fala com ele e ele indica. Preserva o valor social de quem indica — é o que faz embaixador querer participar. Mantém um QI, mas **abre quem pode acessá-lo**.
- **Contato direto autorizado:** contato do dono da vaga, exibido **apenas** com autorização explícita dele. Sem autorização, cai para "via ponte" — nunca publicar contato que chegou em privado.

**Consentimento de exibição:** quem trouxe escolhe como aparece (nome / primeiro nome + faculdade / anônimo). É dado pessoal de terceiro numa página aberta — barato de resolver no design, caro de resolver depois.

**"O que você precisa saber"** — é literalmente o efeito QI engarrafado. É a informação que circula no grupo *junto* com o link e que gera a vantagem injusta. É a coisa mais difícil de copiar no produto inteiro e custa um `text` no schema.

---

## 7. Métricas

Não é usuário cadastrado. É:

- **Oportunidades novas por semana** — saúde do supply, o gargalo real
- **Cliques por item** — único proxy de valor entregue na v0
- **Pelo menos uma contratação que só existiu por causa da lista** — a prova de que a dor era real, e o post de LinkedIn

---

## 8. Riscos mapeados

| Risco | Mitigação |
|---|---|
| Fadiga de admin (principal modo de falha) | postar em <60s; canal de coleta que traz vagas até você |
| Supply seca | crédito público a quem traz; grupo de coleta |
| Lista apodrece com item vencido | expiração automática; visão "vence essa semana" |
| Diluição do posicionamento | teste do canal aplicado com rigor |
| Republicar vaga de grupo fechado sem permissão | pedir autorização; item sensível não vai para o site |
| Conflito de interesse percebido (Leapy é HR-tech) | avisar o gestor **antes** de publicar |

---

## 9. Em aberto (decidir antes da spec)

1. **Formato do canal de push** — grupo de WhatsApp próprio? lista de transmissão? newsletter?
2. **Domínio próprio** — decisão adiada; v0 sobe em subdomínio.

---

## 10. O sonho maior (guia, não escopo)

Fases em ordem de dependência. Cada uma só existe se a anterior funcionou.

**Fase 1 — v0 (acima).** Provar que existe dor e que há supply. Pablo é o único curador.

**Fase 2 — Push e frescor.** Alerta por e-mail ou canal automatizado com filtro salvo. Requer login → primeira vez que há dado pessoal no sistema. Resolve a camada de *frescor* de forma estrutural.

**Fase 3 — Embaixadores.** Um amigo de confiança por faculdade recebe permissão de publicar, seguindo critério de curadoria já estabelecido (por isso a v0 é só Pablo: para aprender e afinar o modelo antes de delegá-lo). Três papéis: **admin / embaixador / leitor**. Embaixador tem accountability e identidade — é bem mais seguro e mais alinhado que submissão anônima. Sai do gargalo de uma pessoa só sem trazer moderação de estranho.

**Fase 3b — Submissão aberta (só se necessário).** Qualquer pessoa submete, entra em fila (`pending / approved / rejected`). Traz junto: moderação, vaga falsa como vetor de golpe, XSS em conteúdo de terceiro, dado pessoal de quem nunca autorizou. É o verdadeiro salto de risco — só fazer se o modelo de embaixadores não der conta.

**Fase 4 — Contexto como ativo.** Camada de contexto crescendo por contribuição da comunidade: como é o processo, faixa salarial real, experiência de quem passou. É aqui que o efeito QI é quebrado de verdade — e é o fosso competitivo real.

**Fase 5 — Amplitude de tipos.** Programas, fellowships, freelas, hackathons pagos ativados de verdade, cada um com o volume que justifica o filtro.

**Fase 6 — Monetização (só se consolidar).** Hipóteses, não decisão: destaque pago para quem contrata, acesso de empresa a talent pool com opt-in explícito, patrocínio. Nunca cobrar do candidato — quebraria a missão.

**Open source e gratuito o tempo todo.** Repo público desde a v0.