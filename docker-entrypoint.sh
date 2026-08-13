#!/bin/sh
set -eu

if [ -z "${AUTH_SECRET:-}" ]; then
  echo "AUTH_SECRET est manquant. Renseignez le fichier .env puis relancez : docker compose up --build"
  exit 1
fi

exec node server.js
