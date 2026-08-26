import { NextResponse } from "next/server";
import { registrarClique, urlDeSaidaSegura } from "@/lib/clique";

export const dynamic = "force-dynamic";

/** Modo "link publico": conta o clique e joga a pessoa para fora do app -
 *  candidatura acontece no site de quem contrata, nunca aqui (doc, secao 4). */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const destino = urlDeSaidaSegura(await registrarClique(id));

  // Item vencido, despublicado ou link invalido: volta para a lista em vez
  // de mostrar erro. Quem clicou nao tem nada a ver com isso.
  return NextResponse.redirect(destino ?? new URL("/", request.url), 302);
}
