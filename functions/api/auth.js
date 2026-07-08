// functions/api/auth.js
// Step 1 of the GitHub OAuth flow for Decap CMS.
// Decap opens this endpoint in a popup; we redirect the browser to GitHub's
// authorize page. The client SECRET is never used here (that happens in
// /api/callback), so nothing sensitive is exposed to the browser.

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('Server not configured: missing GITHUB_CLIENT_ID.', {
      status: 500,
    });
  }

  // GitHub will send the user back here after they approve.
  const redirectUri = `${url.origin}/api/callback`;

  // 'repo' works whether the repo is public or private.
  // If bird-rehab is PUBLIC, you can narrow this to 'public_repo' for least
  // privilege (edit the scope below and redeploy).
  const scope = 'repo,user';
  const state = crypto.randomUUID();

  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', redirectUri);
  authorize.searchParams.set('scope', scope);
  authorize.searchParams.set('state', state);

  return Response.redirect(authorize.toString(), 302);
}
