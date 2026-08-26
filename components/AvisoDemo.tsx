import Link from "next/link";

/** Aparece so quando nao ha Supabase configurado. Melhor deixar explicito que
 *  o conteudo e ficticio do que deixar alguem achar que sao vagas reais. */
export default function AvisoDemo() {
  return (
    <div className="rounded-xl border border-dashed border-borda bg-superficie p-4 text-sm">
      <p className="font-medium">Modo demonstração</p>
      <p className="mt-1 leading-relaxed text-suave">
        Nenhum banco conectado, então a lista abaixo é <strong>fictícia</strong>{" "}
        — empresas, pessoas e links inventados, só para mostrar o formato do
        produto. Conecte o Supabase e rode <code>supabase/schema.sql</code> para
        ver dados de verdade.{" "}
        <Link href="/admin" className="underline underline-offset-2">
          instruções no painel
        </Link>
        .
      </p>
    </div>
  );
}
