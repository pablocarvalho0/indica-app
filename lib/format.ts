import type { OportunidadePublica } from "./types";

const FUSO = "America/Sao_Paulo";

/** Hoje em Sao Paulo, no formato YYYY-MM-DD. O produto e brasileiro; o
 *  servidor da Vercel roda em UTC. "Vence hoje" tem que virar a meia-noite
 *  de Brasilia. */
export function hojeBR(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(new Date());
}

function comoUTC(iso: string): number {
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number);
  return Date.UTC(a, m - 1, d);
}

function emDataBR(instante: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(
    new Date(instante),
  );
}

/** Dias entre hoje e a data. Negativo = passou. */
export function diasAte(data: string): number {
  return Math.round((comoUTC(data) - comoUTC(hojeBR())) / 86_400_000);
}

/** "25/08" */
export function dataCurta(data: string): string {
  const [, m, d] = data.slice(0, 10).split("-");
  return `${d}/${m}`;
}

/** "há 3 dias" - o card lidera por recencia, entao esse texto e o sinal de
 *  frescor (doc, secao 1, camada 2). */
export function tempoRelativo(instante: string): string {
  const dias = -diasAte(emDataBR(instante));
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 7) return `há ${dias} dias`;
  if (dias < 14) return "há 1 semana";
  if (dias < 30) return `há ${Math.floor(dias / 7)} semanas`;
  const meses = Math.floor(dias / 30);
  return `há ${meses} ${meses === 1 ? "mês" : "meses"}`;
}

export type Urgencia = "urgente" | "proximo" | "tranquilo";

export function prazoInfo(
  prazo: string | null,
): { texto: string; nivel: Urgencia } | null {
  if (!prazo) return null;
  const dias = diasAte(prazo);
  if (dias < 0) return null; // ja saiu da lista pela expiracao automatica
  if (dias === 0) return { texto: "vence hoje", nivel: "urgente" };
  if (dias === 1) return { texto: "vence amanhã", nivel: "urgente" };
  if (dias <= 3) return { texto: `vence em ${dias} dias`, nivel: "urgente" };
  if (dias <= 7) return { texto: `vence em ${dias} dias`, nivel: "proximo" };
  return { texto: `até ${dataCurta(prazo)}`, nivel: "tranquilo" };
}

/** O credito publico ja vem resolvido do banco. Quando e anonimo, o nome
 *  real nunca chegou ate aqui - so a ausencia dele. */
export function credito(item: OportunidadePublica): string {
  return item.creditado ?? "alguém da rede";
}
