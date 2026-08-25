#!/usr/bin/env node
// Add a new work experience to D1 database
// Usage: node scripts/add-experience.mjs '{"slug":"company-name","company":"Company",...}'

import { execFileSync } from 'node:child_process';

const data = JSON.parse(process.argv[2]);

const required = ['slug', 'company', 'role'];
for (const field of required) {
  if (!data[field]) {
    console.error(`Missing required field: ${field}`);
    process.exit(1);
  }
}

const sql = `INSERT INTO work_experience (slug, company, role, period, status, summary, description, responsibilities, tech, products) VALUES (
  '${(data.slug||'').replace(/'/g,"''")}',
  '${(data.company||'').replace(/'/g,"''")}',
  '${(data.role||'').replace(/'/g,"''")}',
  '${(data.period||'').replace(/'/g,"''")}',
  '${(data.status||'COMPLETED').replace(/'/g,"''")}',
  '${(data.summary||'').replace(/'/g,"''")}',
  '${(data.description||'').replace(/'/g,"''")}',
  '${JSON.stringify(data.responsibilities||[]).replace(/'/g,"''")}',
  '${JSON.stringify(data.tech||[]).replace(/'/g,"''")}',
  '${JSON.stringify(data.products||[]).replace(/'/g,"''")}'
);`;

console.log('Adding experience:', data.company, '-', data.role);
execFileSync('npx', ['wrangler', 'd1', 'execute', 'portfolio-db', '--remote', '--command', sql], { stdio: 'inherit' });
console.log('Done!');
