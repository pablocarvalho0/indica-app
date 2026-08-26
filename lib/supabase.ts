import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function exigir(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(
      `Variável de ambiente ${nome} não definida. Copie .env.example para .env e preencha.`,
    );
  }
  return valor;
}

/** Chave anon: publica por design. Só alcança a view oportunidades_publicas
 *  e a função registrar_clique(). Ver o bloco de RLS em supabase/schema.sql. */
export function clientePublico(): SupabaseClient {
  return createClient(
    exigir("NEXT_PUBLIC_SUPABASE_URL"),
    exigir("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    { auth: { persistSession: false } },
  );
}

/** Chave service_role: ignora RLS, enxerga tudo. Só pode ser chamada de
 *  código que roda no servidor e atrás de exigirAdmin(). Nunca em componente
 *  de cliente. */
export function clienteAdmin(): SupabaseClient {
  return createClient(
    exigir("NEXT_PUBLIC_SUPABASE_URL"),
    exigir("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } },
  );
}

/** true quando o projeto ainda não foi conectado ao Supabase. Deixa a home
 *  explicar o que falta em vez de estourar uma stack trace. */
export function supabaseConfigurado(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
