# David Reich — Construction & Development Advisory

**Source:** Blueprint direction from Claude Design (`David Reich - Blueprint.html`, 2026-08-17)
**Live:** https://david-reich-share.vercel.app (temporary chooser) → will become `david-reich.vercel.app` / custom domain
**Stack:** Static HTML + CSS — zero build, deploys instantly on Vercel. Long-term maintainable: edit `index.html` directly, swap images in `/public/images`.

## Where to edit

- `index.html` — single-page site. Content sections are marked: nav, hero, capability, services, experience, engage.
- Design tokens — `:root` CSS vars at top of `<style>`:
  - `--color-bg`, `--color-text`, `--color-divider`, `--color-accent-700/800`
  - `--font-heading`, `--font-body`
  - `--max` (content width: 1296px), `--pad` (side padding)
- Images — replace the two `data-image-id="dr-portrait"` / `dr-project` placeholder divs with:
  ```html
  <img src="/images/dr-portrait.jpg" alt="David Reich on site" style="width:100%; aspect-ratio:4/5; object-fit:cover; display:block">
  ```
  Drop files in `public/images/` (4:5 for portrait, 16:10 for project).

## Contact form

Currently `mailto:` fallback. To make it real, add one of:
- **Vercel Function:** `api/contact.js` → Resend / SendGrid
- **Formspree / Basin:** change `<form action="https://formspree.io/f/...">`
- **Google Form embed** if David prefers

Wire-up is 10 lines — ping Elliot.

## Deploy

- Git pushes to `main` auto-deploy via Vercel (linked as `david-reich`).
- Preview deploys on every branch.
- Domain: add in Vercel → Project Settings → Domains (see below).

## Domain

Temporary: `david-reich.vercel.app`
Planned: `davidreich.com` or `davidreich advisory` TLD. To attach:
1. Buy/park domain (Vercel Domains, Cloudflare, or Google Domains)
2. `vercel domains add <domain>` or Vercel Dashboard → Add Domain
3. Add the DNS records Vercel shows (or auto-config if bought on Vercel)

## One-time setup already done

- Blueprint content extracted from `x-dc` wrapper, `support.js`/`_ds` inlined as maintainable CSS
- `image-slot` → maintainable `div.image-slot` with `data-image-id`
- Sticky nav, capability table, services grid, experience, engage sections preserved
- No external JS except Google Fonts

## Notes

- Previous chooser (9 Stitch + 2 Claude) was at `david-reich-share.vercel.app` — now replaced by this production build on the same URL for continuity, will migrate to `david-reich` project for permanence.
