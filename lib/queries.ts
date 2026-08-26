import { clientePublico, clienteAdmin, supabaseConfigurado } from "./supabase";
import { demoPublicas } from "./demo";
import { diasAte } from "./format";
import type { Oportunidade, OportunidadePublica, Tipo } from "./types";
import { TIPOS } from "./types";

// A v0 vive na casa das dezenas de itens (o doc pede ~25-30 para lancar).
// Nesse volume, buscar a lista viva inteira e filtrar em memoria e mais
// simples, mais rapido e - o que importa aqui - torna trivial a regra
// "filtro que retornaria vazio nao aparece", que exige contar antes de
// desenhar. Se um dia passar de uns poucos milhares, isso vira query.

export type Filtros = {
  area?: string;
  faculdade?: string;
  tipo?: string;
};

/** Toda a lista viva: publicada e dentro do prazo. A view ja aplica os dois
 *  cortes - aqui nao existe jeito de esquecer. */
export async function listarPublicas(): Promise<OportunidadePublica[]> {
  // Sem Supabase configurado o app nao quebra: mostra os dados de exemplo.
  // Clonar o repo e rodar `npm run dev` ja mostra o produto de pe.
  if (!supabaseConfigurado()) return demoPublicas();

  const { data, error } = await clientePublico()
    .from("oportunidades_publicas")
    .select("*")
    .order("publicada_em", { ascending: false }); // recencia, nao relevancia

  if (error) throw new Error(`Falha ao carregar oportunidades: ${error.message}`);
  return (data ?? []) as OportunidadePublica[];
}

const passaArea = (i: OportunidadePublica, f: Filtros) => !f.area || i.area === f.area;
const passaTipo = (i: OportunidadePublica, f: Filtros) => !f.tipo || i.tipo === f.tipo;

// Faculdade-alvo vazia = aberta a todas, entao ela aparece em qualquer
// recorte de faculdade. Quem e do ITA quer ver o que e do ITA MAIS o que e
// de todo mundo - nunca so o que e exclusivo.
const passaFaculdade = (i: OportunidadePublica, f: Filtros) =>
  !f.faculdade || !i.faculdade_alvo || i.faculdade_alvo === f.faculdade;

export function aplicarFiltros(
  itens: OportunidadePublica[],
  f: Filtros,
): OportunidadePublica[] {
  return itens.filter((i) => passaArea(i, f) && passaTipo(i, f) && passaFaculdade(i, f));
}

export type Opcao = { valor: string; quantidade: number };

/**
 * Opcoes de filtro que sobrevivem: cada uma e contada JA considerando os
 * outros filtros ativos. Se o resultado seria zero, a opcao nao volta - e a
 * regra do doc, secao 5. Nao existe combinacao clicavel que leve a lista
 * vazia.
 */
export function opcoesDeArea(itens: OportunidadePublica[], f: Filtros): Opcao[] {
  const base = itens.filter((i) => passaTipo(i, f) && passaFaculdade(i, f));
  const contagem = new Map<string, number>();
  for (const i of base) contagem.set(i.area, (contagem.get(i.area) ?? 0) + 1);
  return [...contagem.entries()]
    .map(([valor, quantidade]) => ({ valor, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade || a.valor.localeCompare(b.valor));
}

export function opcoesDeFaculdade(itens: OportunidadePublica[], f: Filtros): Opcao[] {
  const base = itens.filter((i) => passaArea(i, f) && passaTipo(i, f));

  // So oferece a faculdade que tem ao menos um item dedicado a ela. Sem isso,
  // filtrar por "IME" quando nada e do IME devolveria exatamente a lista
  // inteira (todos os itens abertos) - um filtro que existe e nao filtra e
  // pior que filtro nenhum.
  const especificas = new Set(
    base.map((i) => i.faculdade_alvo?.trim()).filter((v): v is string => Boolean(v)),
  );

  return [...especificas]
    .map((valor) => ({
      valor,
      // Aqui a contagem e de EXCLUSIVAS, nao do total que a pessoa vera. O
      // total seria "abertas a todas + exclusivas", que da praticamente o
      // mesmo numero em toda faculdade - contagem que nao diferencia nada nao
      // ajuda ninguem a escolher. O que interessa e: quanto tem aqui que so
      // existe para mim.
      quantidade: base.filter((i) => i.faculdade_alvo === valor).length,
    }))
    .sort((a, b) => b.quantidade - a.quantidade || a.valor.localeCompare(b.valor));
}

// Doc, secao 4: "Tipo entra como filtro so quando houver volume nos quatro."
// Enquanto a curadoria estiver concentrada em vaga e off-cycle, esse filtro
// nao aparece. Baixe o numero quando programa e freela ganharem supply.
export const TIPOS_MINIMOS_PARA_FILTRAR = 3;

export function opcoesDeTipo(itens: OportunidadePublica[], f: Filtros): Opcao[] {
  const base = itens.filter((i) => passaArea(i, f) && passaFaculdade(i, f));

  const vivos = TIPOS.filter((t) => itens.some((i) => i.tipo === t));
  if (vivos.length < TIPOS_MINIMOS_PARA_FILTRAR) return [];

  const contagem = new Map<string, number>();
  for (const i of base) contagem.set(i.tipo, (contagem.get(i.tipo) ?? 0) + 1);

  return TIPOS.filter((t) => contagem.has(t)).map((t: Tipo) => ({
    valor: t,
    quantidade: contagem.get(t) ?? 0,
  }));
}

// ---------------------------------------------------------------------------
// Admin - tudo daqui para baixo passa pela service_role e exige exigirAdmin()
// ---------------------------------------------------------------------------

export async function listarTodasParaAdmin(): Promise<Oportunidade[]> {
  const { data, error } = await clienteAdmin()
    .from("oportunidades")
    .select("*")
    .order("publicada_em", { ascending: false });

  if (error) throw new Error(`Falha ao carregar o painel: ${error.message}`);
  return (data ?? []) as Oportunidade[];
}

export async function buscarParaAdmin(id: string): Promise<Oportunidade | null> {
  const { data, error } = await clienteAdmin()
    .from("oportunidades")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Falha ao carregar a oportunidade: ${error.message}`);
  return (data as Oportunidade) ?? null;
}

export type Situacao = "no-ar" | "vencendo" | "vencida" | "despublicada";

export function situacao(item: Oportunidade): Situacao {
  if (!item.publicada) return "despublicada";
  if (!item.prazo) return "no-ar";
  const dias = diasAte(item.prazo);
  if (dias < 0) return "vencida";
  if (dias <= 7) return "vencendo";
  return "no-ar";
}

/** A visao "o que vence essa semana" do doc, secao 4. E o antidoto para a
 *  lista apodrecer - o admin ve o que precisa de acao antes de sumir. */
export function venceEstaSemana(itens: Oportunidade[]): Oportunidade[] {
  return itens
    .filter((i) => situacao(i) === "vencendo")
    .sort((a, b) => (a.prazo ?? "").localeCompare(b.prazo ?? ""));
}
