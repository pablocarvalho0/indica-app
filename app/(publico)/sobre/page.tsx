import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O que entra aqui",
  description:
    "O critério de curadoria do Indica: se você acharia a vaga sozinho no LinkedIn em 20 minutos, ela não entra.",
};

// Conteudo tirado direto da secao 2 do documento de escopo. O criterio e o
// ativo do produto: no dia em que isso virar "vagas em geral", o valor para
// quem posta evapora e o supply seca. Aberto nao e generico.
const ENTRA = [
  "off-cycle de fundo",
  "sourcing ou analyst de VC",
  "primeiro hire de startup seed",
  "tech em scale-up por indicação",
  "vaga aberta especificamente para uma faculdade",
  "oportunidade que um amigo abriu no próprio time",
];

const NAO_ENTRA = [
  "programa de estágio de multinacional",
  "trainee de banco",
  "MBB",
  "qualquer coisa com landing page e campanha de campus própria",
];

export default function Sobre() {
  const contato = process.env.NEXT_PUBLIC_CONTATO_INDICACAO;

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="font-serif text-3xl tracking-tight">O que entra aqui</h1>
        <p className="text-lg leading-relaxed text-balance">
          Se a pessoa acharia essa oportunidade sozinha buscando no LinkedIn por
          20 minutos, ela não entra.
        </p>
        <p className="leading-relaxed text-suave">
          Esse é o critério de admissão — o teste do canal. Área é filtro, não
          critério. O que fica de fora não fica por ser ruim; fica por já ser
          visível.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Lista titulo="Entra" itens={ENTRA} tom="destaque" />
        <Lista titulo="Não entra" itens={NAO_ENTRA} tom="neutro" />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl tracking-tight">
          Por que isso importa
        </h2>
        <p className="leading-relaxed text-suave">
          Vaga boa para universitário de faculdade seletiva circula por canal
          fechado: grupo de WhatsApp da turma, indicação, DM. Cada bolha vê um
          pedaço diferente do mercado. E quem está dentro do grupo não recebe só
          o link — recebe o contexto: que o processo é rápido, quanto paga, o
          que eles querem. Esse contexto é a vantagem real, e é por isso que
          todo card aqui tem um campo{" "}
          <span className="text-tinta">o que você precisa saber</span>.
        </p>
        <p className="leading-relaxed text-suave">
          Quem trouxe a vaga aparece no card e escolhe como aparecer: nome,
          primeiro nome + faculdade, ou anônimo. Contato de dono de vaga só é
          publicado com autorização explícita dele — o que chegou em privado
          fica em privado.
        </p>
      </section>

      {contato && (
        <section className="rounded-xl border border-borda bg-superficie p-5">
          <h2 className="font-medium">Passou no teste do canal?</h2>
          <p className="mt-1 text-sm leading-relaxed text-suave">
            Manda a vaga. A curadoria ainda é feita por uma pessoa só, na mão.
          </p>
          <a
            href={contato}
            target="_blank"
            rel="noopener noreferrer"
            className="botao-fantasma mt-4"
          >
            indicar uma oportunidade
          </a>
        </section>
      )}
    </div>
  );
}

function Lista({
  titulo,
  itens,
  tom,
}: {
  titulo: string;
  itens: string[];
  tom: "destaque" | "neutro";
}) {
  return (
    <div className="rounded-xl border border-borda bg-superficie p-5">
      <h2
        className={`text-sm font-semibold tracking-wide uppercase ${
          tom === "destaque" ? "text-destaque" : "text-suave"
        }`}
      >
        {titulo}
      </h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        {itens.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span aria-hidden="true" className="text-suave">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
