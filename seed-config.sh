#!/usr/bin/env bash
set -euo pipefail
DB_NAME="${1:-portfolio-db}"
echo "Seeding config into D1: $DB_NAME"
wrangler d1 execute "$DB_NAME" --remote --file=./seed-config.sql
echo "Config seeded successfully"
