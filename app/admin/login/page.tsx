import { redirect } from "next/navigation";
import FormularioLogin from "@/components/FormularioLogin";
import { adminConfigurado, estaAutenticado } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Login() {
  if (await estaAutenticado()) redirect("/admin");

  if (!adminConfigurado()) {
    return (
      <div className="mx-auto max-w-md space-y-4 py-10">
        <h1 className="font-serif text-2xl tracking-tight">Painel não configurado</h1>
        <p className="leading-relaxed text-suave">
          Defina <code>ADMIN_PASSWORD</code> e <code>ADMIN_SECRET</code> no
          ambiente (<code>.env</code> em desenvolvimento, variáveis de
          projeto na Vercel) e reinicie o servidor.
        </p>
        <p className="text-sm text-suave">
          Para gerar o segredo:
          <br />
          <code className="break-all">
            node -e &quot;console.log(require(&apos;crypto&apos;).randomBytes(32).toString(&apos;hex&apos;))&quot;
          </code>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm space-y-6 py-10">
      <div>
        <h1 className="font-serif text-2xl tracking-tight">Painel do Indica</h1>
        <p className="mt-1 text-sm text-suave">
          A curadoria da v0 é de uma pessoa só.
        </p>
      </div>
      <FormularioLogin />
    </div>
  );
}
