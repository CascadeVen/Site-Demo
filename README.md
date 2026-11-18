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
