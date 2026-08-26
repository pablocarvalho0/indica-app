// Gera supabase/seed.sql a partir de lib/demo.ts.
//
// Uma fonte de dados só: o que aparece no modo demonstração é o mesmo que
// entra num banco de verdade. Rode com `npm run seed` (Node 24 executa
// TypeScript direto, sem build).
//
// Uso: npm run seed  ->  cole supabase/seed.sql no SQL Editor do Supabase.

import { writeFileSync } from "node:fs";
import { DEMO, type ItemDemo } from "../lib/demo.ts";

const aspas = (v: string | undefined | null): string =>
  v === undefined || v === null ? "NULL" : `'${v.replace(/'/g, "''")}'`;

const COLUNAS = [
  "titulo",
  "organizacao",
  "tipo",
  "area",
  "formato",
  "localidade",
  "faculdade_alvo",
  "prazo",
  "remuneracao",
  "contexto",
  "modo_candidatura",
  "destino",
  "quem_trouxe",
  "quem_trouxe_faculdade",
  "exibicao_quem_trouxe",
  "publicada_em",
] as const;

function valores(item: ItemDemo): string {
  const campos = [
    aspas(item.titulo),
    aspas(item.organizacao),
    aspas(item.tipo),
    aspas(item.area),
    aspas(item.formato),
    aspas(item.localidade),
    aspas(item.faculdade_alvo),
    // datas relativas: o seed continua fazendo sentido daqui a seis meses
    item.prazoEmDias === undefined
      ? "NULL"
      : `current_date + ${item.prazoEmDias}`,
    aspas(item.remuneracao),
    aspas(item.contexto),
    aspas(item.modo_candidatura),
    aspas(item.destino),
    aspas(item.quem_trouxe),
    aspas(item.quem_trouxe_faculdade),
    aspas(item.exibicao_quem_trouxe),
    `now() - interval '${item.diasAtras} days'`,
  ];
  return `  (${campos.join(", ")})`;
}

const sql = `-- ===========================================================================
-- Indica - dados de exemplo (gerado por npm run seed a partir de lib/demo.ts)
--
-- NÃO EDITE ESTE ARQUIVO À MÃO. Edite lib/demo.ts e rode npm run seed.
--
-- TUDO AQUI É FICTÍCIO: empresas, pessoas e links inventados. Serve para ver
-- o produto cheio antes de a coleta real chegar nos ~25-30 itens que o doc
-- exige para lançar. Apague antes de abrir para o público:
--
--   delete from public.oportunidades where destino like '%exemplo.invalid%'
--      or destino like '%mail.invalid%' or destino like '@%.exemplo';
-- ===========================================================================

insert into public.oportunidades
  (${COLUNAS.join(", ")})
values
${DEMO.map(valores).join(",\n")};
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql, "utf8");
console.log(`supabase/seed.sql gerado com ${DEMO.length} itens.`);
