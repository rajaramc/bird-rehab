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

## Decap CMS production auth (GitHub OAuth)

The `/admin` editor commits to GitHub, so it needs a server-side OAuth broker.
That's `functions/api/auth.js` + `functions/api/callback.js` (Cloudflare Pages
Functions — they deploy with the site, no separate Worker).

### One-time setup

1. **GitHub OAuth App** — GitHub → Settings → Developer settings → OAuth Apps →
   New OAuth App:
   - Homepage URL: `https://bird-rehab.pages.dev`
   - Authorization callback URL: `https://bird-rehab.pages.dev/api/callback`
   - Copy the **Client ID**, then generate and copy the **Client secret**.

2. **Cloudflare env vars** — Pages project → Settings → Environment variables
   (Production). Add, marking the secret as encrypted:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `ALLOWED_GITHUB_USERS` = comma-separated GitHub usernames, e.g.
     `rajaramc,her-github-username`

3. **Push and redeploy.** Env var changes only apply to a NEW build.

4. **Collaborator** — repo → Settings → Collaborators → invite her GitHub
   username. She must accept the emailed invite.

### Security model

- `/admin` is a public static page; that's fine. It has no authority.
- Every write is a **GitHub commit**. GitHub enforces repo permissions, so a
  stranger who logs in gets a token for THEIR account and is rejected (403)
  when Decap tries to write this repo.
- `ALLOWED_GITHUB_USERS` is defense-in-depth: `callback.js` refuses to hand
  back a token unless the authenticated username is on the list. If the var is
  unset, the gate is open and only GitHub's repo perms apply.
- The client secret lives only in Cloudflare env vars, never in the browser.
- **Enable 2FA on both GitHub accounts** — that is the real security boundary.
- Optional belt-and-braces: Cloudflare Zero Trust → Access → protect path
  `/admin*` so strangers can't even load the page.

### Testing the flow

1. `https://bird-rehab.pages.dev/admin/` → "Login with GitHub" → authorize.
2. CMS loads → create a test post → Publish.
3. Check the repo: a new commit appears in `src/content/posts/`.
4. Cloudflare rebuilds (~1-2 min) → post is live on the site.
5. Delete the test post via `/admin` and confirm it disappears after rebuild.
