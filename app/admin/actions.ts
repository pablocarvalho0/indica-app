"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { abrirSessao, exigirAdmin, fecharSessao, senhaConfere } from "@/lib/auth";
import { clienteAdmin } from "@/lib/supabase";
import {
  AREAS,
  EXIBICOES,
  FORMATOS,
  MODOS,
  TIPOS,
  type Area,
  type Exibicao,
  type Formato,
  type Modo,
  type Tipo,
} from "@/lib/types";

export type EstadoForm = { erro?: string };

// ---------------------------------------------------------------------------
// Sessao
// ---------------------------------------------------------------------------

export async function entrar(
  _estado: EstadoForm,
  fd: FormData,
): Promise<EstadoForm> {
  const senha = String(fd.get("senha") ?? "");
  if (!senha) return { erro: "Digite a senha." };
  if (!senhaConfere(senha)) return { erro: "Senha incorreta." };

  await abrirSessao();
  redirect("/admin");
}

export async function sair(): Promise<void> {
  await fecharSessao();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Oportunidades
// ---------------------------------------------------------------------------

function texto(fd: FormData, campo: string): string {
  return String(fd.get(campo) ?? "").trim();
}

/** Opcional vira NULL, nunca string vazia: `faculdade_alvo = ''` e
 *  `faculdade_alvo IS NULL` significam a mesma coisa para o usuario, e ter os
 *  dois no banco quebra a contagem de filtro. */
function opcional(fd: FormData, campo: string): string | null {
  return texto(fd, campo) || null;
}

function umDe<T extends string>(valor: string, permitidos: readonly T[]): T | null {
  return (permitidos as readonly string[]).includes(valor) ? (valor as T) : null;
}

type Payload = {
  titulo: string;
  organizacao: string;
  tipo: Tipo;
  area: Area;
  formato: Formato | null;
  localidade: string | null;
  faculdade_alvo: string | null;
  prazo: string | null;
  remuneracao: string | null;
  contexto: string | null;
  modo_candidatura: Modo;
  destino: string;
  quem_trouxe: string;
  quem_trouxe_faculdade: string | null;
  exibicao_quem_trouxe: Exibicao;
};

/** Valida do lado do servidor o mesmo que os CHECKs validam no banco. O banco
 *  e a rede de seguranca; aqui e onde a mensagem de erro fica legivel. */
function interpretar(fd: FormData): { dados: Payload } | { erro: string } {
  const titulo = texto(fd, "titulo");
  if (!titulo) return { erro: "Título é obrigatório." };

  const organizacao = texto(fd, "organizacao");
  if (!organizacao) return { erro: "Organização é obrigatória." };

  const tipo = umDe(texto(fd, "tipo"), TIPOS);
  if (!tipo) return { erro: "Escolha o tipo." };

  const area = umDe(texto(fd, "area"), AREAS);
  if (!area) return { erro: "Escolha a área." };

  const formatoBruto = texto(fd, "formato");
  const formato = formatoBruto ? umDe(formatoBruto, FORMATOS) : null;
  if (formatoBruto && !formato) return { erro: "Formato inválido." };

  const modo_candidatura = umDe(texto(fd, "modo_candidatura"), MODOS);
  if (!modo_candidatura) return { erro: "Escolha o modo de candidatura." };

  let destino = texto(fd, "destino");
  if (!destino) {
    return {
      erro:
        modo_candidatura === "link"
          ? "Cole o link da vaga."
          : "Informe o contato.",
    };
  }
  if (modo_candidatura === "link") {
    // "empresa.com/vaga" colado do WhatsApp vira URL valida sem o admin
    // precisar pensar nisso. Um segundo a menos no cronometro de 60s.
    if (!/^https?:\/\//i.test(destino)) destino = `https://${destino}`;
    try {
      new URL(destino);
    } catch {
      return { erro: "Esse link não parece válido." };
    }
  }

  const quem_trouxe = texto(fd, "quem_trouxe");
  if (!quem_trouxe) return { erro: "Diga quem trouxe a oportunidade." };

  const exibicao_quem_trouxe = umDe(texto(fd, "exibicao_quem_trouxe"), EXIBICOES);
  if (!exibicao_quem_trouxe) return { erro: "Escolha como creditar quem trouxe." };

  const quem_trouxe_faculdade = opcional(fd, "quem_trouxe_faculdade");
  if (exibicao_quem_trouxe === "primeiro-nome-faculdade" && !quem_trouxe_faculdade) {
    return { erro: "Para creditar com faculdade, informe a faculdade de quem trouxe." };
  }

  const prazo = opcional(fd, "prazo");
  if (prazo && !/^\d{4}-\d{2}-\d{2}$/.test(prazo)) {
    return { erro: "Prazo inválido." };
  }

  return {
    dados: {
      titulo,
      organizacao,
      tipo,
      area,
      formato,
      localidade: opcional(fd, "localidade"),
      faculdade_alvo: opcional(fd, "faculdade_alvo"),
      prazo,
      remuneracao: opcional(fd, "remuneracao"),
      contexto: opcional(fd, "contexto"),
      modo_candidatura,
      destino,
      quem_trouxe,
      quem_trouxe_faculdade,
      exibicao_quem_trouxe,
    },
  };
}

export async function salvar(
  _estado: EstadoForm,
  fd: FormData,
): Promise<EstadoForm> {
  await exigirAdmin();

  const lido = interpretar(fd);
  if ("erro" in lido) return lido;

  const id = texto(fd, "id");
  const db = clienteAdmin();

  const { error } = id
    ? await db.from("oportunidades").update(lido.dados).eq("id", id)
    : await db.from("oportunidades").insert(lido.dados);

  if (error) return { erro: `Não salvou: ${error.message}` };

  revalidatePath("/");
  revalidatePath("/admin");

  // Cadastro em lote e o modo de uso real: o admin senta e joga cinco vagas
  // que juntou na semana. Voltar para o formulario limpo evita cinco viagens
  // pelo painel.
  redirect(texto(fd, "acao") === "salvar-e-nova" ? "/admin/nova?salvo=1" : "/admin");
}

export async function alternarPublicacao(fd: FormData): Promise<void> {
  await exigirAdmin();

  const id = String(fd.get("id") ?? "");
  const publicar = String(fd.get("publicar") ?? "") === "1";
  if (!id) return;

  const { error } = await clienteAdmin()
    .from("oportunidades")
    .update({ publicada: publicar })
    .eq("id", id);

  if (error) throw new Error(`Não consegui alterar a publicação: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function excluir(fd: FormData): Promise<void> {
  await exigirAdmin();

  const id = String(fd.get("id") ?? "");
  if (!id) return;

  const { error } = await clienteAdmin().from("oportunidades").delete().eq("id", id);
  if (error) throw new Error(`Não consegui excluir: ${error.message}`);

  revalidatePath("/");
  revalidatePath("/admin");
}
