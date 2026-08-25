#!/bin/bash
# Add a new project to D1 database
# Usage: ./add-project.sh <slug> <name> <category> <status> <color> <summary> <description> <tech_json> <highlights_json> <links_json> <proof_json> <number>

if [ $# -lt 12 ]; then
  echo "Usage: $0 <slug> <name> <category> <status> <color> <summary> <description> <tech_json> <highlights_json> <links_json> <proof_json> <number>"
  echo ""
  echo "Example:"
  echo '$ 0 new-project "New Project" "SECURITY" "OPEN SOURCE" "acid" "Short summary" "Long description" \'["Python","Security"]\' \'["Feature 1","Feature 2"]\' \'[{"label":"GITHUB","url":"https://github.com/..."}]\' \'["Open source"]\' "13"'
  exit 1
fi

SLUG="$1"
NAME="$2"
CATEGORY="$3"
STATUS="$4"
COLOR="$5"
SUMMARY="$6"
DESCRIPTION="$7"
TECH="$8"
HIGHLIGHTS="$9"
LINKS="${10}"
PROOF="${11}"
NUMBER="${12}"

SQL="INSERT INTO projects (slug, name, category, status, color, summary, description, tech, highlights, links, proof, number) VALUES ('$SLUG', '$NAME', '$CATEGORY', '$STATUS', '$COLOR', '$SUMMARY', '$DESCRIPTION', '$TECH', '$HIGHLIGHTS', '$LINKS', '$PROOF', '$NUMBER');"

echo "Executing: $SQL"
echo "$SQL" | npx wrangler d1 execute portfolio-db --remote --command "$(cat)"
