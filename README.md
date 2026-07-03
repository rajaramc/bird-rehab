# Second Flight — Bird Rehab Website

A free-to-host static site for a wildlife bird rehabilitator.
Built with [Astro](https://astro.build) + [Decap CMS](https://decapcms.org).
Three colors, zero hosting cost, zero maintenance.

## Run it locally (Mac)

Requires Node.js 18.17+ (`node --version` to check; `brew install node` if needed).

```bash
cd bird-rehab-site
npm install
npm run dev
```

Open **http://localhost:4321** — that's the demo.

## Demo the editor she'll use (optional but impressive)

In a **second terminal**:

```bash
npm run cms
```

Then open **http://localhost:4321/admin**. No login needed in local mode.
She can click "New Updates", fill in the form, hit Publish — and watch the
post appear on the site instantly. Edits are written to real files in
`src/content/posts/`.

## Where everything lives

| Path                        | What it is                                  |
| --------------------------- | ------------------------------------------- |
| `src/content/posts/*.md`    | Her posts (one Markdown file each)          |
| `src/pages/`                | The pages: home, donate, found-a-bird, about|
| `src/layouts/Base.astro`    | Header, nav, footer, fonts                  |
| `src/styles/global.css`     | All styling — 3 color tokens at the top     |
| `public/admin/config.yml`   | The CMS editor config                       |
| `public/images/`            | Photos, her Venmo QR code                   |

## Before going live — the swap list

Search the project for `placeholder`, `REPLACE`, and `TODO`:

1. Site name "Second Flight" → her real operation name (in `Base.astro`)
2. Venmo handle + QR image on `src/pages/donate.astro`
3. Phone number on `src/pages/found-a-bird.astro` — and have HER review
   that page's guidance; it's generic placeholder advice
4. Her bio on `src/pages/about.astro`
5. Wishlist link on the donate page (Amazon wishlist works well)

## Going live (free) on Cloudflare Pages

1. Push this folder to your GitHub repo.
2. Cloudflare dashboard → Workers & Pages → Create → Pages →
   Connect to Git → pick the repo.
3. Build settings: framework preset **Astro**
   (build command `npm run build`, output dir `dist`). Deploy.
4. Site is live at `<project>.pages.dev`. Add a custom domain later
   (~$10/yr via Cloudflare Registrar) if she wants one.

Every future `git push` (or CMS publish, once connected) redeploys
automatically.

## Turning on the CMS for her (after deploy)

Local mode won't work for her remotely. In `public/admin/config.yml`:
delete the `local_backend: true` line, uncomment the `backend:` block, and
set `repo:` to your GitHub repo. She'll then log in at
`hersite.com/admin` with a GitHub account you invite as a collaborator
(or set up Decap's GitHub OAuth via a small Cloudflare Worker — see
Decap docs for "External OAuth clients").

## Design system

Three colors only, defined at the top of `src/styles/global.css`:

- `--spruce  #1E332A` — text, buttons, footer (tints via rgba)
- `--paper   #FAFAF7` — background
- `--gold    #E0A32E` — the single accent: donate, links, "Released" chips

Type: Fraunces (display) + Nunito Sans (body), loaded from Google Fonts.
