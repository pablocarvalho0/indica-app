#!/usr/bin/env bash
#
# retomar-frentes.sh — reabre frentes de trabalho paralelas a partir dos
# checkpoints do gstack (/context-save → /context-restore).
#
# As frentes ficam em frentes.conf, ao lado deste arquivo. Cada linha é um
# diretório; o script resolve sozinho o slug do gstack, o checkpoint mais
# recente daquele projeto e o título da frente.
#
# Uso:
#   ./retomar-frentes.sh                 lista as frentes
#   ./retomar-frentes.sh 2               abre a frente 2 NESTE terminal
#   ./retomar-frentes.sh --todas         uma aba do gnome-terminal por frente
#   ./retomar-frentes.sh --checar        só valida, não abre nada
#   ./retomar-frentes.sh --descobrir [d] checkpoints recentes do repo e worktrees
#   ./retomar-frentes.sh --gerar-tasks   reescreve .vscode/tasks.json
#
# Ambiente (opcional):
#   FRENTES_CONF      outro arquivo de frentes, no lugar do frentes.conf ao lado
#   GSTACK_SLUG_BIN   caminho do gstack-slug, se o gstack não estiver no padrão
#
# Para configurar as frentes conversando, use a skill /frentes — ela edita o
# frentes.conf e chama o --gerar-tasks por você.
#
# No VS Code o caminho normal é Ctrl+Shift+B, que roda a task composta gerada
# por --gerar-tasks e chama este mesmo script uma vez por frente.
#
# ── Diferença em relação à versão do work-leapy ──────────────────────────────
# Lá a raiz do workspace é um guarda-chuva de vários repos, e o --descobrir
# varre todos os filhos dela. Aqui o workspace É o repo, então o --descobrir
# varre o próprio repo mais os worktrees irmãos (indica-app-*), e não os
# outros projetos de estudo — cada um deles tem slug próprio e frentes próprias.

set -euo pipefail

AQUI="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONF="${FRENTES_CONF:-$AQUI/frentes.conf}"
RAIZ="$(dirname "$AQUI")"
TASKS_JSON="$RAIZ/.vscode/tasks.json"
# Sobrescrevível por ambiente, como o CONF acima: o caminho padrão é onde o
# gstack se instala, mas cravá-lo sem saída seria trocar um caminho de máquina
# por outro — justamente o que a genericização deste script foi corrigir.
GSTACK_SLUG_BIN="${GSTACK_SLUG_BIN:-$HOME/.claude/skills/gstack/bin/gstack-slug}"

# ── Pré-requisito ────────────────────────────────────────────────────────────

# Sem o gstack-slug nenhuma frente resolve, e o sintoma sem esta checagem seria
# "sem checkpoint" em TODAS elas — erro que manda procurar no lugar errado.
exigir_gstack() {
  [ -x "$GSTACK_SLUG_BIN" ] && return 0
  echo "gstack-slug não encontrado (ou sem permissão de execução) em:" >&2
  echo "  $GSTACK_SLUG_BIN" >&2
  echo "Instale o gstack, ou aponte GSTACK_SLUG_BIN para o binário." >&2
  exit 1
}

# ── Leitura da config ────────────────────────────────────────────────────────

# Preenche DIRS[] e PINS[] a partir do frentes.conf, ignorando comentários e
# linhas em branco. PINS[i] vazio = "usar o checkpoint mais recente".
DIRS=()
PINS=()
ler_conf() {
  exigir_gstack
  [ -f "$CONF" ] || { echo "Config não encontrada: $CONF" >&2; exit 1; }
  local linha dir pin
  while IFS= read -r linha || [ -n "$linha" ]; do
    linha="${linha%%#*}"                       # tira comentário de fim de linha
    linha="$(echo "$linha" | xargs 2>/dev/null || true)"   # trim
    [ -n "$linha" ] || continue
    dir="${linha%%|*}"
    pin=""
    [ "$linha" != "$dir" ] && pin="${linha#*|}"
    DIRS+=("$(echo "$dir" | xargs)")
    PINS+=("$(echo "$pin" | xargs)")
  done < "$CONF"
  [ "${#DIRS[@]}" -gt 0 ] || { echo "Nenhuma frente em $CONF" >&2; exit 1; }
}

# ── Resolução de checkpoint ──────────────────────────────────────────────────

# Slug do gstack para um diretório — mesma lógica que a skill /context-restore.
# gstack-slug imprime "SLUG=<valor>", por isso o eval.
slug_de() {
  local dir="$1"
  [ -d "$dir" ] || return 0
  (cd "$dir" && eval "$("$GSTACK_SLUG_BIN" 2>/dev/null)" && echo "${SLUG:-}") 2>/dev/null || true
}

# Caminho absoluto do checkpoint da frente $1. Vazio se não resolver.
# Sem pin, vence o maior prefixo YYYYMMDD-HHMMSS (mesmo critério da skill:
# ordena por nome, não por mtime, que é instável a cópias).
checkpoint_de() {
  local i="$1" dir="${DIRS[$i]}" pin="${PINS[$i]}" slug cpdir alvo
  slug="$(slug_de "$dir")"
  [ -n "$slug" ] || return 0
  cpdir="$HOME/.gstack/projects/$slug/checkpoints"
  [ -d "$cpdir" ] || return 0
  if [ -n "$pin" ]; then
    alvo="$cpdir/$pin"
    [ -f "$alvo" ] && echo "$alvo"
  else
    find "$cpdir" -maxdepth 1 -name "*.md" -type f 2>/dev/null | sort -r | head -1
  fi
}

# Título legível: a linha "## Working on: ..." do checkpoint, truncada.
titulo_de() {
  local arquivo="$1" t=""
  [ -f "$arquivo" ] || { echo "(sem checkpoint)"; return; }
  t="$(grep -m1 '^## Working on:' "$arquivo" 2>/dev/null || true)"
  t="${t#'## Working on:'}"
  t="$(echo "$t" | xargs 2>/dev/null || true)"
  [ -n "$t" ] || t="$(basename "$arquivo" .md)"
  [ "${#t}" -le 78 ] && echo "$t" || echo "${t:0:75}..."
}

# Versão enxuta do título, para rótulo de task e nome de aba: corta no primeiro
# travessão (os checkpoints seguem "Assunto — detalhamento longo").
titulo_curto() {
  local t
  t="$(titulo_de "$1")"
  t="${t%% — *}"
  t="${t%%: *}"
  [ "${#t}" -le 42 ] && echo "$t" || echo "${t:0:39}..."
}

# ── Comandos ─────────────────────────────────────────────────────────────────

listar() {
  ler_conf
  echo
  echo "Frentes em $(basename "$CONF"):"
  echo
  local i ckpt origem
  for i in "${!DIRS[@]}"; do
    ckpt="$(checkpoint_de "$i")"
    origem="mais recente"
    [ -n "${PINS[$i]}" ] && origem="fixado"
    printf "  %d) %s\n" "$((i + 1))" "$(titulo_de "${ckpt:-}")"
    printf "     dir:        %s\n" "${DIRS[$i]}"
    if [ -n "$ckpt" ]; then
      printf "     checkpoint: %s  (%s)\n\n" "$(basename "$ckpt")" "$origem"
    else
      printf "     checkpoint: NÃO RESOLVIDO\n\n"
    fi
  done
  echo "Abrir uma:    $0 <número>"
  echo "Abrir todas:  $0 --todas"
  echo
}

abrir() {
  ler_conf
  local n="$1" i
  if ! [[ "$n" =~ ^[0-9]+$ ]] || [ "$n" -lt 1 ] || [ "$n" -gt "${#DIRS[@]}" ]; then
    echo "Frente inválida: '$n' (esperado 1..${#DIRS[@]})" >&2
    exit 1
  fi
  i=$((n - 1))

  local dir="${DIRS[$i]}" ckpt
  [ -d "$dir" ] || { echo "Diretório não existe: $dir" >&2; exit 1; }
  ckpt="$(checkpoint_de "$i")"
  [ -n "$ckpt" ] || {
    echo "Nenhum checkpoint encontrado para $dir" >&2
    echo "Rode /context-save nessa pasta antes, ou corrija $CONF" >&2
    exit 1
  }

  echo "════════════════════════════════════════"
  echo "Frente $n: $(titulo_de "$ckpt")"
  echo "Dir:        $dir"
  echo "Checkpoint: $(basename "$ckpt")"
  echo "════════════════════════════════════════"
  echo

  cd "$dir"
  exec claude "/context-restore $(basename "$ckpt")"
}

todas() {
  ler_conf
  command -v gnome-terminal >/dev/null 2>&1 || {
    echo "gnome-terminal não encontrado. Use o Ctrl+Shift+B do VS Code." >&2
    exit 1
  }
  local i ckpt
  for i in "${!DIRS[@]}"; do
    ckpt="$(checkpoint_de "$i")"
    # `exec bash` no fim mantém a aba viva se o claude sair.
    gnome-terminal --tab --title "$(titulo_curto "${ckpt:-}")" \
      -- bash -c "'$0' $((i + 1)); exec bash"
  done
}

checar() {
  ler_conf
  local i falhas=0 ckpt
  for i in "${!DIRS[@]}"; do
    if [ ! -d "${DIRS[$i]}" ]; then
      echo "frente $((i + 1)): diretório ausente — ${DIRS[$i]}"
      falhas=$((falhas + 1)); continue
    fi
    ckpt="$(checkpoint_de "$i")"
    if [ -z "$ckpt" ]; then
      echo "frente $((i + 1)): sem checkpoint — ${DIRS[$i]}"
      falhas=$((falhas + 1))
    else
      echo "frente $((i + 1)): ok — $(titulo_de "$ckpt")"
    fi
  done
  [ "$falhas" -eq 0 ] || exit 1
}

# ── Descoberta ───────────────────────────────────────────────────────────────

# Lista checkpoints recentes do repo e dos worktrees irmãos, junto da branch de
# cada diretório. Serve de matéria-prima para a skill /frentes montar o
# frentes.conf.
# Uso: --descobrir [dias]   (padrão 3)
descobrir() {
  exigir_gstack
  local dias="${1:-3}" dir slug branch corte pai base
  corte="$(date -d "$dias days ago" +%Y%m%d 2>/dev/null || echo 00000000)"
  pai="$(dirname "$RAIZ")"
  base="$(basename "$RAIZ")"

  # Mapa slug → diretórios. O repo e seus worktrees compartilham o slug (mesmo
  # remote), então esse mapa quase sempre tem uma chave com vários diretórios —
  # é justamente o caso em que o pin passa a ser obrigatório.
  declare -A DIRS_DO_SLUG=()
  for dir in "$RAIZ" "$pai/$base"-*/; do
    dir="${dir%/}"
    [ -d "$dir" ] || continue
    slug="$(slug_de "$dir")"
    [ -n "$slug" ] || continue
    branch="$(git -C "$dir" branch --show-current 2>/dev/null || echo "-")"
    DIRS_DO_SLUG["$slug"]+="$dir|${branch:--}"$'\n'
  done

  local s cpdir arquivo nome data hora titulo cbranch linha
  for s in "${!DIRS_DO_SLUG[@]}"; do
    cpdir="$HOME/.gstack/projects/$s/checkpoints"
    [ -d "$cpdir" ] || continue

    local recentes
    recentes="$(find "$cpdir" -maxdepth 1 -name "*.md" -type f 2>/dev/null \
      | sort -r \
      | while read -r arquivo; do
          nome="$(basename "$arquivo")"
          [ "${nome:0:8}" \> "$corte" ] || [ "${nome:0:8}" = "$corte" ] || continue
          echo "$arquivo"
        done)"
    [ -n "$recentes" ] || continue

    echo "=== $s ==="
    echo "  dirs:"
    while IFS='|' read -r dir cbranch; do
      [ -n "$dir" ] || continue
      printf "    %-62s [%s]\n" "$dir" "$cbranch"
    done <<< "${DIRS_DO_SLUG[$s]}"
    echo "  checkpoints (últimos $dias dias):"
    while read -r arquivo; do
      [ -n "$arquivo" ] || continue
      nome="$(basename "$arquivo")"
      data="${nome:6:2}/${nome:4:2}"
      hora="${nome:9:2}:${nome:11:2}"
      titulo="$(titulo_de "$arquivo")"
      linha="$(grep -m1 '^branch:' "$arquivo" 2>/dev/null || true)"
      cbranch="$(echo "${linha#branch:}" | xargs 2>/dev/null || true)"
      echo "    $nome"
      printf "      %s %s · branch: %s\n" "$data" "$hora" "${cbranch:-?}"
      printf "      %s\n" "$titulo"
    done <<< "$recentes"
    echo
  done
}

# Escapa aspas e barras para embutir uma string num literal JSON.
json_str() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }

gerar_tasks() {
  ler_conf
  mkdir -p "$(dirname "$TASKS_JSON")"

  local i ckpt labels="" tasks=""
  for i in "${!DIRS[@]}"; do
    ckpt="$(checkpoint_de "$i")"
    local label
    label="Frente $((i + 1)) — $(titulo_curto "${ckpt:-}")"
    label="$(json_str "$label")"
    [ -n "$labels" ] && labels="$labels,"
    labels="$labels
        \"$label\""
    tasks="$tasks,
    {
      \"label\": \"$label\",
      \"type\": \"shell\",
      \"command\": \"\${workspaceFolder}/scripts-uteis/retomar-frentes.sh $((i + 1))\",
      \"presentation\": {
        \"reveal\": \"always\",
        \"panel\": \"dedicated\",
        \"focus\": false,
        \"echo\": false,
        \"clear\": true
      },
      \"problemMatcher\": []
    }"
  done

  cat > "$TASKS_JSON" <<EOF
{
  // GERADO por scripts-uteis/retomar-frentes.sh --gerar-tasks
  // Não edite à mão: mexa em scripts-uteis/frentes.conf e gere de novo.
  //
  // Rodar: Ctrl+Shift+B, ou Ctrl+Shift+P → "Tasks: Run Task".
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Retomar frentes",
      "dependsOrder": "parallel",
      "dependsOn": [$labels
      ],
      "group": { "kind": "build", "isDefault": true },
      "problemMatcher": []
    }$tasks
  ]
}
EOF
  echo "Escrito: $TASKS_JSON (${#DIRS[@]} frentes)"
}

case "${1:-}" in
  "")             listar ;;
  --todas)        todas ;;
  --checar)       checar ;;
  --descobrir)    descobrir "${2:-3}" ;;
  --gerar-tasks)  gerar_tasks ;;
  -h|--help)      listar ;;
  *)              abrir "$1" ;;
esac
