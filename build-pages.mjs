// Builds every page from content/*.html partials into the project root.
// Usage: node scripts/build-pages.mjs   (then node scripts/update-csp.mjs)
import fs from "fs";
import { PACKAGES, CARE, CUSTOM, PROJECTS, REVIEWS } from "../content/data.mjs";
const BASE = "https://www.cascadeventures.ca", ORG = "Cascade Ventures";
const OGALT = "Cascade Ventures logo: a mountain, lake and waterfall mark, with the tagline Get Found. Get Chosen. Grow.";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ul = (a, c = "chk") => `<ul class="${c}">${a.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
const pkg = (p) => `<div class="pkg lift${p.wide ? " wide" : ""}"><h2 class="sm">${esc(p.name)}</h2><p>${esc(p.summary)}</p><p class="price">${p.price ? `<b>${esc(p.price)}</b>` : `<b class="tbc">Price to be confirmed</b>`}${p.unit ? `<span> ${esc(p.unit)}</span>` : ""}</p>${ul(p.includes)}${p.optional.length ? `<p class="opt">Optional</p>${ul(p.optional)}` : ""}<a class="btn${p.wide ? " ghost" : ""}" href="/contact?package=${encodeURIComponent(p.name)}">Request a quote</a></div>`;
const proj = (p) => `<article class="frame lift"><div class="bar"><i></i><i></i><i></i></div>${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.alt || "")}" width="${p.width || 600}" height="${p.height || 400}" loading="lazy" style="width:100%;height:auto;display:block">` : `<div class="body" aria-hidden="true" style="min-height:9rem"><b class="h"></b><b></b><b class="s"></b></div>`}<div class="cap">${p.example ? `<span class="badge">Example layout · not a client project</span>` : ""}<h2 class="sm">${esc(p.title)}</h2><p>${esc(p.summary)}</p></div></article>`;
const rev = (r) => `<figure class="rev lift"><blockquote>${esc(r.quote)}</blockquote><figcaption>${esc(r.name)}, ${esc(r.business)}</figcaption></figure>`;
const real = PROJECTS.some((p) => !p.example);
const pjNote = real ? "" : `<div class="note">Our portfolio is being developed. The layouts below are concept demonstrations of how projects will be presented. They are not commissioned client work. Real projects will appear here once the client has approved how they are shown.</div>`;

const P = (path, partial, title, desc, o = {}) => ({ path, partial, title, desc, ...o });
const PAGES = [
  P("/", "home", "Cascade Ventures | Web Design & Local SEO for Local Businesses", "Cascade Ventures builds professional websites and improves local search visibility for small businesses. Request a free visibility audit or a quote.", { home: true }),
  P("/services", "services", "Web Design & Local SEO Services | Cascade Ventures", "Website design, local SEO and Google Business Profile support for local businesses, with no ranking guarantees.", { crumbs: [["Services"]] }),
  P("/website-design", "website-design", "Website Design for Local Businesses | Cascade Ventures", "Custom, mobile-first website design and development with clear quote and contact paths. See how Cascade Ventures builds websites for local businesses.", { crumbs: [["Services", "/services"], ["Website Design"]], service: ["Website design", "Website design and development for local businesses, including mobile-first design, redesign, conversion-focused layouts, performance optimization and optional maintenance."] }),
  P("/seo-services", "seo-services", "Local SEO & Technical SEO Services | Cascade Ventures", "Local SEO, technical SEO and Google Business Profile support to help local businesses be found in relevant searches. No guaranteed rankings.", { crumbs: [["Services", "/services"], ["SEO Services"]], service: ["Local SEO", "Local SEO, technical SEO, on-page optimization and Google Business Profile support for local businesses."] }),
  P("/pricing", "pricing", "Website & SEO Packages | Cascade Ventures", "Website design, local SEO and digital presence packages from Cascade Ventures. Request a written quote based on your needs.", { crumbs: [["Pricing"]] }),
  P("/visibility-audit", "visibility-audit", "Free Online Visibility Audit | Cascade Ventures", "Request a free review of your website and local search presence. A person reviews your business and sends a plain-language summary.", { crumbs: [["Free Visibility Audit"]] }),
  P("/projects", "projects", "Projects & Concept Demonstrations | Cascade Ventures", "Project gallery for Cascade Ventures. Concept layouts are demonstrations, not client work. Real projects appear once clients approve them.", { crumbs: [["Projects"]] }),
  P("/reviews", "reviews", "Client Reviews | Cascade Ventures", "Client reviews will be published here with permission. None have been added yet.", { crumbs: [["Reviews"]], noindex: true }),
  P("/about", "about", "About Cascade Ventures | Local Web Design & SEO Partner", "Cascade Ventures is a digital growth partner helping local businesses build a credible online presence and turn visitors into inquiries.", { crumbs: [["About"]] }),
  P("/contact", "contact", "Contact & Quote Request | Cascade Ventures", "Request a quote from Cascade Ventures. Tell us about your business and what you need, and we will follow up.", { crumbs: [["Contact"]] }),
  P("/privacy", "privacy", "Privacy Policy (Draft) | Cascade Ventures", "Draft privacy policy for Cascade Ventures, explaining what information this website collects and how it is used.", { crumbs: [["Privacy Policy"]], noindex: true }),
  P("/terms", "terms", "Website Terms and Conditions (Draft) | Cascade Ventures", "Draft website terms and conditions for Cascade Ventures, including the notice that search results are not guaranteed.", { crumbs: [["Terms and Conditions"]], noindex: true }),
  P("/refunds", "refunds", "Refund and Cancellation Policy (Draft) | Cascade Ventures", "Draft refund and cancellation policy template for Cascade Ventures. Terms are yet to be confirmed.", { crumbs: [["Refund and Cancellation Policy"]], noindex: true }),
];
const NAV = [["/website-design", "Website Design"], ["/seo-services", "SEO Services"], ["/pricing", "Pricing"], ["/projects", "Projects"], ["/about", "About"], ["/visibility-audit", "Free Audit"]];
const FOOT = [["/services", "Services"], ["/website-design", "Website Design"], ["/seo-services", "SEO Services"], ["/pricing", "Pricing"], ["/visibility-audit", "Free Audit"], ["/projects", "Projects"], ["/reviews", "Reviews"], ["/about", "About"], ["/contact", "Contact"]];
const url = (p) => BASE + (p === "/" ? "/" : p);

function jsonld(pg) {
  const g = [];
  if (pg.home) {
    g.push({ "@type": "Organization", "@id": BASE + "/#organization", name: ORG, url: BASE + "/", logo: BASE + "/assets/logo-512.png", description: "Professional websites and digital visibility solutions designed to help local businesses compete and grow." });
    g.push({ "@type": "WebSite", "@id": BASE + "/#website", name: ORG, url: BASE + "/", publisher: { "@id": BASE + "/#organization" } });
  }
  if (pg.crumbs) {
    const items = [["Home", "/"], ...pg.crumbs.map((c) => [c[0], c[1] || pg.path])];
    g.push({ "@type": "BreadcrumbList", itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: url(c[1]) })) });
  }
  if (pg.service) g.push({ "@type": "Service", name: pg.service[0], description: pg.service[1], url: url(pg.path), provider: { "@type": "Organization", name: ORG, url: BASE + "/" } });
  return g.length ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": g })}</script>\n` : "";
}
function crumbs(pg) {
  if (!pg.crumbs) return "";
  const items = [["Home", "/"], ...pg.crumbs];
  return `<div class="wrap crumbs-wrap"><nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map((c, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(c[0])}</li>` : `<li><a href="${c[1]}">${esc(c[0])}</a></li>`)).join("")}</ol></nav></div>\n`;
}
function page(pg, body) {
  const u = url(pg.path), t = esc(pg.title), d = esc(pg.desc);
  const nav = NAV.map(([h, l]) => `<li><a href="${h}"${h === pg.path ? ' aria-current="page"' : ""}>${l}</a></li>`).join("");
  const foot = FOOT.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${t}</title>
<meta name="description" content="${d}">
<meta name="robots" content="${pg.noindex ? "noindex, follow" : "index, follow"}">
<link rel="canonical" href="${u}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${ORG}">
<meta property="og:locale" content="en_CA">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:url" content="${u}">
<meta property="og:image" content="${BASE}/assets/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(OGALT)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${BASE}/assets/og-image.png">
<meta name="twitter:image:alt" content="${esc(OGALT)}">
<meta name="theme-color" content="#101C2C">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
${jsonld(pg)}</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="consent" id="consent" role="region" aria-label="Analytics choice" hidden><p>We would like to use analytics to understand how the site is used. Nothing loads unless you accept.</p><button class="btn" id="c-yes" type="button">Accept analytics</button><button class="btn ghost" id="c-no" type="button">Decline</button></div>
<header class="top"><div class="wrap">
<a class="logo" href="/" aria-label="Cascade Ventures home"><i aria-hidden="true"></i><b style="font-weight:inherit">Cascade <span>Ventures</span></b></a>
<button class="menu" aria-expanded="false" aria-controls="nl">Menu</button>
<nav aria-label="Main"><ul id="nl">
${nav}<li><a class="btn" style="padding:.55rem 1.1rem;color:var(--bg)" href="/contact">Get a quote</a></li>
</ul></nav></div></header>
<main id="main" tabindex="-1">
${crumbs(pg)}${body}
</main>
<footer><div class="wrap"><div><a class="logo" href="/" aria-label="Cascade Ventures home"><i aria-hidden="true"></i><b style="font-weight:inherit">Cascade <span>Ventures</span></b></a><p style="margin-top:.8rem">Get Found. Get Chosen. Grow.</p></div>
<ul class="cols">${foot}</ul>
<p style="width:100%;font-size:.8rem;margin:0">© <span id="yr">2026</span> Cascade Ventures. <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a> · <a href="/refunds">Refunds</a> (drafts pending legal review)</p></div></footer>
<script src="/assets/site.js" defer></script>
</body>
</html>
`;
}
let n = 0;
for (const pg of PAGES) {
  let b = fs.readFileSync(`content/${pg.partial}.html`, "utf8");
  b = b.replace("<!--PKGS-->", [...PACKAGES, CARE].map(pkg).join("")).replace("<!--CUSTOM-->", CUSTOM.map((i) => `<li>${esc(i)}</li>`).join("")).replace("<!--PROJECTS-->", PROJECTS.map(proj).join("")).replace("<!--PJNOTE-->", pjNote).replace("<!--REVIEWS-->", REVIEWS.map(rev).join(""));
  if (REVIEWS.length) b = b.replace(/<!--EMPTY-->[\s\S]*<!--\/EMPTY-->/, "");
  b = b.replace(/<!--\/?EMPTY-->/g, "");
  fs.writeFileSync(pg.path === "/" ? "index.html" : pg.path.slice(1) + ".html", page(pg, b)); n++;
}
fs.writeFileSync("404.html", page({ path: "/404", noindex: true, title: "Page Not Found | Cascade Ventures", desc: "The page you were looking for could not be found." }, `<section><div class="wrap"><span class="eyebrow">404</span><h1>We couldn’t find that page.</h1><p>The link may be out of date. Try one of these instead.</p><div class="btns"><a class="btn" href="/">Go to the homepage</a><a class="btn ghost" href="/contact">Contact us</a></div></div></section>`));
const day = new Date().toISOString().slice(0, 10);
fs.writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.filter((p) => !p.noindex).map((p) => `  <url><loc>${url(p.path)}</loc><lastmod>${day}</lastmod></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync("robots.txt", `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${BASE}/sitemap.xml\n`);
console.log(`Built ${n} pages + 404.html, sitemap.xml (${PAGES.filter((p) => !p.noindex).length} URLs), robots.txt`);
