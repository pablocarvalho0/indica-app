-- ===========================================================================
-- Indica - schema v0
-- Rode este arquivo inteiro no SQL Editor do Supabase (uma vez).
-- ===========================================================================
-- Principio do doc, secao 4: UMA entidade so. Os quatro tipos (vaga,
-- off-cycle, programa, freela) sao um produto com um enum, nao quatro
-- produtos. Por isso `tipo` existe desde o dia 1, mesmo que a curadoria
-- da v0 use so dois valores.
--
-- Usamos text + CHECK em vez de ENUM nativo: adicionar um valor novo vira
-- um ALTER de constraint, nao uma migracao de tipo.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- --------------------------------------------------------------------------
-- Fuso: "vence hoje" precisa vencer a meia-noite de Brasilia, nao de UTC.
-- --------------------------------------------------------------------------
create or replace function public.hoje_br()
returns date
language sql
stable
set search_path = public
as $$
  select (now() at time zone 'America/Sao_Paulo')::date;
$$;

-- --------------------------------------------------------------------------
-- Tabela
-- --------------------------------------------------------------------------
create table if not exists public.oportunidades (
  id uuid primary key default gen_random_uuid(),

  -- obrigatorios
  titulo                text not null check (length(trim(titulo)) between 1 and 160),
  organizacao           text not null check (length(trim(organizacao)) between 1 and 120),
  tipo                  text not null check (tipo in ('vaga','off-cycle','programa','freela')),
  area                  text not null check (area in ('MF','VC/PE','tech/dev','produto','dados','consultoria','outros')),

  -- opcionais
  formato               text check (formato in ('estagio','CLT','PJ','projeto')),
  localidade            text,           -- "remoto" ou cidade. (`local` e palavra reservada no Postgres)
  faculdade_alvo        text,           -- NULL/'' = aberta a todas
  prazo                 date,           -- dispara a expiracao automatica
  remuneracao           text,           -- perseguir sempre; maior diferencial quando presente
  contexto              text,           -- "o que voce precisa saber" - o efeito QI engarrafado

  -- candidatura (doc, secao 6)
  modo_candidatura      text not null check (modo_candidatura in ('link','ponte','contato')),
  destino               text not null check (length(trim(destino)) > 0),

  -- credito de quem trouxe (doc, secao 6)
  quem_trouxe           text not null check (length(trim(quem_trouxe)) > 0),
  quem_trouxe_faculdade text,
  exibicao_quem_trouxe  text not null check (exibicao_quem_trouxe in ('nome','primeiro-nome-faculdade','anonimo')),

  -- estado
  publicada     boolean     not null default true,
  cliques       integer     not null default 0,
  publicada_em  timestamptz not null default now(),
  criada_em     timestamptz not null default now(),
  atualizada_em timestamptz not null default now(),

  -- Modo 'link' precisa de URL de verdade; 'ponte'/'contato' guardam contato livre.
  constraint destino_coerente_com_modo check (
    modo_candidatura <> 'link' or destino ~* '^https?://'
  ),
  -- Exibir "primeiro nome + faculdade" exige saber a faculdade.
  constraint faculdade_exigida_para_exibicao check (
    exibicao_quem_trouxe <> 'primeiro-nome-faculdade'
    or coalesce(trim(quem_trouxe_faculdade), '') <> ''
  )
);

create index if not exists oportunidades_feed_idx
  on public.oportunidades (publicada, prazo, publicada_em desc);

-- atualizada_em automatico
create or replace function public.toca_atualizada_em()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.atualizada_em = now();
  return new;
end;
$$;

drop trigger if exists oportunidades_atualizada_em on public.oportunidades;
create trigger oportunidades_atualizada_em
  before update on public.oportunidades
  for each row execute function public.toca_atualizada_em();

-- --------------------------------------------------------------------------
-- RLS: a tabela base fica FECHADA para o publico.
--
-- A chave anon do Supabase e publica por design - ela vai no bundle do
-- browser. Se o anon pudesse dar SELECT na tabela base, qualquer pessoa
-- leria `quem_trouxe` de um item marcado como anonimo e o `destino` de um
-- contato direto. Isso e exatamente o dado pessoal de terceiro que o doc
-- manda proteger na secao 6.
--
-- Sem policy de SELECT = ninguem le a tabela base com a chave anon.
-- O admin escreve pelo servidor com a service_role, que ignora RLS.
-- --------------------------------------------------------------------------
alter table public.oportunidades enable row level security;

revoke all on public.oportunidades from anon, authenticated;

-- --------------------------------------------------------------------------
-- View publica: o unico caminho de leitura aberto.
--
-- Ela aplica a expiracao automatica, esconde item despublicado, resolve o
-- consentimento de exibicao em texto pronto e NAO expoe `destino` nem o
-- nome real de quem pediu anonimato.
--
-- security_invoker = false (padrao): a view roda como dona (postgres) e por
-- isso enxerga a tabela base apesar do RLS. E deliberado - e o jeito de
-- fazer mascaramento de coluna no Postgres.
-- --------------------------------------------------------------------------
create or replace view public.oportunidades_publicas
with (security_invoker = false)
as
select
  o.id,
  o.titulo,
  o.organizacao,
  o.tipo,
  o.area,
  o.formato,
  o.localidade,
  o.faculdade_alvo,
  o.prazo,
  o.remuneracao,
  o.contexto,
  o.modo_candidatura,
  o.exibicao_quem_trouxe as exibicao,
  case o.exibicao_quem_trouxe
    when 'nome' then
      o.quem_trouxe
    when 'primeiro-nome-faculdade' then
      split_part(trim(o.quem_trouxe), ' ', 1) || ' · ' || o.quem_trouxe_faculdade
    else
      null                                  -- anonimo: o nome nao sai do banco
  end as creditado,
  o.publicada_em
from public.oportunidades o
where o.publicada = true
  and (o.prazo is null or o.prazo >= public.hoje_br());

grant select on public.oportunidades_publicas to anon, authenticated;

-- --------------------------------------------------------------------------
-- Clique: incrementa o contador e devolve o destino.
--
-- Uma chamada so, atomica. O `destino` (link ou contato) so sai do banco
-- por aqui, depois de um clique real - nunca no HTML da listagem.
-- Repete o filtro de publicada/prazo para nao vazar item morto.
-- --------------------------------------------------------------------------
create or replace function public.registrar_clique(item uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  alvo text;
begin
  update public.oportunidades
     set cliques = cliques + 1
   where id = item
     and publicada = true
     and (prazo is null or prazo >= public.hoje_br())
  returning destino into alvo;

  return alvo;   -- NULL se o item nao existe, esta despublicado ou venceu
end;
$$;

revoke all on function public.registrar_clique(uuid) from public;
grant execute on function public.registrar_clique(uuid) to anon, authenticated;
