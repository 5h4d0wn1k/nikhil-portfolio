#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const [key, jsonFile] = process.argv.slice(2);
if (!key || !jsonFile) {
  console.error('Usage: node scripts/add-config.mjs <key> <json-file>');
  process.exit(1);
}

const value = readFileSync(jsonFile, 'utf8').trim();
JSON.parse(value);

const escaped = value.replace(/'/g, "''");
const sql = `INSERT OR REPLACE INTO config (key, value, updated_at) VALUES ('${key}', '${escaped}', CURRENT_TIMESTAMP);`;

const db = process.env.D1_DB || 'portfolio-db';
execSync(`wrangler d1 execute "${db}" --remote --command "${sql}"`, { stdio: 'inherit' });
console.log(`Config key "${key}" updated`);
