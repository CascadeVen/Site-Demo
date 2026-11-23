# Cascade Ventures: multi-page site

## Structure
Static pages built from shared parts, plus one Vercel function. No framework.

| URL | File | Indexed |
|---|---|---|
| `/` | index.html | yes |
| `/services` | services.html | yes |
| `/website-design` | website-design.html | yes |
| `/seo-services` | seo-services.html | yes |
| `/pricing` | pricing.html | yes |
| `/visibility-audit` | visibility-audit.html | yes |
| `/projects` | projects.html | yes |
| `/about` | about.html | yes |
| `/contact` | contact.html | yes |
| `/reviews` | reviews.html | **noindex** until real reviews exist |
| `/privacy`, `/terms`, `/refunds` | privacy.html, terms.html, refunds.html | **noindex** until legally completed |
| 404 | 404.html | noindex |

`vercel.json` uses `cleanUrls` and `trailingSlash:false`, so `about.html` is served at `/about`.
Shared files: `assets/site.css`, `assets/site.js`. Old `/#services`-style links forward to the new pages.

## Editing content
- Page text: edit `content/<page>.html`. Packages, example projects and reviews: edit `content/data.mjs`.
- Titles, descriptions, breadcrumbs, navigation and structured data: `scripts/build-pages.mjs`.
- Then run `node scripts/build-pages.mjs` and `node scripts/update-csp.mjs`, and commit the generated `.html`, `sitemap.xml` and `vercel.json`. Vercel needs no build command.
- To index a noindex page, remove `noindex: true` for it in `build-pages.mjs` and rebuild (it then joins the sitemap).

## Form email (Resend), unchanged
Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` in Vercel (Production and Preview as needed). `api/contact.js` keeps origin checks, size limits, validation, spam checks and rate limiting (best-effort per instance; add a Vercel Firewall rate-limit rule for a hard cap). Verify your sending domain in Resend. Never commit `.env`.

## Branch and preview deploy
```
git checkout -b redesign
# copy these files over the project root, then:
git add -A && git commit -m "Convert to multi-page site"
git push -u origin redesign
```
Vercel builds a Preview deployment for the `redesign` branch automatically. Do not merge until the preview checks below pass. Production branch and domain are not touched by any of this.

## Analytics (off by default)
Set `gaId` at the top of `assets/site.js`. A consent bar then appears and analytics loads only after Accept. Because the CSP is strict, also add `https://www.googletagmanager.com` to `script-src` and `https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com` to `connect-src` (and `https://*.google-analytics.com` to `img-src`) in `scripts/update-csp.mjs`, run it, and update the privacy page.

## Remaining placeholders and review items
- No business contact details were supplied (phone, email, address): the Contact page says so. Add them.
- Privacy, Terms and Refund pages are drafts with `[bracketed]` gaps and need a lawyer; `legal/service-agreement-template.md` is a template. Nothing here claims legal compliance.
- Pricing shows "Price to be confirmed" for every package. Reviews are empty by design. Projects shows labelled concept layouts only.
- Confirm logo rights (see `LICENSES.md`). The social image and schema logo were made from the logo.
- Structured data uses only name, URL, logo, description, breadcrumbs and services. Add address, phone or opening hours (LocalBusiness) only once real details exist.
- `package.json` and `vercel.json` are publicly reachable on Vercel (harmless). `.vercelignore` keeps `content/`, `scripts/`, `legal/` and docs out of the deployment.

## Needs a live Vercel deployment to confirm
Real HTTP 200s and clean-URL redirects on Vercel; security headers on the deployed domain; `/api/contact` with real Resend credentials (both forms); `https://www.cascadeventures.ca` DNS and canonical match; `/sitemap.xml` and `/robots.txt` at the real domain, then submit in Search Console; Open Graph preview in a social debugger; Lighthouse / PageSpeed and real-user Core Web Vitals; Google rich-results test for the structured data.
