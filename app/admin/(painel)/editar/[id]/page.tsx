import Link from "next/link";
import { notFound } from "next/navigation";
import FormOportunidade from "@/components/FormOportunidade";
import { buscarParaAdmin } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Editar({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await buscarParaAdmin(id);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl tracking-tight">Editar</h1>
          <p className="text-sm text-suave">
            {item.cliques} {item.cliques === 1 ? "clique" : "cliques"} até agora
          </p>
        </div>
        <Link href="/admin" className="text-sm text-suave hover:text-tinta">
          voltar
        </Link>
      </div>

      <FormOportunidade inicial={item} />
    </div>
  );
}
