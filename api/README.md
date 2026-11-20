# Cascade Ventures: deployment and configuration

Files: `index.html` (the whole site), `api/contact.js` (form handler), `sitemap.xml`, `robots.txt`, favicon files, `.env.example`.

## 1. Form email (Resend)
1. Create an account at resend.com and verify your sending domain.
2. Create an API key.
3. In Vercel > Project > Settings > Environment Variables, add `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (where submissions arrive) and `CONTACT_FROM_EMAIL` (an address on your verified domain). Redeploy.
4. Submit both forms on the live site and confirm the emails arrive. Until you do, form delivery is untested.
No secrets live in `index.html`.

## 2. Deploy on Vercel
Push this folder to a Git repository, import it in Vercel (framework: Other, no build command), deploy. Add your domain under Settings > Domains and follow the DNS instructions.

## 3. Before launch
- Replace `YOUR-DOMAIN.com` in `sitemap.xml` and `robots.txt`, and set `CONFIG.siteUrl` in `index.html` (enables canonical and og:url).
- Edit `PACKAGES`, `CARE`, `PROJECTS`, `REVIEWS` at the top of the script in `index.html`. Set prices as text, such as "$1,500". Delete the example projects when real ones are added. Add reviews only with client permission.
- Add contact details, review the draft Privacy and Terms pages with a legal professional.
- Verify `/sitemap.xml` and `/robots.txt` load at your domain, then submit the sitemap in Search Console.
Note: pages use #hash routes, so the sitemap lists only the homepage. Separate indexable pages would need the site split into real pages.

## 4. Security (added)
- `vercel.json` sets security headers including a Content-Security-Policy that allows only this site, Google Fonts and an exact hash of the page script. **After every edit to the page script in `index.html`, run `node scripts/update-csp.mjs`** and commit `vercel.json`, or the browser will block the script.
- `api/contact.js` checks same-origin requests, JSON content type, 20 KB body size, field count and length, and limits each IP to 5 submissions per 15 minutes. That limit is held in memory per serverless instance, so it slows bursts but is not a hard cap. For a strict limit, add a rate-limit rule in Vercel Firewall (check what your Vercel plan includes).
- Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` in **both** the Production and Preview environments in Vercel (or only Production, if you do not want previews to send email). Mark the key as sensitive. Never commit `.env`; `.gitignore` already excludes it.
- If you ever pasted a real key into chat, a file or Git, revoke it in Resend and create a new one.

## 5. Analytics (optional, off by default)
Set `CONFIG.gaId` to your GA4 ID (G-XXXXXXXXXX). A consent bar then appears and analytics loads only after Accept; the lead event `generate_lead` fires after a successful form submission. Because the CSP is strict, also edit `scripts/update-csp.mjs` before running it: add `https://www.googletagmanager.com` to `script-src`, and `https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com` to `connect-src`; add `https://*.google-analytics.com` to `img-src`. Update the Privacy page, and mark conversions as key events in GA4. Search Console: verify your domain, then submit `https://YOUR-DOMAIN.com/sitemap.xml`.

## 6. Legal
Privacy, Terms and Refund pages are drafts with `[bracketed]` gaps. `legal/service-agreement-template.md` is a template. All need a lawyer. See `LICENSES.md` for the asset record.
