import { clientePublico, supabaseConfigurado } from "./supabase";
import { destinoDemo } from "./demo";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Conta o clique e devolve o destino, numa transacao so.
 *
 * Toda a regra mora no banco (registrar_clique, em supabase/schema.sql):
 * item despublicado ou vencido devolve NULL, e o destino nunca aparece numa
 * leitura normal da tabela. Aqui e so a casca HTTP.
 */
export async function registrarClique(id: string): Promise<string | null> {
  if (!UUID.test(id)) return null;

  // Em demonstracao nao ha onde contar o clique - so devolve o destino.
  if (!supabaseConfigurado()) return destinoDemo(id);

  const { data, error } = await clientePublico().rpc("registrar_clique", {
    item: id,
  });

  if (error) {
    console.error("registrar_clique falhou:", error.message);
    return null;
  }
  return (data as string | null) ?? null;
}

/** So http(s) sai daqui. Sem isso, um `javascript:` ou `data:` gravado por
 *  engano no admin viraria redirect. */
export function urlDeSaidaSegura(destino: string | null): string | null {
  if (!destino) return null;
  try {
    const u = new URL(destino.trim());
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}
