const fs = require('fs');
const crypto = require('crypto');

function sha256base64(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('base64');
}

function extractInlineScripts(html) {
  const regex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  const res = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const attrs = match[1];
    const body = match[2];
    if (/\ssrc=/.test(attrs)) continue;
    const t = body.trim();
    if (!t) continue;
    res.push(t);
  }
  return res;
}

const html = fs.readFileSync('/tmp/login.html', 'utf8');
const scripts = extractInlineScripts(html);
const json = fs.existsSync('./csp/hashes.json') ? JSON.parse(fs.readFileSync('./csp/hashes.json', 'utf8')) : { scriptSrcHashes: [] };
const hashes = json.scriptSrcHashes.map(s => s.replace(/\"?/g, '').replace(/^'|'+$/g, ''));

console.log('Found', scripts.length, 'inline scripts.');
const missing = [];
for (let i = 0; i < scripts.length; i++) {
  const s = scripts[i];
  const h = sha256base64(s);
  const token = `sha256-${h}`;
  const ok = hashes.includes(token);
  console.log(`script #${i+1}: ${ok ? 'MATCH' : 'MISSING'} -> ${token}`);
  if (!ok) {
    missing.push({ index: i+1, token, snippet: s.slice(0, 200).replace(/\n/g,' ') });
  }
}

if (missing.length) {
  console.log('\nMissing scripts:');
  missing.forEach(m => console.log(`#${m.index}: ${m.token}\nsnippet: ${m.snippet}\n`));
} else {
  console.log('All inline scripts are covered by hashes.');
}
