import Link from "next/link";
import CardOportunidade from "@/components/CardOportunidade";
import Filtros from "@/components/Filtros";
import AvisoDemo from "@/components/AvisoDemo";
import {
  aplicarFiltros,
  listarPublicas,
  opcoesDeArea,
  opcoesDeFaculdade,
  opcoesDeTipo,
  type Filtros as FiltrosAtivos,
} from "@/lib/queries";
import { supabaseConfigurado } from "@/lib/supabase";

// Frescor e metade do valor do produto (doc, secao 1). Nada de cache aqui:
// a lista e sempre lida na hora.
export const dynamic = "force-dynamic";

type Busca = Promise<Record<string, string | string[] | undefined>>;

export default async function Home({ searchParams }: { searchParams: Busca }) {
  const demonstracao = !supabaseConfigurado();
  const params = await searchParams;
  const ativos: FiltrosAtivos = {
    area: umValor(params.area),
    faculdade: umValor(params.faculdade),
    tipo: umValor(params.tipo),
  };

  const todos = await listarPublicas();
  const itens = aplicarFiltros(todos, ativos);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="font-serif text-3xl leading-tight tracking-tight text-balance sm:text-4xl">
          Vaga boa sempre foi QI.
          <br />
          <span className="text-destaque">A gente só abriu o Q.</span>
        </h1>
        <p className="max-w-xl leading-relaxed text-suave">
          Oportunidades que circulam por indicação nas melhores faculdades do
          Brasil — reunidas num lugar só. Sem login, sem cadastro.
        </p>
      </section>

      {demonstracao && <AvisoDemo />}

      <Filtros
        ativos={ativos}
        grupos={[
          { dimensao: "area", titulo: "área", opcoes: opcoesDeArea(todos, ativos) },
          {
            dimensao: "faculdade",
            titulo: "faculdade",
            opcoes: opcoesDeFaculdade(todos, ativos),
            nota: "o número é de vagas exclusivas; as abertas a todas aparecem em qualquer recorte",
          },
          { dimensao: "tipo", titulo: "tipo", opcoes: opcoesDeTipo(todos, ativos) },
        ]}
      />

      <div className="border-t border-borda pt-6">
        <p className="mb-4 text-sm text-suave">
          {itens.length === 0
            ? "nada por aqui"
            : `${itens.length} ${itens.length === 1 ? "oportunidade aberta" : "oportunidades abertas"}`}
          {itens.length > 0 && " · mais recentes primeiro"}
        </p>

        {itens.length === 0 ? (
          <ListaVazia temFiltro={Boolean(ativos.area || ativos.faculdade || ativos.tipo)} />
        ) : (
          <div className="space-y-4">
            {itens.map((item) => (
              <CardOportunidade key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <ChamadaParaIndicar />
    </div>
  );
}

function ListaVazia({ temFiltro }: { temFiltro: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-borda p-8 text-center">
      <p className="text-suave">
        {temFiltro
          ? "Nenhuma oportunidade nesse recorte agora."
          : "Nenhuma oportunidade aberta agora. Item com prazo vencido sai da lista sozinho."}
      </p>
      {temFiltro && (
        <Link
          href="/"
          className="mt-3 inline-block text-sm underline underline-offset-2"
        >
          ver tudo que está aberto
        </Link>
      )}
    </div>
  );
}

/* Crédito público é a moeda que faz os amigos mandarem oportunidade de graça
   (doc, seção 6). O convite fica no fim da lista, depois de a pessoa já ter
   visto que o lugar tem coisa boa. */
function ChamadaParaIndicar() {
  const contato = process.env.NEXT_PUBLIC_CONTATO_INDICACAO;
  if (!contato) return null;

  return (
    <section className="rounded-xl border border-borda bg-superficie p-5">
      <h2 className="font-medium">Sabe de uma vaga que se encaixa aqui?</h2>
      <p className="mt-1 text-sm leading-relaxed text-suave">
        Manda. Quem traz aparece no card com o crédito — do jeito que preferir:
        nome, primeiro nome + faculdade, ou anônimo.
      </p>
      <a
        href={contato}
        target="_blank"
        rel="noopener noreferrer"
        className="botao-fantasma mt-4"
      >
        indicar uma oportunidade
      </a>
    </section>
  );
}

function umValor(v: string | string[] | undefined): string | undefined {
  const valor = Array.isArray(v) ? v[0] : v;
  return valor?.trim() || undefined;
}
