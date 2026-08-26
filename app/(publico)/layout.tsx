import Link from "next/link";

export default function LayoutPublico({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-borda">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="font-serif text-2xl tracking-tight">
            Indica
          </Link>
          <nav className="text-sm text-suave">
            <Link href="/sobre" className="hover:text-tinta">
              o que entra aqui
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-8">{children}</main>

      <footer className="mt-16 border-t border-borda">
        <div className="mx-auto w-full max-w-3xl space-y-3 px-5 py-8 text-sm text-suave">
          {/*
            Doc, secao 1: dizer com honestidade o que o produto NAO quebra.
            Isso e requisito de comunicacao publica, nao enfeite - e nao trocar
            por "democratizar oportunidade".
          */}
          <p className="max-w-2xl leading-relaxed">
            O Indica quebra a bolha entre faculdades: quem entrou no ITA não
            deveria perder uma oportunidade só porque ela circulou na Insper.
            Não quebra o privilégio de acesso mais amplo — o recorte segue sendo
            faculdade seletiva, e a gente prefere dizer isso a fingir o
            contrário.
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/sobre" className="hover:text-tinta">
              critério de curadoria
            </Link>
            <span className="opacity-40">·</span>
            <span>código aberto desde a v0</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
