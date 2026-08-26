import Link from "next/link";
import type { Filtros as FiltrosAtivos, Opcao } from "@/lib/queries";

type Grupo = {
  dimensao: keyof FiltrosAtivos;
  titulo: string;
  opcoes: Opcao[];
  /** linha curta abaixo do grupo, quando a contagem precisa de contexto */
  nota?: string;
};

/**
 * Filtros como links, sem JavaScript de cliente. Estado mora na URL, entao
 * o resultado e compartilhavel ("olha esse recorte de VC") e o botao voltar
 * do celular funciona igual a qualquer site.
 *
 * As opcoes ja chegam contadas e podadas por lib/queries - grupo vazio nao
 * renderiza, opcao que daria zero nao existe.
 */
export default function Filtros({
  ativos,
  grupos,
}: {
  ativos: FiltrosAtivos;
  grupos: Grupo[];
}) {
  const comConteudo = grupos.filter((g) => g.opcoes.length > 0);
  if (comConteudo.length === 0) return null;

  const temFiltro = Boolean(ativos.area || ativos.faculdade || ativos.tipo);

  return (
    <section aria-label="Filtros" className="space-y-3">
      {comConteudo.map((grupo) => (
        <div key={grupo.dimensao} className="flex flex-wrap items-center gap-2">
          <span className="w-16 shrink-0 text-xs tracking-wide text-suave uppercase">
            {grupo.titulo}
          </span>
          {grupo.opcoes.map((opcao) => {
            const ativo = ativos[grupo.dimensao] === opcao.valor;
            return (
              <Link
                key={opcao.valor}
                href={montarUrl(ativos, grupo.dimensao, opcao.valor)}
                scroll={false}
                aria-current={ativo ? "true" : undefined}
                className={`chip ${ativo ? "chip-ativo" : ""}`}
              >
                {opcao.valor}
                <span className="chip-contagem">{opcao.quantidade}</span>
              </Link>
            );
          })}
          {grupo.nota && (
            <p className="w-full pl-16 text-xs text-suave">{grupo.nota}</p>
          )}
        </div>
      ))}

      {temFiltro && (
        <Link
          href="/"
          scroll={false}
          className="inline-block text-sm text-suave underline underline-offset-2 hover:text-tinta"
        >
          limpar filtros
        </Link>
      )}
    </section>
  );
}

/** Clicar no filtro ativo desliga ele. Um toque para ligar, um para desligar. */
function montarUrl(
  ativos: FiltrosAtivos,
  dimensao: keyof FiltrosAtivos,
  valor: string,
): string {
  const proximo: FiltrosAtivos = {
    ...ativos,
    [dimensao]: ativos[dimensao] === valor ? undefined : valor,
  };

  const params = new URLSearchParams();
  if (proximo.area) params.set("area", proximo.area);
  if (proximo.faculdade) params.set("faculdade", proximo.faculdade);
  if (proximo.tipo) params.set("tipo", proximo.tipo);

  const query = params.toString();
  return query ? `/?${query}` : "/";
}
