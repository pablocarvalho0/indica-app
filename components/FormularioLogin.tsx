"use client";

import { useActionState } from "react";
import { entrar, type EstadoForm } from "@/app/admin/actions";

const INICIAL: EstadoForm = {};

export default function FormularioLogin() {
  const [estado, acao, enviando] = useActionState(entrar, INICIAL);

  return (
    <form action={acao} className="space-y-4">
      <div>
        <label htmlFor="senha" className="rotulo">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="campo"
        />
      </div>

      {estado.erro && <p className="text-sm text-destaque">{estado.erro}</p>}

      <button type="submit" disabled={enviando} className="botao w-full">
        {enviando ? "entrando…" : "entrar"}
      </button>
    </form>
  );
}
