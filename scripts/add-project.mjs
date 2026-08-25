#!/usr/bin/env node
// Add a new project to D1 database
// Usage: node scripts/add-project.mjs '{"slug":"new-project","name":"New Project",...}'

import { execFileSync } from 'node:child_process';

const data = JSON.parse(process.argv[2]);

const required = ['slug', 'name', 'category'];
for (const field of required) {
  if (!data[field]) {
    console.error(`Missing required field: ${field}`);
    process.exit(1);
  }
}

const sql = `INSERT INTO projects (slug, name, category, status, color, summary, description, tech, highlights, links, proof, number) VALUES (
  '${(data.slug||'').replace(/'/g,"''")}',
  '${(data.name||'').replace(/'/g,"''")}',
  '${(data.category||'').replace(/'/g,"''")}',
  '${(data.status||'OPEN SOURCE').replace(/'/g,"''")}',
  '${(data.color||'acid').replace(/'/g,"''")}',
  '${(data.summary||'').replace(/'/g,"''")}',
  '${(data.description||'').replace(/'/g,"''")}',
  '${JSON.stringify(data.tech||[]).replace(/'/g,"''")}',
  '${JSON.stringify(data.highlights||[]).replace(/'/g,"''")}',
  '${JSON.stringify(data.links||[]).replace(/'/g,"''")}',
  '${JSON.stringify(data.proof||[]).replace(/'/g,"''")}',
  '${(data.number||'').replace(/'/g,"''")}'
);`;

console.log('Adding project:', data.name);
execFileSync('npx', ['wrangler', 'd1', 'execute', 'portfolio-db', '--remote', '--command', sql], { stdio: 'inherit' });
console.log('Done!');
