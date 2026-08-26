import Link from "next/link";

export const metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-borda">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/admin" className="font-serif text-xl tracking-tight">
            Indica <span className="text-suave">· painel</span>
          </Link>
          <Link href="/" className="text-sm text-suave hover:text-tinta">
            ver o site
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8">{children}</main>
    </div>
  );
}
