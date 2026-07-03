---
name: go-live
description: Walk through the pre-launch checklist for taking the bird-rehab site from local demo to a live Cloudflare Pages deployment. Use only when the user explicitly asks to prepare for launch or go live. Involves swapping placeholder content and deployment steps.
disable-model-invocation: true
---

# Go-live checklist

Only run when the user explicitly asks. This changes real content and
prepares deployment — never trigger it on your own initiative.

## 1. Swap placeholders (interactive)

Find every placeholder and confirm each replacement WITH the user — never
invent her real details:

```bash
grep -rniE 'placeholder|REPLACE|TODO|555-0123|her-venmo-handle|Second Flight' src public CLAUDE.md
```

For each, ask the user for the real value and make the edit:
- Operation name (currently "Second Flight")
- Venmo handle + QR image (`public/images/`)
- Phone number and the found-a-bird protocol — **the rehabilitator must
  approve the rescue guidance herself; flag this explicitly, don't finalize
  medical/legal advice on her behalf**
- Bio (`about.astro`)
- Wishlist link (`donate.astro`)
- `site:` in `astro.config.mjs`

## 2. Verify build

```bash
npm run build
```
Must complete with no errors before deploying.

## 3. CMS for production

`public/admin/config.yml` uses `local_backend: true`, which only works
locally. To let her edit the live site, switch to the GitHub backend and set
up OAuth (a static host can't complete the GitHub OAuth handshake alone).
Explain the options — Cloudflare Worker OAuth client, or a hosted Decap
provider — and don't claim `/admin` works remotely until it's wired.

## 4. Deploy (the user does these in their own accounts)

Guide, don't attempt on their behalf:
1. Push to GitHub.
2. Cloudflare → Workers & Pages → Pages → Connect to Git → select repo.
3. Framework preset Astro (build `npm run build`, output `dist`). Deploy.
4. Optional custom domain (~$10/yr).

## 5. Final review

Run the `design-check` skill one more time, confirm donate links resolve,
and confirm no placeholder strings remain.
