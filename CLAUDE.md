# CLAUDE.md — Second Flight Bird Rehab site

Project briefing for Claude Code. This file is loaded automatically every
session. Read it before making changes.

## What this is

A free-to-host static website for a **wildlife bird rehabilitator** (a
volunteer, donation-funded passion project — not a business). It publishes
rescue updates, tells emotionally resonant recovery stories, explains what
to do when someone finds an injured bird, and collects donations via Venmo.

The rehabilitator is **non-technical**. She must be able to publish posts
through a web form (Decap CMS), never by touching code or Markdown directly.

**Placeholder identity:** "Second Flight," Bloomington MN. All names, phone
numbers, Venmo handles, and the found-a-bird protocol are placeholders — see
the swap checklist below. Do not treat placeholder copy as final.

## Non-negotiable design constraints

These came directly from the client and override any default styling
instinct. If a change would violate one, stop and flag it.

1. **Exactly three colors.** Defined as tokens at the top of
   `src/styles/global.css`:
   - `--spruce #1E332A` — all text, buttons, footer (grays are rgba tints of
     this, NOT new colors)
   - `--paper #FAFAF7` — background
   - `--gold #E0A32E` — the single accent: donate CTAs, links, "Released"
     status chips
   Do not introduce a fourth color. Tints/opacity of the three are fine.
2. **Minimal and uncluttered.** Whitespace over decoration. Spend visual
   boldness in one place per view, keep everything around it quiet.
3. **High emotional appeal in the content pane.** The hero and post stories
   should make a visitor *feel* the stakes (a hurt bird made whole). Large
   Fraunces serif display, real rescue narratives, concrete donation framing
   ("$10 = a week of mealworms"). Never generic marketing filler.

## Tech stack

- **Astro 5** (static site generator) — pinned in `package.json`
- Content collections via the **glob loader**, schema in
  `src/content.config.ts` (Zod-validated frontmatter)
- **Decap CMS** for the non-technical editor (`public/admin/`)
- Fonts: Fraunces (display) + Nunito Sans (body), from Google Fonts
- Target host: **Cloudflare Pages** (free, no commercial-use restriction —
  important because ads may be added later)
- No framework JS ships to the browser; output is pure static HTML/CSS

## Run locally (Mac)

```bash
npm install
npm run dev          # http://localhost:4321
npm run cms          # second terminal → enables http://localhost:4321/admin
npm run build        # static output to dist/ ; run before shipping
```

Node 18.17+ required.

## File map

```
src/
  content.config.ts        # post frontmatter schema (edit here to add fields)
  content/posts/*.md        # the posts — one Markdown file each
  layouts/Base.astro        # header, nav, footer, fonts, <slot/>
  pages/
    index.astro             # home: hero + latest 4 posts + donate panel
    posts/index.astro       # full updates list
    posts/[...id].astro     # individual post template
    donate.astro            # Venmo + QR + wishlist + impact tiers
    found-a-bird.astro      # rescue protocol (PLACEHOLDER — she must review)
    about.astro             # her bio (placeholder)
  styles/global.css         # ALL styling; color tokens at top
public/
  admin/{index.html,config.yml}   # Decap CMS
  images/                         # photos, Venmo QR
```

Astro routing is file-based: a file in `src/pages/` becomes a URL. The post
template is `[...id].astro` (rest param) and uses `getStaticPaths` +
`getCollection('posts')`.

## Post authoring conventions

Frontmatter schema (enforced by `src/content.config.ts`):

```yaml
title:   string            # required
date:    YYYY-MM-DD        # required
species: string            # optional, e.g. "Great Horned Owl"
status:  In care | Released | Education bird | Update   # default: Update
excerpt: string            # optional, 1–2 sentences shown in the list
image:   /images/...       # optional
```

- Body is Markdown below the frontmatter.
- Only `status: Released` gets the gold chip — that's intentional (the list
  visually tells the "came in hurt → flew out free" arc). Don't restyle it.
- Story tone: warm, specific, first-person-plural ("we"), a concrete cost or
  call-to-action near the end. Match the four existing sample posts.

## Before going live — swap checklist

Search the repo for `placeholder`, `REPLACE`, and `TODO`:

1. "Second Flight" → her real operation name (`Base.astro`, `CLAUDE.md`)
2. Venmo handle + QR image (`src/pages/donate.astro`,
   `public/images/venmo-qr-placeholder.svg`)
3. Phone number (`src/pages/found-a-bird.astro`) — and **she must review the
   rescue protocol**; current text is generic placeholder advice
4. Her bio (`src/pages/about.astro`)
5. Supplies wishlist link (`donate.astro`)
6. `site:` URL in `astro.config.mjs`

## Going live (free, Cloudflare Pages)

1. Push repo to GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git → pick repo.
3. Framework preset **Astro** (build `npm run build`, output `dist`). Deploy.
4. Live at `<project>.pages.dev`; add a custom domain later (~$10/yr).
5. Auto-redeploys on every push.

## Known gotcha — CMS auth in production

`public/admin/config.yml` currently uses `local_backend: true` (works only
with `npm run cms` locally). For her to edit the live site, switch to the
GitHub backend AND set up OAuth — a static host can't do the GitHub OAuth
handshake alone. Options: a small Cloudflare Worker as the OAuth client, or
a hosted Decap OAuth provider. See Decap docs "External OAuth clients."
Don't tell her `/admin` works remotely until this is wired up.

## Dependency note — Astro 5 vs 7

Pinned to Astro 5.18.2 (the tested demo state). `npm audit` flags Astro <=7
XSS/SSR advisories, but they target server-rendering surfaces this
prerendered static site does not expose (no server islands, no define:vars
with untrusted data, no dynamic slot names); the esbuild alert is
dev-server-only and Windows-only. So the deployed site is effectively
unaffected. Do NOT run `npm audit fix --force` casually — it jumps to Astro
7 (major bump). Astro 7 was tested against this project and builds clean with
no code changes, so upgrading deliberately (`npm install astro@7`) is a valid
clean-audit path when ready. Roll back with `git checkout package*.json`.

## Deploying

See DEPLOY.md. Static `dist/` → Netlify Drop (fast preview) or Cloudflare
Pages (permanent home). The `/admin` CMS is local-only until production OAuth
is configured — never point the client at `/admin` on a remote URL yet.

## Guardrails for Claude Code in this repo

- Never add a fourth color or swap the palette without being asked.
- Keep JS off the client unless there's a real need; this is a static site.
- Run `npm run build` after structural changes to confirm it compiles.
- Treat `found-a-bird.astro` medical/legal guidance as placeholder the human
  must approve — don't present it as authoritative.
