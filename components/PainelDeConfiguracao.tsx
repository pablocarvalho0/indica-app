/** Aparece no lugar da lista quando o Supabase ainda nao foi conectado.
 *  Clonar o repo e rodar `npm run dev` tem que dar instrucao, nao stack trace. */
export default function PainelDeConfiguracao() {
  const passos = [
    {
      titulo: "Crie um projeto no Supabase",
      detalhe: "supabase.com/dashboard · plano free serve para a v0.",
    },
    {
      titulo: "Rode supabase/schema.sql no SQL Editor",
      detalhe:
        "Cria a tabela, a view pública, o RLS e a função de clique. Uma vez só.",
    },
    {
      titulo: "Preencha .env",
      detalhe:
        "Copie de .env.example. As chaves estão em Project Settings › API.",
    },
    {
      titulo: "Reinicie o npm run dev",
      detalhe: "Variável de ambiente só é lida na inicialização.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl tracking-tight">Indica</h1>
        <p className="mt-2 text-suave">
          O app subiu, mas ainda não está ligado no banco.
        </p>
      </div>

      <ol className="space-y-3">
        {passos.map((passo, i) => (
          <li
            key={passo.titulo}
            className="flex gap-4 rounded-xl border border-borda bg-superficie p-4"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-destaque-fraco text-sm font-medium text-destaque">
              {i + 1}
            </span>
            <div>
              <p className="font-medium">{passo.titulo}</p>
              <p className="mt-0.5 text-sm text-suave">{passo.detalhe}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-sm text-suave">
        O passo a passo completo está no README do repositório.
      </p>
    </div>
  );
}
