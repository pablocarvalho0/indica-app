"use client";

import { useState } from "react";

/**
 * Modos "via ponte" e "contato direto autorizado" (doc, secao 6).
 *
 * O contato NAO vem no HTML da pagina. Ele so sai do banco depois de um
 * clique, pela funcao registrar_clique() - que na mesma transacao conta o
 * clique e devolve o destino. Dois motivos: e dado pessoal de terceiro numa
 * pagina aberta, e a metrica de cliques do doc (secao 7) precisa valer
 * tambem para os modos que nao sao link.
 */
export default function RevelarContato({
  id,
  rotulo,
}: {
  id: string;
  rotulo: string;
}) {
  const [contato, setContato] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  async function revelar() {
    setCarregando(true);
    setErro(null);
    try {
      const r = await fetch(`/api/contato/${id}`, { method: "POST" });
      if (!r.ok) throw new Error();
      const dados = (await r.json()) as { destino?: string };
      if (!dados.destino) throw new Error();
      setContato(dados.destino);
    } catch {
      setErro("Não consegui buscar o contato. Recarrega a página e tenta de novo.");
    } finally {
      setCarregando(false);
    }
  }

  async function copiar() {
    if (!contato) return;
    try {
      await navigator.clipboard.writeText(contato);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* clipboard bloqueado: o texto esta na tela, da para selecionar */
    }
  }

  if (contato) {
    const href = comoLink(contato);
    return (
      <div className="rounded-lg border border-borda bg-fundo p-3">
        <p className="text-xs text-suave">fala com</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="font-medium break-all text-destaque underline underline-offset-2"
            >
              {contato}
            </a>
          ) : (
            <span className="font-medium break-all">{contato}</span>
          )}
          <button
            type="button"
            onClick={copiar}
            className="shrink-0 text-xs text-suave underline underline-offset-2 hover:text-tinta"
          >
            {copiado ? "copiado" : "copiar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={revelar}
        disabled={carregando}
        className="botao w-full sm:w-auto"
      >
        {carregando ? "buscando…" : rotulo}
      </button>
      {erro && <p className="mt-2 text-sm text-destaque">{erro}</p>}
    </div>
  );
}

/** Transforma o contato em algo clicavel quando da. Se nao der, vira texto
 *  puro com botao de copiar - melhor que um link quebrado. */
function comoLink(contato: string): string | null {
  const v = contato.trim();
  if (/^https?:\/\//i.test(v)) return v;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return `mailto:${v}`;

  const digitos = v.replace(/\D/g, "");
  if (/^[+\d][\d\s().-]{7,}$/.test(v) && digitos.length >= 10) {
    return `https://wa.me/${digitos.length <= 11 ? `55${digitos}` : digitos}`;
  }
  return null;
}
