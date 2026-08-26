import { exigirAdmin } from "@/lib/auth";

/** Guarda de rota das paginas do painel.
 *
 *  Nao guarda as server actions - elas sao endpoints proprios e chamam
 *  exigirAdmin() uma a uma em app/admin/actions.ts. Layout protege tela;
 *  action protege escrita. */
export default async function LayoutPainel({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirAdmin();
  return <>{children}</>;
}
