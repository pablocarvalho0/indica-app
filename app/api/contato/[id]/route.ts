import { NextResponse } from "next/server";
import { registrarClique } from "@/lib/clique";

export const dynamic = "force-dynamic";

/** Modos "via ponte" e "contato direto autorizado": o contato so sai do banco
 *  aqui, depois de um clique deliberado, e o mesmo clique entra na metrica. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const destino = await registrarClique(id);

  if (!destino) {
    return NextResponse.json(
      { erro: "Oportunidade indisponível." },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { destino },
    { headers: { "cache-control": "no-store" } },
  );
}
