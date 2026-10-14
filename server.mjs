import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const TYPES = Object.freeze({
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
});
const SECURITY = Object.freeze({
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow",
});
const exposedAsset = path => path === "/favicon.svg" || path === "/robots.txt" ||
  path.startsWith("/assets/") && !/\/(?:\.|README|.*\.tmp$)/i.test(path);

export function createSiteServer() {
  return createServer(async (request, response) => {
    const method = request.method || "GET";
    const send = (status, headers, bytes = "") => {
      response.writeHead(status, { ...SECURITY, ...headers });
      response.end(method === "HEAD" ? undefined : bytes);
    };
    if (method !== "GET" && method !== "HEAD") {
      send(405, { Allow: "GET, HEAD", "Content-Type": "text/plain; charset=utf-8" }, "Método não permitido");
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
    } catch {
      send(400, { "Content-Type": "text/plain; charset=utf-8" }, "Endereço inválido");
      return;
    }
    if (pathname === "/health") {
      send(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }, '{"status":"ok"}');
      return;
    }
    if (pathname.includes("\\") || pathname.includes("\0") || pathname.split("/").includes("..")) {
      send(400, { "Content-Type": "text/plain; charset=utf-8" }, "Endereço inválido");
      return;
    }
    const route = pathname === "/" ? "/index.html" : pathname.endsWith("/") ? pathname + "index.html" : pathname;
    const isPage = route.endsWith(".html") || !extname(route);
    // Only the public pages and static assets may be served; never expose GitHub,
    // configuration, source files, tests, internal docs or private notes.
    const allowedPage = route === "/index.html" || route === "/404.html" ||
      /^\/(empresa|equipe|solucoes|operacao|cotacao|contato|trabalhe-conosco|privacidade)\/index\.html$/.test(route);
    const file = allowedPage ? route : exposedAsset(route) && TYPES[extname(route)] ? route : null;
    if (!file) {
      const error = await readFile(resolve(ROOT, "404.html"));
      send(404, { "Content-Type": TYPES[".html"], "Cache-Control": "no-store" }, error);
      return;
    }
    const target = resolve(ROOT, "." + file);
    if (relative(ROOT, target).startsWith("..") || target === ROOT || !target.startsWith(ROOT + sep)) {
      send(403, { "Content-Type": "text/plain; charset=utf-8" }, "Acesso negado");
      return;
    }
    try {
      const result = await stat(target);
      if (!result.isFile()) throw new Error("not file");
      const body = await readFile(target);
      send(200, {
        "Content-Type": TYPES[extname(target)],
        "Content-Length": body.byteLength,
        "Cache-Control": extname(target) === ".html" ? "no-store" : "public, max-age=3600",
      }, body);
    } catch {
      const error = await readFile(resolve(ROOT, "404.html"));
      send(404, { "Content-Type": TYPES[".html"], "Cache-Control": "no-store" }, error);
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  createSiteServer().listen(port, "0.0.0.0", () => {
    console.log(`ALC institucional online na porta ${port}`);
  });
}
