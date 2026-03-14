#!/usr/bin/env bash
# Cold deploy į https://github.com/DITreneris/vaizdas
# Naudojimas: iš projekto šaknies: bash scripts/cold-deploy.sh
# Prieš paleisti: npm install && npm run build && npm test

set -e
REMOTE_NAME="${1:-vaizdas}"
REPO_URL="https://github.com/DITreneris/vaizdas.git"

if git remote get-url "$REMOTE_NAME" 2>/dev/null; then
  echo "Remote '$REMOTE_NAME' jau egzistuoja."
else
  git remote add "$REMOTE_NAME" "$REPO_URL"
  echo "Pridėtas remote: $REMOTE_NAME -> $REPO_URL"
fi

echo "Siunčiama main į $REMOTE_NAME..."
git push -u "$REMOTE_NAME" main
echo "Cold deploy baigtas. Svetainė: https://ditreneris.github.io/vaizdas/"
echo "GitHub Pages: Settings -> Pages -> Source = GitHub Actions"
