import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";

// Sessao de admin sem tabela de usuario e sem provider de auth.
//
// A v0 tem exatamente um admin (Pablo). Um cookie httpOnly assinado com HMAC
// resolve isso em ~40 linhas. Quando a Fase 3 trouxer embaixadores, isso aqui
// vira Supabase Auth com papeis - e o resto do app nao muda, porque todo
// caminho protegido passa por exigirAdmin().

const COOKIE = "indica_admin";
const DURACAO_MS = 1000 * 60 * 60 * 24 * 30; // 30 dias

function segredo(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 16) {
    throw new Error(
      "ADMIN_SECRET não definida (ou curta demais). Gere com: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return s;
}

function assinar(payload: string): string {
  return createHmac("sha256", segredo()).update(payload).digest("hex");
}

/** Comparacao em tempo constante, tolerante a tamanhos diferentes. */
function iguais(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    // ainda assim consome tempo comparavel, para nao vazar o tamanho
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}

/** As duas variaveis do admin existem? Sem elas o /admin nao tem como
 *  funcionar, e uma tela dizendo isso vale mais que um erro 500. */
export function adminConfigurado(): boolean {
  return Boolean(
    process.env.ADMIN_PASSWORD && (process.env.ADMIN_SECRET ?? "").length >= 16,
  );
}

export function senhaConfere(tentativa: string): boolean {
  const esperada = process.env.ADMIN_PASSWORD;
  if (!esperada) {
    throw new Error("ADMIN_PASSWORD não definida no ambiente.");
  }
  return iguais(tentativa, esperada);
}

export async function abrirSessao(): Promise<void> {
  const expiraEm = String(Date.now() + DURACAO_MS);
  const jar = await cookies();
  jar.set(COOKIE, `${expiraEm}.${assinar(expiraEm)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACAO_MS / 1000,
  });
}

export async function fecharSessao(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function estaAutenticado(): Promise<boolean> {
  const bruto = (await cookies()).get(COOKIE)?.value;
  if (!bruto) return false;

  const [expiraEm, recebida] = bruto.split(".");
  if (!expiraEm || !recebida) return false;
  if (!iguais(recebida, assinar(expiraEm))) return false;

  return Number(expiraEm) > Date.now();
}

/** Porta de entrada de tudo que e admin: paginas E server actions.
 *  Chamar em toda action - o guard do layout nao protege a action sozinho. */
export async function exigirAdmin(): Promise<void> {
  if (!(await estaAutenticado())) {
    redirect("/admin/login");
  }
}
