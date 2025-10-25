const fs = require('fs');
const path = require('path');
const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/extract-inline-scripts.js /path/to/file.html');
  process.exit(2);
}
const html = fs.readFileSync(path.resolve(file), 'utf8');
const regex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
let idx = 0;
while ((match = regex.exec(html)) !== null) {
  idx++;
  const attrs = match[1].trim();
  const body = match[2].trim();
  console.log('--- SCRIPT #' + idx + ' ---');
  console.log('attrs:', attrs || '<none>');
  console.log('body:');
  if (body.length === 0) {
    console.log('<EMPTY>');
  } else {
    console.log(body.slice(0, 2000));
    if (body.length > 2000) console.log('\n...(truncated)');
  }
  console.log('\n');
}
if (idx === 0) console.log('No <script> tags found.');
