import Link from "next/link";
import FormOportunidade from "@/components/FormOportunidade";

export const dynamic = "force-dynamic";

type Busca = Promise<{ salvo?: string }>;

export default async function Nova({ searchParams }: { searchParams: Busca }) {
  const { salvo } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-2xl tracking-tight">Nova oportunidade</h1>
        <Link href="/admin" className="text-sm text-suave hover:text-tinta">
          voltar
        </Link>
      </div>

      {salvo === "1" && (
        <p className="rounded-lg bg-destaque-fraco px-3.5 py-3 text-sm text-destaque">
          Publicada. Essa aqui é a próxima.
        </p>
      )}

      <FormOportunidade />
    </div>
  );
}
