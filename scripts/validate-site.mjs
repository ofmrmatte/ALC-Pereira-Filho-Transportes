import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const routes = ['','empresa','equipe','solucoes','operacao','cotacao','contato','trabalhe-conosco','privacidade'];
const available = target => {
  const clean = target.replace(/^\//,'').replace(/\?.*$/,'').replace(/#.*$/,'');
  return fs.existsSync(clean) && fs.statSync(clean).isFile() ||
    fs.existsSync(path.join(clean,'index.html'));
};
for (const route of routes) {
  const file = path.join(route,'index.html');
  const html = fs.readFileSync(file,'utf8');
  assert.match(html,/<html lang="pt-BR">/,file);
  assert.match(html,/class="skip-link"/,file);
  assert.match(html,/<main id="conteudo"/,file);
  assert.match(html,/aria-controls="menu-principal-movel"/,file);
  assert.match(html,/id="menu-principal-movel"/,file);
  assert.match(html,/<meta name="description" content="[^"]+"/,file);
  assert.match(html,/src="\/assets\/site.js"/,file);
  for (const [,ref] of html.matchAll(/(?:href|src)="(\/[^"]+)"/g)) {
    assert.ok(available(ref),`${file}: missing local target ${ref}`);
  }
}
for (const file of ['cotacao/index.html','contato/index.html','trabalhe-conosco/index.html']) {
  const html=fs.readFileSync(file,'utf8');
  assert.match(html,/data-live-form="/,file);
  assert.match(html,/href="\/privacidade\/"/,file);
  assert.match(html,/autocomplete="tel"/,file);
}
const home=fs.readFileSync('index.html','utf8');
assert.match(home,/alc-frota-entardecer\.jpg/);
assert.doesNotMatch(home,/videos\.pexels\.com/);
const js=fs.readFileSync('assets/site.js','utf8');
assert.match(js,/key === 'Escape'/);
assert.match(js,/aria-current/);
assert.match(js,/reportValidity\(\)/);
const server = fs.readFileSync('server.mjs','utf8');
assert.match(server,/X-Robots-Tag/);
assert.match(server,/\/health/);
console.log('Institutional site routes, assets, forms and accessibility: OK');
