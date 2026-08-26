"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { salvar, type EstadoForm } from "@/app/admin/actions";
import {
  AJUDA_MODO,
  AREAS,
  EXIBICOES,
  FACULDADES_SUGERIDAS,
  FORMATOS,
  LABEL_EXIBICAO,
  LABEL_FORMATO,
  LABEL_MODO,
  MODOS,
  TIPOS,
  type Area,
  type Exibicao,
  type Formato,
  type Modo,
  type Oportunidade,
  type Tipo,
} from "@/lib/types";

const INICIAL: EstadoForm = {};

/**
 * Cadastrar em menos de 60 segundos e requisito de PRODUTO, nao de UX
 * (doc, secao 4). Se demorar mais, o projeto morre no mes 2 por fadiga de
 * admin. Tres decisoes vem dai:
 *
 *  - So o essencial fica na tela. O resto vive atras de "mais campos".
 *  - Enum e pastilha, nao select: um toque em vez de abrir, rolar e escolher.
 *  - "Publicar e cadastrar outra" existe porque o uso real e em lote.
 *
 * A excecao deliberada e "o que voce precisa saber": e opcional no schema,
 * mas fica em cima, visivel, com peso. E o efeito QI engarrafado - a coisa
 * mais dificil de copiar no produto inteiro. Escondido atras de um accordion
 * nunca seria preenchido, e o produto viraria um agregador de links qualquer.
 */
export default function FormOportunidade({ inicial }: { inicial?: Oportunidade }) {
  const [estado, acao, enviando] = useActionState(salvar, INICIAL);

  const [tipo, setTipo] = useState<Tipo>(inicial?.tipo ?? "vaga");
  const [area, setArea] = useState<Area | "">(inicial?.area ?? "");
  const [modo, setModo] = useState<Modo>(inicial?.modo_candidatura ?? "link");
  const [exibicao, setExibicao] = useState<Exibicao>(
    inicial?.exibicao_quem_trouxe ?? "nome",
  );
  const [formato, setFormato] = useState<Formato | "">(inicial?.formato ?? "");

  const editando = Boolean(inicial);

  return (
    <form action={acao} className="space-y-7">
      <input type="hidden" name="id" value={inicial?.id ?? ""} />

      <div className="space-y-4">
        <div>
          <label htmlFor="titulo" className="rotulo">
            Título
          </label>
          <input
            id="titulo"
            name="titulo"
            required
            autoFocus={!editando}
            defaultValue={inicial?.titulo}
            placeholder="Analista de sourcing"
            className="campo"
          />
        </div>

        <div>
          <label htmlFor="organizacao" className="rotulo">
            Organização
          </label>
          <input
            id="organizacao"
            name="organizacao"
            required
            defaultValue={inicial?.organizacao}
            placeholder="Nome do fundo, startup ou empresa"
            className="campo"
          />
        </div>

        <Grupo rotulo="Tipo">
          <Pastilhas
            name="tipo"
            valores={TIPOS}
            selecionado={tipo}
            aoEscolher={(v) => setTipo(v as Tipo)}
          />
        </Grupo>

        <Grupo rotulo="Área">
          <Pastilhas
            name="area"
            valores={AREAS}
            selecionado={area}
            aoEscolher={(v) => setArea(v as Area)}
          />
        </Grupo>
      </div>

      <div>
        <label htmlFor="contexto" className="rotulo">
          O que você precisa saber
        </label>
        <textarea
          id="contexto"
          name="contexto"
          rows={4}
          defaultValue={inicial?.contexto ?? ""}
          placeholder="Processo é rápido, 2 conversas. Querem alguém que já mexeu com modelagem. Paga acima do mercado para estágio."
          className="campo resize-y"
        />
        <p className="dica">
          O que circula no grupo junto com o link. É a parte mais valiosa do
          card — vale os 20 segundos.
        </p>
      </div>

      <div className="space-y-4">
        <Grupo rotulo="Como a pessoa se candidata">
          <Pastilhas
            name="modo_candidatura"
            valores={MODOS}
            rotulos={LABEL_MODO}
            selecionado={modo}
            aoEscolher={(v) => setModo(v as Modo)}
          />
          <p className="dica">{AJUDA_MODO[modo]}</p>
        </Grupo>

        {modo === "contato" && (
          <p className="rounded-lg bg-atencao-fraco px-3.5 py-3 text-sm text-atencao">
            Só publique contato do dono da vaga com autorização explícita dele.
            Sem autorização, use <strong>via ponte</strong> — contato que chegou
            em privado não vai para uma página aberta.
          </p>
        )}

        <div>
          <label htmlFor="destino" className="rotulo">
            {modo === "link" ? "Link da vaga" : "Contato"}
          </label>
          <input
            id="destino"
            name="destino"
            required
            defaultValue={inicial?.destino}
            inputMode={modo === "link" ? "url" : "text"}
            placeholder={
              modo === "link"
                ? "empresa.com/vagas/analista"
                : "WhatsApp, e-mail ou @ do LinkedIn"
            }
            className="campo"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="quem_trouxe" className="rotulo">
            Quem trouxe
          </label>
          <input
            id="quem_trouxe"
            name="quem_trouxe"
            required
            defaultValue={inicial?.quem_trouxe}
            placeholder="Nome completo (uso interno)"
            className="campo"
          />
        </div>

        <Grupo rotulo="Como creditar no card">
          <Pastilhas
            name="exibicao_quem_trouxe"
            valores={EXIBICOES}
            rotulos={LABEL_EXIBICAO}
            selecionado={exibicao}
            aoEscolher={(v) => setExibicao(v as Exibicao)}
          />
          <p className="dica">
            Escolha de quem trouxe, não sua. É dado pessoal numa página aberta.
          </p>
        </Grupo>

        {exibicao === "primeiro-nome-faculdade" && (
          <div>
            <label htmlFor="quem_trouxe_faculdade" className="rotulo">
              Faculdade de quem trouxe
            </label>
            <input
              id="quem_trouxe_faculdade"
              name="quem_trouxe_faculdade"
              required
              list="faculdades"
              defaultValue={inicial?.quem_trouxe_faculdade ?? ""}
              placeholder="Insper"
              className="campo"
            />
          </div>
        )}
      </div>

      <details open={editando} className="rounded-xl border border-borda p-4">
        <summary className="cursor-pointer text-sm font-medium select-none">
          mais campos
          <span className="ml-2 font-normal text-suave">todos opcionais</span>
        </summary>

        <div className="mt-4 space-y-4">
          <Grupo rotulo="Formato">
            {/* O "—" e uma opcao de verdade: radio marcado nao dispara change
                ao ser clicado de novo, entao limpar precisa de alvo proprio. */}
            <Pastilhas
              name="formato"
              valores={["", ...FORMATOS]}
              rotulos={{ "": "—", ...LABEL_FORMATO }}
              selecionado={formato}
              aoEscolher={(v) => setFormato(v as Formato | "")}
            />
          </Grupo>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="localidade" className="rotulo">
                Local
              </label>
              <input
                id="localidade"
                name="localidade"
                defaultValue={inicial?.localidade ?? ""}
                placeholder="remoto ou São Paulo"
                className="campo"
              />
            </div>

            <div>
              <label htmlFor="remuneracao" className="rotulo">
                Remuneração
              </label>
              <input
                id="remuneracao"
                name="remuneracao"
                defaultValue={inicial?.remuneracao ?? ""}
                placeholder="R$ 3.000"
                className="campo"
              />
              <p className="dica">Perseguir sempre. É o maior diferencial.</p>
            </div>

            <div>
              <label htmlFor="faculdade_alvo" className="rotulo">
                Faculdade-alvo
              </label>
              <input
                id="faculdade_alvo"
                name="faculdade_alvo"
                list="faculdades"
                defaultValue={inicial?.faculdade_alvo ?? ""}
                placeholder="vazio = aberta a todas"
                className="campo"
              />
            </div>

            <div>
              <label htmlFor="prazo" className="rotulo">
                Prazo
              </label>
              <input
                id="prazo"
                name="prazo"
                type="date"
                defaultValue={inicial?.prazo ?? ""}
                className="campo"
              />
              <p className="dica">Some da lista sozinha quando vencer.</p>
            </div>
          </div>
        </div>
      </details>

      <datalist id="faculdades">
        {FACULDADES_SUGERIDAS.map((f) => (
          <option key={f} value={f} />
        ))}
      </datalist>

      {estado.erro && (
        <p className="rounded-lg bg-destaque-fraco px-3.5 py-3 text-sm text-destaque">
          {estado.erro}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-borda pt-5">
        <button
          type="submit"
          name="acao"
          value="salvar"
          disabled={enviando}
          className="botao"
        >
          {enviando ? "salvando…" : editando ? "salvar alterações" : "publicar"}
        </button>

        {!editando && (
          <button
            type="submit"
            name="acao"
            value="salvar-e-nova"
            disabled={enviando}
            className="botao-fantasma"
          >
            publicar e cadastrar outra
          </button>
        )}

        <Link href="/admin" className="text-sm text-suave hover:text-tinta">
          cancelar
        </Link>
      </div>
    </form>
  );
}

function Grupo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="rotulo">{rotulo}</legend>
      {children}
    </fieldset>
  );
}

/** Radio nativo com cara de pastilha: acessivel por teclado, entra no FormData
 *  sozinho e e um toque so no celular. */
function Pastilhas({
  name,
  valores,
  selecionado,
  aoEscolher,
  rotulos,
}: {
  name: string;
  valores: readonly string[];
  selecionado: string;
  aoEscolher: (valor: string) => void;
  rotulos?: Record<string, string>;
}) {
  return (
    <div className="mt-1 flex flex-wrap gap-2">
      {valores.map((valor) => {
        const ativo = selecionado === valor;
        return (
          <label key={valor} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={valor}
              checked={ativo}
              onChange={() => aoEscolher(valor)}
              className="sr-only"
            />
            <span className={`chip ${ativo ? "chip-ativo" : ""}`}>
              {rotulos?.[valor] ?? valor}
            </span>
          </label>
        );
      })}
    </div>
  );
}
