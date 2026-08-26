// Vocabulario do dominio. Espelha os CHECKs de supabase/schema.sql.
// Mudou aqui, muda la.

export const TIPOS = ["vaga", "off-cycle", "programa", "freela"] as const;
export const AREAS = [
  "MF",
  "VC/PE",
  "tech/dev",
  "produto",
  "dados",
  "consultoria",
  "outros",
] as const;
export const FORMATOS = ["estagio", "CLT", "PJ", "projeto"] as const;
export const MODOS = ["link", "ponte", "contato"] as const;
export const EXIBICOES = ["nome", "primeiro-nome-faculdade", "anonimo"] as const;

export type Tipo = (typeof TIPOS)[number];
export type Area = (typeof AREAS)[number];
export type Formato = (typeof FORMATOS)[number];
export type Modo = (typeof MODOS)[number];
export type Exibicao = (typeof EXIBICOES)[number];

// Rotulos de tela. O banco guarda ascii; a interface mostra portugues.
export const LABEL_FORMATO: Record<Formato, string> = {
  estagio: "estágio",
  CLT: "CLT",
  PJ: "PJ",
  projeto: "projeto",
};

export const LABEL_MODO: Record<Modo, string> = {
  link: "link público",
  ponte: "via ponte",
  contato: "contato direto",
};

export const AJUDA_MODO: Record<Modo, string> = {
  link: "A pessoa se candidata direto, sem intermediário.",
  ponte: "O contato é de quem trouxe. A pessoa fala com ele e ele indica.",
  contato: "Contato do dono da vaga. Só com autorização explícita dele.",
};

export const LABEL_EXIBICAO: Record<Exibicao, string> = {
  nome: "nome completo",
  "primeiro-nome-faculdade": "primeiro nome + faculdade",
  anonimo: "anônimo",
};

// Sugestoes do formulario. Campo e texto livre - a lista existe para o admin
// digitar menos, nao para limitar o que pode ser cadastrado.
export const FACULDADES_SUGERIDAS = [
  "ITA",
  "IME",
  "Insper",
  "USP",
  "Unicamp",
  "FGV",
  "UFRJ",
  "UFMG",
  "PUC-Rio",
  "UnB",
];

/** O que o publico enxerga: a view oportunidades_publicas. Sem `destino`,
 *  sem o nome real de quem pediu anonimato. */
export type OportunidadePublica = {
  id: string;
  titulo: string;
  organizacao: string;
  tipo: Tipo;
  area: Area;
  formato: Formato | null;
  localidade: string | null;
  faculdade_alvo: string | null;
  prazo: string | null; // YYYY-MM-DD
  remuneracao: string | null;
  contexto: string | null;
  modo_candidatura: Modo;
  exibicao: Exibicao;
  creditado: string | null; // ja resolvido pelo banco
  publicada_em: string;
};

/** O que o admin enxerga: a tabela inteira. Só existe atrás da service_role. */
export type Oportunidade = {
  id: string;
  titulo: string;
  organizacao: string;
  tipo: Tipo;
  area: Area;
  formato: Formato | null;
  localidade: string | null;
  faculdade_alvo: string | null;
  prazo: string | null;
  remuneracao: string | null;
  contexto: string | null;
  modo_candidatura: Modo;
  destino: string;
  quem_trouxe: string;
  quem_trouxe_faculdade: string | null;
  exibicao_quem_trouxe: Exibicao;
  publicada: boolean;
  cliques: number;
  publicada_em: string;
  criada_em: string;
  atualizada_em: string;
};
