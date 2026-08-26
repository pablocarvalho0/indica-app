import Link from "next/link";
import BotaoConfirmar from "@/components/BotaoConfirmar";
import PainelDeConfiguracao from "@/components/PainelDeConfiguracao";
import { alternarPublicacao, excluir, sair } from "@/app/admin/actions";
import { dataCurta, diasAte, tempoRelativo } from "@/lib/format";
import { listarTodasParaAdmin, situacao, venceEstaSemana } from "@/lib/queries";
import { supabaseConfigurado } from "@/lib/supabase";
import { LABEL_MODO, type Oportunidade } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Painel() {
  if (!supabaseConfigurado()) return <PainelDeConfiguracao />;

  const todas = await listarTodasParaAdmin();
  const vencendo = venceEstaSemana(todas);

  const noAr = todas.filter((i) => {
    const s = situacao(i);
    return s === "no-ar" || s === "vencendo";
  });
  const novasNaSemana = todas.filter((i) => diasAte(i.publicada_em.slice(0, 10)) > -7);
  const cliques = todas.reduce((soma, i) => soma + i.cliques, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl tracking-tight">Oportunidades</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/nova" className="botao">
            nova oportunidade
          </Link>
          <form action={sair}>
            <button type="submit" className="text-sm text-suave hover:text-tinta">
              sair
            </button>
          </form>
        </div>
      </div>

      {/*
        As metricas do doc, secao 7 - de proposito nao ha "usuarios
        cadastrados" aqui. Supply e o gargalo real; clique e o unico proxy de
        valor entregue na v0.
      */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metrica valor={noAr.length} rotulo="no ar" alerta={noAr.length < 25} />
        <Metrica valor={novasNaSemana.length} rotulo="novas em 7 dias" />
        <Metrica valor={cliques} rotulo="cliques totais" />
        <Metrica valor={vencendo.length} rotulo="vencem em 7 dias" />
      </section>

      {noAr.length < 25 && (
        <p className="rounded-lg bg-atencao-fraco px-3.5 py-3 text-sm text-atencao">
          Regra de operação: não lançar com menos de ~25–30 itens vivos. Lista
          vazia parece morta e queima a primeira impressão. Faltam{" "}
          {Math.max(0, 25 - noAr.length)}.
        </p>
      )}

      {vencendo.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-suave uppercase">
            vence essa semana
          </h2>
          <ul className="divide-y divide-borda overflow-hidden rounded-xl border border-borda bg-superficie">
            {vencendo.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.titulo}</p>
                  <p className="truncate text-xs text-suave">{item.organizacao}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-atencao">
                  {item.prazo ? dataCurta(item.prazo) : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-wide text-suave uppercase">
          tudo ({todas.length})
        </h2>

        {todas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-borda p-8 text-center">
            <p className="text-suave">Nenhuma oportunidade cadastrada ainda.</p>
            <Link
              href="/admin/nova"
              className="mt-3 inline-block text-sm underline underline-offset-2"
            >
              cadastrar a primeira
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {todas.map((item) => (
              <Linha key={item.id} item={item} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metrica({
  valor,
  rotulo,
  alerta = false,
}: {
  valor: number;
  rotulo: string;
  alerta?: boolean;
}) {
  return (
    <div className="rounded-xl border border-borda bg-superficie p-4">
      <p
        className={`font-serif text-2xl tabular-nums ${alerta ? "text-atencao" : ""}`}
      >
        {valor}
      </p>
      <p className="mt-0.5 text-xs text-suave">{rotulo}</p>
    </div>
  );
}

const CORES_SITUACAO: Record<string, string> = {
  "no-ar": "text-suave",
  vencendo: "text-atencao",
  vencida: "text-destaque",
  despublicada: "text-suave",
};

const ROTULO_SITUACAO: Record<string, string> = {
  "no-ar": "no ar",
  vencendo: "vence essa semana",
  vencida: "vencida — fora da lista",
  despublicada: "despublicada",
};

function Linha({ item }: { item: Oportunidade }) {
  const estado = situacao(item);

  return (
    <li className="rounded-xl border border-borda bg-superficie p-4">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{item.titulo}</p>
          <p className="text-sm text-suave">
            {item.organizacao} · {item.area} · {LABEL_MODO[item.modo_candidatura]}
          </p>
        </div>
        <div className="text-right text-xs whitespace-nowrap">
          <p className={CORES_SITUACAO[estado]}>{ROTULO_SITUACAO[estado]}</p>
          <p className="text-suave">
            {tempoRelativo(item.publicada_em)} · {item.cliques}{" "}
            {item.cliques === 1 ? "clique" : "cliques"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-borda pt-3">
        <Link
          href={`/admin/editar/${item.id}`}
          className="text-sm underline underline-offset-2"
        >
          editar
        </Link>

        <form action={alternarPublicacao}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="publicar" value={item.publicada ? "0" : "1"} />
          <button
            type="submit"
            className="text-sm text-suave underline underline-offset-2 hover:text-tinta"
          >
            {item.publicada ? "despublicar" : "publicar de novo"}
          </button>
        </form>

        <form action={excluir} className="ml-auto">
          <input type="hidden" name="id" value={item.id} />
          <BotaoConfirmar rotulo="excluir" confirmacao="confirmar exclusão" />
        </form>
      </div>
    </li>
  );
}
