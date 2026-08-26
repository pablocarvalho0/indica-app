"use client";

import { useEffect, useState } from "react";

/** Acao destrutiva em dois cliques, sem window.confirm: o segundo clique e o
 *  proprio botao mudando de rotulo, e ele volta ao normal sozinho em 4s. */
export default function BotaoConfirmar({
  rotulo,
  confirmacao,
}: {
  rotulo: string;
  confirmacao: string;
}) {
  const [armado, setArmado] = useState(false);

  useEffect(() => {
    if (!armado) return;
    const t = setTimeout(() => setArmado(false), 4000);
    return () => clearTimeout(t);
  }, [armado]);

  if (!armado) {
    return (
      <button
        type="button"
        onClick={() => setArmado(true)}
        className="text-sm text-suave underline underline-offset-2 hover:text-destaque"
      >
        {rotulo}
      </button>
    );
  }

  return (
    <button
      type="submit"
      className="text-sm font-medium text-destaque underline underline-offset-2"
    >
      {confirmacao}
    </button>
  );
}
