import { credito, prazoInfo, tempoRelativo } from "@/lib/format";
import { LABEL_FORMATO } from "@/lib/types";
import type { OportunidadePublica } from "@/lib/types";
import RevelarContato from "./RevelarContato";

export default function CardOportunidade({ item }: { item: OportunidadePublica }) {
  const prazo = prazoInfo(item.prazo);
  const linhaMeta = formatarMeta(item);

  return (
    <article className="rounded-xl border border-borda bg-superficie p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Etiqueta>{item.tipo}</Etiqueta>
          <Etiqueta>{item.area}</Etiqueta>
          {item.faculdade_alvo && (
            <Etiqueta tom="destaque">exclusiva {item.faculdade_alvo}</Etiqueta>
          )}
        </div>
        <time
          dateTime={item.publicada_em}
          className="shrink-0 pt-1 text-xs whitespace-nowrap text-suave"
        >
          {tempoRelativo(item.publicada_em)}
        </time>
      </div>

      <h2 className="mt-3 text-lg leading-snug font-semibold text-balance">
        {item.titulo}
      </h2>
      <p className="text-tinta/80">{item.organizacao}</p>
      {linhaMeta && <p className="mt-1 text-sm text-suave">{linhaMeta}</p>}

      {/*
        "O que voce precisa saber" - o efeito QI engarrafado (doc, secao 6).
        E a coisa mais dificil de copiar no produto inteiro, entao e a que tem
        mais peso visual no card. Nao encolher isso numa reforma de layout.
      */}
      {item.contexto && (
        <div className="mt-4 rounded-lg bg-destaque-fraco p-3.5">
          <p className="text-[11px] font-semibold tracking-wide text-destaque uppercase">
            o que você precisa saber
          </p>
          <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line">
            {item.contexto}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-borda pt-4">
        <p className="text-sm text-suave">
          trazido por <span className="font-medium text-tinta">{credito(item)}</span>
        </p>
        {prazo && (
          <span
            className={
              "rounded-full px-2.5 py-1 text-xs font-medium " +
              (prazo.nivel === "urgente"
                ? "bg-destaque-fraco text-destaque"
                : prazo.nivel === "proximo"
                  ? "bg-atencao-fraco text-atencao"
                  : "text-suave")
            }
          >
            {prazo.texto}
          </span>
        )}
      </div>

      <div className="mt-3">
        {item.modo_candidatura === "link" ? (
          // Sai do app, como manda o doc. O /api/ir conta o clique e redireciona.
          <a
            href={`/api/ir/${item.id}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="botao w-full sm:w-auto"
          >
            candidatar-se
            <span aria-hidden="true">→</span>
          </a>
        ) : (
          <RevelarContato
            id={item.id}
            rotulo={
              item.modo_candidatura === "ponte"
                ? `falar com ${primeiroNome(credito(item))}`
                : "ver contato"
            }
          />
        )}
        {item.modo_candidatura === "ponte" && (
          <p className="mt-2 text-xs text-suave">
            Essa vaga é via ponte: quem trouxe faz a indicação.
          </p>
        )}
      </div>
    </article>
  );
}

function Etiqueta({
  children,
  tom = "neutro",
}: {
  children: React.ReactNode;
  tom?: "neutro" | "destaque";
}) {
  return (
    <span
      className={
        "rounded-full px-2.5 py-1 text-xs " +
        (tom === "destaque"
          ? "bg-destaque-fraco font-medium text-destaque"
          : "border border-borda text-suave")
      }
    >
      {children}
    </span>
  );
}

function formatarMeta(item: OportunidadePublica): string {
  return [
    item.localidade,
    item.formato ? LABEL_FORMATO[item.formato] : null,
    item.remuneracao,
  ]
    .filter(Boolean)
    .join(" · ");
}

function primeiroNome(nome: string): string {
  return nome.split(" ")[0] ?? nome;
}
