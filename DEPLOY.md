# Deploying this site

The site builds to a static `dist/` folder (`npm run build`). Any static
host works. Three paths, easiest first.

## 1. Netlify Drop — fastest, for showing one person

1. `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` FOLDER (the one containing index.html) onto the page.
   Not the whole project, not a zip — just the dist folder.
4. You get a public link instantly.

Anonymous drops expire after ~1 hour. Log in with a free Netlify account
before dropping to keep the site up permanently with a stable URL.

## 2. Cloudflare Pages + GitHub — the permanent home (recommended)

1. Push this repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create application → Pages →
   Connect to Git → pick the repo → Begin setup.
3. Framework preset: **Astro** (auto-fills build `npm run build`, output `dist`).
4. Save and Deploy. First build ~1-3 min → live at `<project>.pages.dev`.
5. Every `git push` auto-redeploys. Served from ~300 edge locations, free.

Add a custom domain later: project → Custom domains → Set up a domain.

## 3. Cloudflare Pages via CLI — on Cloudflare without wiring Git

```bash
npm run build
npx wrangler login
npx wrangler pages deploy dist
```
Wrangler returns a preview URL after upload.

## Notes

- **`/admin` (the CMS) does NOT work on remote previews yet.** It's in
  local-only mode. Don't send anyone to `/admin` until the production OAuth
  setup is done (see the `go-live` skill / CLAUDE.md). The public site works
  fine remotely; only the editor is local-only for now.
- Preview URLs are public. To gate one, use Cloudflare Access (Pages) or
  Netlify password protection (paid tier).
- Update `site:` in `astro.config.mjs` to the real URL once you have it.
