import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { createSiteServer } from "../server.mjs";

test("publica somente rotas institucionais e preserva segurança e saúde", async () => {
  const app = createSiteServer().listen(0, "127.0.0.1");
  await once(app, "listening");
  const url = `http://127.0.0.1:${app.address().port}`;
  try {
    for (const route of ["/", "/empresa/", "/equipe/", "/solucoes/", "/operacao/", "/cotacao/", "/contato/", "/trabalhe-conosco/", "/privacidade/"]) {
      const response = await fetch(url + route);
      assert.equal(response.status, 200, route);
      assert.match(response.headers.get("content-type"), /text\/html/);
      assert.equal(response.headers.get("x-content-type-options"), "nosniff");
      const html = await response.text();
      assert.match(html, /ALC/);
      assert.doesNotMatch(html, /wp-content\/uploads|alc-frota-entardecer\.jpg|<iframe\b/i);
    }
    for (const asset of ["/assets/site.css", "/assets/site.js", "/assets/brand/logo.svg", "/assets/experience/experience.css", "/assets/experience/runtime.js", "/assets/experience/posters/contato.svg", "/assets/images/frota/alc-frota-operacao.jpg", "/favicon.svg"]) {
      assert.equal((await fetch(url + asset)).status, 200, asset);
    }
    const model = await fetch(url + "/assets/experience/models/alc-tractor-trailer.glb");
    assert.equal(model.status, 200);
    assert.match(model.headers.get("content-type"), /model\/gltf-binary/);
    assert.equal(model.headers.get("content-encoding"), "gzip");
    assert.equal((await model.arrayBuffer()).byteLength > 0, true);
    const health = await fetch(url + "/health");
    assert.deepEqual(await health.json(), {status:"ok"});
    assert.equal(health.headers.get("cache-control"), "no-store");
    const head = await fetch(url + "/", {method:"HEAD"});
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
    const method = await fetch(url + "/", {method:"POST"});
    assert.equal(method.status, 405);
    for (const denied of ["/package.json", "/server.mjs", "/tests/site.test.mjs", "/.git/config", "/docs/ROADMAP.md", "/assets/README.md", "/assets/NOOP", "/assets/experience/state.js", "/assets/experience/entry.js", "/assets/experience/models.js"]) {
      assert.equal((await fetch(url + denied)).status, 404, denied);
    }
    const notFound = await fetch(url + "/inexistente/");
    assert.equal(notFound.status, 404);
    assert.match(await notFound.text(), /data-experience-page="404"/);
    assert.equal((await fetch(url + "/%5cetc%5cpasswd")).status, 400);
  } finally { await new Promise(resolve => app.close(resolve)); }
});
