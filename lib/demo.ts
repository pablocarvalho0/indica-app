import type {
  Area,
  Exibicao,
  Formato,
  Modo,
  OportunidadePublica,
  Tipo,
} from "./types";

/**
 * Dados de exemplo do modo demonstração.
 *
 * Servem a duas coisas:
 *  1. `npm run dev` sem nenhuma credencial já mostra o produto de pé - quem
 *     clona o repo entende o que isso é em trinta segundos.
 *  2. `npm run seed` gera supabase/seed.sql a partir daqui, para encher um
 *     banco de verdade enquanto a coleta real não chega nos ~25-30 itens que
 *     o doc exige para lançar.
 *
 * TUDO AQUI É FICTÍCIO - empresas, pessoas, links. Nenhuma vaga real, nenhuma
 * organização real, nenhum dado pessoal de ninguém. Apagar antes de lançar.
 *
 * Só há `vaga` e `off-cycle` de propósito: é o supply que o doc prevê para a
 * v0, e é o que mantém o filtro de tipo escondido - ele só aparece quando
 * houver volume nos quatro tipos.
 */
export type ItemDemo = {
  titulo: string;
  organizacao: string;
  tipo: Tipo;
  area: Area;
  formato?: Formato;
  localidade?: string;
  faculdade_alvo?: string;
  /** dias a partir de hoje; ausente = sem prazo */
  prazoEmDias?: number;
  remuneracao?: string;
  contexto?: string;
  modo_candidatura: Modo;
  destino: string;
  quem_trouxe: string;
  quem_trouxe_faculdade?: string;
  exibicao_quem_trouxe: Exibicao;
  /** há quantos dias foi publicada */
  diasAtras: number;
};

export const DEMO: ItemDemo[] = [
  {
    titulo: "Analista de sourcing",
    organizacao: "Vetor Capital",
    tipo: "vaga",
    area: "VC/PE",
    formato: "estagio",
    localidade: "São Paulo",
    remuneracao: "R$ 3.200 + bônus",
    prazoEmDias: 6,
    contexto:
      "Time de 4 pessoas, o sócio entrevista pessoalmente. Processo inteiro em 10 dias: conversa, case curto de mercado, papo final. Querem alguém que já tenha mexido com tese de investimento, nem que seja em júnior de finanças.",
    modo_candidatura: "ponte",
    destino: "beatriz.exemplo@mail.invalid",
    quem_trouxe: "Beatriz Andrade",
    quem_trouxe_faculdade: "Insper",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 0,
  },
  {
    titulo: "Off-cycle de research",
    organizacao: "Aroeira Asset",
    tipo: "off-cycle",
    area: "MF",
    formato: "estagio",
    localidade: "São Paulo",
    remuneracao: "R$ 5.000",
    prazoEmDias: 3,
    contexto:
      "Seis meses, começa em janeiro. Não abre no site: eles pegam indicação de quem já passou. Prova de Excel e um case de valuation no segundo dia. Quem vai bem costuma virar efetivo.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/aroeira/off-cycle",
    quem_trouxe: "Rafael Nogueira",
    exibicao_quem_trouxe: "nome",
    diasAtras: 1,
  },
  {
    titulo: "Primeiro engenheiro de dados",
    organizacao: "Nuvem Nove",
    tipo: "vaga",
    area: "dados",
    formato: "CLT",
    localidade: "remoto",
    remuneracao: "R$ 8.000 a R$ 11.000",
    contexto:
      "Seed, 9 pessoas, acabaram de levantar. É o primeiro hire de dados: você define o stack. Fundador é técnico e responde em horas. Aceita quem está no último ano se der para fazer 30h.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/nuvemnove/dados",
    quem_trouxe: "Camila Rocha",
    quem_trouxe_faculdade: "Unicamp",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 1,
  },
  {
    titulo: "Estágio em produto",
    organizacao: "Órbita Labs",
    tipo: "vaga",
    area: "produto",
    formato: "estagio",
    localidade: "São Paulo (híbrido, 3x)",
    remuneracao: "R$ 3.000",
    prazoEmDias: 12,
    contexto:
      "Vaga que abriu porque a pessoa saiu para o mestrado. Time de produto tem 3 pessoas, você pega uma squad inteira em dois meses. Eles valorizam quem já tocou projeto de entidade estudantil de verdade.",
    modo_candidatura: "ponte",
    destino: "@joaovitor.exemplo",
    quem_trouxe: "João Vitor Salles",
    quem_trouxe_faculdade: "ITA",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 2,
  },
  {
    titulo: "Backend Go (pleno)",
    organizacao: "Malha Logística",
    tipo: "vaga",
    area: "tech/dev",
    formato: "PJ",
    localidade: "remoto",
    remuneracao: "R$ 12.000 PJ",
    contexto:
      "Scale-up série B. A vaga não está no site nem no LinkedIn: estão contratando só por indicação para fugir do volume. Teste técnico é take-home de 4h, sem pegadinha.",
    modo_candidatura: "ponte",
    destino: "https://exemplo.invalid/contato/malha",
    quem_trouxe: "Lucas Ferraz",
    exibicao_quem_trouxe: "nome",
    diasAtras: 2,
  },
  {
    titulo: "Analista de M&A",
    organizacao: "Praia Grande Partners",
    tipo: "off-cycle",
    area: "MF",
    formato: "estagio",
    localidade: "São Paulo",
    faculdade_alvo: "Insper",
    remuneracao: "R$ 4.500",
    prazoEmDias: 9,
    contexto:
      "Boutique de 12 pessoas. Abriram essa turma só para o Insper esse ano — ano passado foi FGV. Rotina puxada, mas o deal flow é real e você assina o material.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/pgp/analista",
    quem_trouxe: "Marina Duarte",
    exibicao_quem_trouxe: "anonimo",
    diasAtras: 3,
  },
  {
    titulo: "Estágio em growth",
    organizacao: "Cardume",
    tipo: "vaga",
    area: "produto",
    formato: "estagio",
    localidade: "remoto",
    remuneracao: "R$ 2.800",
    contexto:
      "Fintech seed. Fundadora contrata rápido: se você mandar até quarta, conversa na sexta. Quer alguém que saiba escrever bem — metade do trabalho é copy de aquisição.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/cardume/growth",
    quem_trouxe: "Pedro Antunes",
    quem_trouxe_faculdade: "USP",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 3,
  },
  {
    titulo: "Cientista de dados júnior",
    organizacao: "Instituto Barlavento",
    tipo: "vaga",
    area: "dados",
    formato: "CLT",
    localidade: "Rio de Janeiro",
    remuneracao: "R$ 7.000",
    prazoEmDias: 20,
    contexto:
      "Terceiro setor, mas paga mercado. Projeto de dados públicos de educação. Aceitam recém-formado. Processo tem uma etapa de apresentação para o conselho.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/barlavento/dados",
    quem_trouxe: "Helena Prado",
    exibicao_quem_trouxe: "nome",
    diasAtras: 4,
  },
  {
    titulo: "Sourcing analyst",
    organizacao: "Talos Ventures",
    tipo: "vaga",
    area: "VC/PE",
    formato: "estagio",
    localidade: "São Paulo",
    remuneracao: "R$ 3.500",
    prazoEmDias: 5,
    contexto:
      "Fundo early-stage. Você vai passar o dia falando com fundador, não montando planilha. Eles preferem quem já empreendeu ou trabalhou em startup pequena a quem tem estágio em banco.",
    modo_candidatura: "ponte",
    destino: "beatriz.exemplo@mail.invalid",
    quem_trouxe: "Beatriz Andrade",
    quem_trouxe_faculdade: "Insper",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 4,
  },
  {
    titulo: "Engenheiro de software (novo time)",
    organizacao: "Farol Saúde",
    tipo: "vaga",
    area: "tech/dev",
    formato: "CLT",
    localidade: "São Paulo (híbrido)",
    remuneracao: "R$ 9.500",
    contexto:
      "Estão montando um time novo do zero — 4 vagas, mesma senioridade. Quem entra agora pega escopo de tech lead em um ano. Stack: TypeScript, Postgres, AWS.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/farol/eng",
    quem_trouxe: "Gustavo Lins",
    quem_trouxe_faculdade: "ITA",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 5,
  },
  {
    titulo: "Off-cycle em equity research",
    organizacao: "Serra Azul Investimentos",
    tipo: "off-cycle",
    area: "MF",
    formato: "estagio",
    localidade: "São Paulo",
    remuneracao: "R$ 4.800",
    prazoEmDias: 2,
    contexto:
      "Cobertura de varejo e consumo. O analista sênior é quem decide e ele lê todos os e-mails. Mandar uma tese de uma página junto com o currículo funciona muito melhor que só o CV.",
    modo_candidatura: "contato",
    destino: "recrutamento.exemplo@mail.invalid",
    quem_trouxe: "Rafael Nogueira",
    exibicao_quem_trouxe: "nome",
    diasAtras: 5,
  },
  {
    titulo: "Estágio em consultoria de dados",
    organizacao: "Meridiano Consultoria",
    tipo: "vaga",
    area: "consultoria",
    formato: "estagio",
    localidade: "São Paulo",
    remuneracao: "R$ 3.000",
    prazoEmDias: 15,
    contexto:
      "Butique de 20 pessoas, clientes de indústria. Não faz case de MBB: o processo é uma conversa técnica e um exercício de SQL.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/meridiano/estagio",
    quem_trouxe: "Ana Carolina Melo",
    quem_trouxe_faculdade: "Unicamp",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 6,
  },
  {
    titulo: "Primeiro hire de operações",
    organizacao: "Semente Agro",
    tipo: "vaga",
    area: "outros",
    formato: "CLT",
    localidade: "Campinas",
    remuneracao: "R$ 6.000 + equity",
    contexto:
      "Agtech pré-seed, 5 pessoas. Tem equity na mesa para o primeiro de ops. Fundador veio de fazenda e de engenharia — quer alguém que não tenha medo de ir a campo.",
    modo_candidatura: "ponte",
    destino: "@camila.exemplo",
    quem_trouxe: "Camila Rocha",
    quem_trouxe_faculdade: "Unicamp",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 6,
  },
  {
    titulo: "Estágio em engenharia de plataforma",
    organizacao: "Quadrante Tech",
    tipo: "vaga",
    area: "tech/dev",
    formato: "estagio",
    localidade: "remoto",
    faculdade_alvo: "ITA",
    remuneracao: "R$ 4.000",
    prazoEmDias: 10,
    contexto:
      "Abriram duas vagas exclusivas para o ITA porque os dois últimos estagiários vieram de lá e deram muito certo. Kubernetes e Go, com mentoria de verdade.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/quadrante/estagio",
    quem_trouxe: "Gustavo Lins",
    quem_trouxe_faculdade: "ITA",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 7,
  },
  {
    titulo: "Analista de investimentos",
    organizacao: "Fundo Cambuci",
    tipo: "vaga",
    area: "VC/PE",
    formato: "CLT",
    localidade: "São Paulo",
    remuneracao: "R$ 9.000",
    prazoEmDias: 25,
    contexto:
      "Growth equity, cheques de R$ 20M a R$ 60M. Contratam um por ano e sempre por indicação. Modelagem pesada — se você não gosta de planilha, não é aqui.",
    modo_candidatura: "contato",
    destino: "https://exemplo.invalid/cambuci/contato",
    quem_trouxe: "Marina Duarte",
    exibicao_quem_trouxe: "anonimo",
    diasAtras: 8,
  },
  {
    titulo: "Product analyst",
    organizacao: "Trilho",
    tipo: "vaga",
    area: "dados",
    formato: "CLT",
    localidade: "remoto",
    remuneracao: "R$ 7.500",
    contexto:
      "Marketplace série A. A vaga é metade produto, metade dados. Head de produto responde em um dia e dá feedback detalhado mesmo para quem não passa.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/trilho/analyst",
    quem_trouxe: "Pedro Antunes",
    quem_trouxe_faculdade: "USP",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 9,
  },
  {
    titulo: "Off-cycle em crédito",
    organizacao: "Ipê Capital",
    tipo: "off-cycle",
    area: "MF",
    formato: "estagio",
    localidade: "São Paulo",
    remuneracao: "R$ 5.200",
    prazoEmDias: 18,
    contexto:
      "Crédito estruturado. Turma de dois. Eles avisam que a primeira semana é pesada de propósito, para ver quem aguenta. Quem fica costuma receber oferta.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/ipe/offcycle",
    quem_trouxe: "Helena Prado",
    exibicao_quem_trouxe: "nome",
    diasAtras: 10,
  },
  {
    titulo: "Estágio em design de produto",
    organizacao: "Cardume",
    tipo: "vaga",
    area: "produto",
    formato: "estagio",
    localidade: "remoto",
    remuneracao: "R$ 2.800",
    contexto:
      "Mesma fintech do growth. Aqui querem portfólio, não currículo — dois projetos bem explicados bastam.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/cardume/design",
    quem_trouxe: "Ana Carolina Melo",
    quem_trouxe_faculdade: "Unicamp",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 11,
  },
  {
    titulo: "Engenheiro de machine learning",
    organizacao: "Vespa AI",
    tipo: "vaga",
    area: "tech/dev",
    formato: "PJ",
    localidade: "remoto",
    remuneracao: "R$ 14.000 PJ",
    prazoEmDias: 30,
    contexto:
      "Time de 6, todos sêniores, e é o primeiro júnior que eles contratam. Aceitam mestrando. Pedem para você mandar um repositório junto — leem de verdade.",
    modo_candidatura: "ponte",
    destino: "lucas.exemplo@mail.invalid",
    quem_trouxe: "Lucas Ferraz",
    exibicao_quem_trouxe: "nome",
    diasAtras: 12,
  },
  {
    titulo: "Analista de operações",
    organizacao: "Boto Logística",
    tipo: "vaga",
    area: "outros",
    formato: "CLT",
    localidade: "Manaus",
    remuneracao: "R$ 5.500",
    contexto:
      "Operação de última milha na Amazônia. Vaga difícil de preencher porque quase ninguém procura por isso — e é justamente por isso que quem entra cresce rápido.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/boto/ops",
    quem_trouxe: "João Vitor Salles",
    quem_trouxe_faculdade: "ITA",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 13,
  },
  {
    titulo: "Estágio em VC (plataforma)",
    organizacao: "Talos Ventures",
    tipo: "vaga",
    area: "VC/PE",
    formato: "estagio",
    localidade: "São Paulo",
    faculdade_alvo: "USP",
    remuneracao: "R$ 3.500",
    prazoEmDias: 14,
    contexto:
      "Time de plataforma ajuda as investidas a contratar. Abriram para a USP porque a última pessoa veio da Poli. Você fala com fundador todo dia.",
    modo_candidatura: "ponte",
    destino: "@pedro.exemplo",
    quem_trouxe: "Pedro Antunes",
    quem_trouxe_faculdade: "USP",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 14,
  },
  {
    titulo: "Desenvolvedor front-end",
    organizacao: "Sinal Verde",
    tipo: "vaga",
    area: "tech/dev",
    formato: "CLT",
    localidade: "Belo Horizonte (híbrido)",
    remuneracao: "R$ 8.000",
    contexto:
      "Healthtech série A. O CTO contrata pessoalmente e o processo tem uma etapa de pair programming — quem gosta de conversar código se dá muito bem.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/sinalverde/front",
    quem_trouxe: "Gustavo Lins",
    quem_trouxe_faculdade: "ITA",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 15,
  },
  {
    titulo: "Off-cycle em private equity",
    organizacao: "Monte Verde Partners",
    tipo: "off-cycle",
    area: "MF",
    formato: "estagio",
    localidade: "São Paulo",
    remuneracao: "R$ 6.000",
    prazoEmDias: 22,
    contexto:
      "Seis meses. Fundo médio, tese de saúde e educação. Contratam dois por semestre e sempre pegam quem já fez off-cycle antes — mas abriram uma vaga para quem nunca fez.",
    modo_candidatura: "contato",
    destino: "vagas.exemplo@mail.invalid",
    quem_trouxe: "Rafael Nogueira",
    exibicao_quem_trouxe: "nome",
    diasAtras: 16,
  },
  {
    titulo: "Analista de BI",
    organizacao: "Rede Andorinha",
    tipo: "vaga",
    area: "dados",
    formato: "CLT",
    localidade: "remoto",
    remuneracao: "R$ 6.500",
    contexto:
      "Varejo, 200 lojas. O trabalho é de verdade: a diretoria toma decisão com o dashboard que você faz. Ferramenta é Looker e dbt.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/andorinha/bi",
    quem_trouxe: "Helena Prado",
    exibicao_quem_trouxe: "nome",
    diasAtras: 17,
  },
  {
    titulo: "Estágio em estratégia",
    organizacao: "Grupo Caravela",
    tipo: "vaga",
    area: "consultoria",
    formato: "estagio",
    localidade: "São Paulo",
    remuneracao: "R$ 3.200",
    prazoEmDias: 28,
    contexto:
      "Área de estratégia interna de um grupo familiar grande. Trabalha direto com o board. Não tem processo estruturado: mandam o CV para o diretor e ele chama.",
    modo_candidatura: "ponte",
    destino: "marina.exemplo@mail.invalid",
    quem_trouxe: "Marina Duarte",
    exibicao_quem_trouxe: "anonimo",
    diasAtras: 18,
  },
  {
    titulo: "Engenheiro de dados (primeiro do time)",
    organizacao: "Pauta Mídia",
    tipo: "vaga",
    area: "dados",
    formato: "PJ",
    localidade: "remoto",
    remuneracao: "R$ 10.000 PJ",
    contexto:
      "Startup de mídia, 15 pessoas. Hoje tudo roda em planilha; você monta a base do zero. Liberdade total de stack, com a contrapartida de não ter ninguém para perguntar.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/pauta/dados",
    quem_trouxe: "Camila Rocha",
    quem_trouxe_faculdade: "Unicamp",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 19,
  },
  {
    titulo: "Analista de produto",
    organizacao: "Órbita Labs",
    tipo: "vaga",
    area: "produto",
    formato: "CLT",
    localidade: "São Paulo (híbrido, 3x)",
    remuneracao: "R$ 7.000",
    prazoEmDias: 35,
    contexto:
      "Segunda vaga do mesmo time de produto. Essa é para quem já formou. Eles contratam devagar e avisam: o processo leva umas três semanas.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/orbita/analista",
    quem_trouxe: "João Vitor Salles",
    quem_trouxe_faculdade: "ITA",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 21,
  },
  {
    titulo: "Off-cycle em macro",
    organizacao: "Serra Azul Investimentos",
    tipo: "off-cycle",
    area: "MF",
    formato: "estagio",
    localidade: "São Paulo",
    faculdade_alvo: "Unicamp",
    remuneracao: "R$ 5.000",
    prazoEmDias: 40,
    contexto:
      "Mesa de macro. Abriram para o Instituto de Economia da Unicamp esse ano. Pedem econometria de verdade — quem só fez a cadeira básica sofre.",
    modo_candidatura: "link",
    destino: "https://exemplo.invalid/serraazul/macro",
    quem_trouxe: "Ana Carolina Melo",
    quem_trouxe_faculdade: "Unicamp",
    exibicao_quem_trouxe: "primeiro-nome-faculdade",
    diasAtras: 24,
  },
];

/** Ids estáveis e válidos como UUID, para o /api/ir funcionar em demo. */
export function idDemo(indice: number): string {
  return `00000000-0000-4000-8000-${String(indice).padStart(12, "0")}`;
}

function comOffset(dias: number): string {
  return new Date(Date.now() + dias * 86_400_000).toISOString();
}

/**
 * Aplica em TypeScript exatamente o que a view `oportunidades_publicas` aplica
 * em SQL: resolve o crédito conforme o consentimento e corta o que venceu.
 * Se um dia a view mudar, muda aqui junto.
 */
export function demoPublicas(): OportunidadePublica[] {
  return DEMO.map((item, i) => ({
    id: idDemo(i),
    titulo: item.titulo,
    organizacao: item.organizacao,
    tipo: item.tipo,
    area: item.area,
    formato: item.formato ?? null,
    localidade: item.localidade ?? null,
    faculdade_alvo: item.faculdade_alvo ?? null,
    prazo:
      item.prazoEmDias === undefined
        ? null
        : comOffset(item.prazoEmDias).slice(0, 10),
    remuneracao: item.remuneracao ?? null,
    contexto: item.contexto ?? null,
    modo_candidatura: item.modo_candidatura,
    exibicao: item.exibicao_quem_trouxe,
    creditado:
      item.exibicao_quem_trouxe === "nome"
        ? item.quem_trouxe
        : item.exibicao_quem_trouxe === "primeiro-nome-faculdade"
          ? `${item.quem_trouxe.split(" ")[0]} · ${item.quem_trouxe_faculdade}`
          : null,
    publicada_em: comOffset(-item.diasAtras),
  })).filter((i) => i.prazo === null || i.prazo >= new Date().toISOString().slice(0, 10));
}

/** O que o /api/ir e o /api/contato devolvem quando não há banco: o destino,
 *  sem contar clique (não há onde contar). */
export function destinoDemo(id: string): string | null {
  const i = DEMO.findIndex((_, indice) => idDemo(indice) === id);
  return i === -1 ? null : DEMO[i].destino;
}
