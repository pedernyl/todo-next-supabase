const fs = require('fs');
const crypto = require('crypto');
const http = require('http');
const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function extractInlineScripts(html) {
  const regex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
  const results = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const attrs = match[1];
    const body = match[2];
    // skip external scripts (have src)
    if (/\ssrc=/.test(attrs)) continue;
    const trimmed = body.trim();
    if (trimmed.length === 0) continue;
    results.push(trimmed);
  }
  return results;
}

function sha256Base64(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('base64');
}

async function main() {
  const url = process.env.SOURCE_URL || 'http://localhost:3000';
  console.log('Fetching', url);
  const html = await fetchUrl(url);
  const scripts = extractInlineScripts(html);
  // produce plain tokens like: sha256-<base64>
  const hashes = Array.from(new Set(scripts.map((s) => `sha256-${sha256Base64(s)}`)));
  const json = { scriptSrcHashes: hashes };
  const outDir = './csp';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  fs.writeFileSync(outDir + '/hashes.json', JSON.stringify(json, null, 2));
  console.log('Wrote', hashes.length, 'hash(es) to csp/hashes.json');
  hashes.forEach((h) => console.log(h));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
