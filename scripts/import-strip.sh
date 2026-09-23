#!/usr/bin/env bash
# Importe une planche de BD depuis un dossier source vers public/bd/<slug>/.
#
#   ./scripts/import-strip.sh <dossier-source> [slug]
#   FORCE=1 ./scripts/import-strip.sh <dossier-source> [slug]   # écrase un dossier existant
#
# Les images du dossier source sont triées dans l'ordre naturel (1, 2, … 10 et
# IMG_0248, IMG_0249, …), renumérotées 1.webp … N.webp, redimensionnées à
# 1440 px max puis converties en webp qualité 80.
#
# Le slug est déduit du nom du dossier s'il n'est pas fourni
# (« Ma nièce » → « ma-niece »).
#
# Le script ne touche pas à src/app/page.tsx : il affiche en fin de course la
# ligne à ajouter dans STRIPS. Le titre et le compte de l'archive restent des
# choix éditoriaux.
#
# Dépendances : imagemagick, webp (brew install imagemagick webp)

set -euo pipefail

MAX_SIZE=1440
QUALITY=80

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SRC="${1:-}"
if [[ -z "$SRC" ]]; then
  echo "usage: $0 <dossier-source> [slug]" >&2
  exit 1
fi
if [[ ! -d "$SRC" ]]; then
  echo "dossier introuvable : $SRC" >&2
  exit 1
fi

for bin in magick cwebp; do
  if ! command -v "$bin" >/dev/null; then
    echo "dépendance manquante : $bin (brew install imagemagick webp)" >&2
    exit 1
  fi
done

slugify() {
  python3 -c '
import re, sys, unicodedata

name = unicodedata.normalize("NFKD", sys.argv[1])
name = "".join(char for char in name if not unicodedata.combining(char))
print(re.sub(r"[^A-Za-z0-9]+", "-", name).strip("-").lower())
' "$1"
}

SLUG="${2:-$(slugify "$(basename "$SRC")")}"
if [[ -z "$SLUG" ]]; then
  echo "slug vide, passe-le en second argument" >&2
  exit 1
fi

DST="$ROOT/public/bd/$SLUG"
if compgen -G "$DST/*" >/dev/null; then
  if [[ "${FORCE:-}" != "1" ]]; then
    echo "public/bd/$SLUG existe déjà et n'est pas vide — relance avec FORCE=1 pour l'écraser" >&2
    exit 1
  fi
  rm -f "$DST"/*.webp
fi

shopt -s nullglob nocaseglob
FOUND=("$SRC"/*.jpg "$SRC"/*.jpeg "$SRC"/*.png "$SRC"/*.heic "$SRC"/*.webp)
shopt -u nullglob nocaseglob

if [[ ${#FOUND[@]} -eq 0 ]]; then
  echo "aucune image trouvée dans $SRC" >&2
  exit 1
fi

SOURCES=()
while IFS= read -r -d '' file; do
  SOURCES+=("$file")
done < <(printf '%s\0' "${FOUND[@]}" | sort -zV)

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$DST"

panels=0
for file in "${SOURCES[@]}"; do
  panels=$((panels + 1))
  magick "$file" -auto-orient -resize "${MAX_SIZE}x${MAX_SIZE}>" "$TMP/panel.png"
  cwebp -quiet -q "$QUALITY" -m 6 "$TMP/panel.png" -o "$DST/$panels.webp"
  printf '  %2d. %-24s → %s\n' "$panels" "$(basename "$file")" "$panels.webp"
done

PAGE="$ROOT/src/app/page.tsx"
NEXT_NO="??"
if [[ -f "$PAGE" ]]; then
  LAST_NO="$(grep -oE 'no: "[0-9]+"' "$PAGE" | grep -oE '[0-9]+' | sort -n | tail -1)"
  if [[ -n "$LAST_NO" ]]; then
    NEXT_NO="$(printf '%02d' "$((10#$LAST_NO + 1))")"
  fi
fi

cat <<EOF

$panels planche(s) écrite(s) dans public/bd/$SLUG/

Ligne à ajouter en tête de STRIPS dans src/app/page.tsx :

  { no: "$NEXT_NO", slug: "$SLUG", title: "$(basename "$SRC")", panels: $panels, ext: "webp" },

À mettre à jour à la main :
  - le titre de l'archive dans src/app/page.tsx (« … strips, une vie passionnante. »)
  - la clé mvpDesc de cv-louise (messages/fr.json, messages/en.json)
EOF
