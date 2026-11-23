// Run after changing any inline <script> in a page: node scripts/update-csp.mjs
// Pages use the external /assets/site.js, so script-src is normally just 'self'.
// Any plain inline <script> found in an .html file is allowed by its SHA-256 hash.
import fs from "fs"; import crypto from "crypto";
const hashes = new Set();
for (const f of fs.readdirSync(".").filter((f) => f.endsWith(".html")))
  for (const m of fs.readFileSync(f, "utf8").matchAll(/<script>([\s\S]*?)<\/script>/g))
    hashes.add(`'sha256-${crypto.createHash("sha256").update(m[1]).digest("base64")}'`);
const csp = ["default-src 'self'", `script-src 'self' ${[...hashes].join(" ")}`.trim(), "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", "font-src https://fonts.gstatic.com", "img-src 'self' data:", "connect-src 'self'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'", "object-src 'none'"].join("; ");
const h = [["Content-Security-Policy", csp], ["Strict-Transport-Security", "max-age=63072000; includeSubDomains"], ["X-Content-Type-Options", "nosniff"], ["Referrer-Policy", "strict-origin-when-cross-origin"], ["Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()"], ["X-Frame-Options", "DENY"]].map(([key, value]) => ({ key, value }));
fs.writeFileSync("vercel.json", JSON.stringify({ cleanUrls: true, trailingSlash: false, headers: [{ source: "/(.*)", headers: h }] }, null, 2) + "\n");
console.log("vercel.json updated. Inline script hashes:", hashes.size);
