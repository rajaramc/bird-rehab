// functions/api/callback.js
// Step 2 of the GitHub OAuth flow for Decap CMS.
//
// 1. Exchange the ?code for an access token SERVER-SIDE (the client secret
//    stays on Cloudflare and never reaches the browser).
// 2. Ask GitHub who this token belongs to.
// 3. ALLOWLIST CHECK: only hand the token back if that GitHub username is in
//    ALLOWED_GITHUB_USERS. Anyone else gets a clean "not authorized" and no
//    token at all.
// 4. Pass the token to the CMS window via the postMessage handshake Decap
//    expects.
//
// NOTE: GitHub still independently enforces repo permissions, so this
// allowlist is defense-in-depth, not the only thing standing between a
// stranger and your repo.

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing ?code from GitHub.', { status: 400 });
  }

  let result;
  try {
    // --- 1. code -> access token ---
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'decap-cms-oauth',
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = await tokenRes.json();

    if (!data.access_token) {
      result = {
        status: 'error',
        payload: { message: data.error_description || data.error || 'No token returned.' },
      };
      return html(result);
    }

    // --- 2. who is this? ---
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'decap-cms-oauth',
      },
    });

    if (!userRes.ok) {
      return html({
        status: 'error',
        payload: { message: 'Could not verify GitHub identity.' },
      });
    }

    const user = await userRes.json();
    const login = String(user.login || '');

    // --- 3. allowlist ---
    // Set ALLOWED_GITHUB_USERS in Cloudflare Pages env vars, comma-separated:
    //   rajaramc,her-github-username
    // If unset, the gate is OPEN (falls back to GitHub's own repo perms only).
    const allowRaw = env.ALLOWED_GITHUB_USERS || '';
    const allowList = allowRaw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (allowList.length > 0 && !allowList.includes(login.toLowerCase())) {
      return html({
        status: 'error',
        payload: {
          message:
            `The GitHub account "${login}" is not authorized to edit this site. ` +
            `Ask the site owner to add you.`,
        },
      });
    }

    // --- 4. success ---
    result = {
      status: 'success',
      payload: { token: data.access_token, provider: 'github' },
    };
  } catch (err) {
    result = { status: 'error', payload: { message: String(err) } };
  }

  return html(result);
}

function html(result) {
  return new Response(renderHandshake(result), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

// Decap's popup <-> opener handshake:
//   1. popup posts 'authorizing:github' to the opener
//   2. opener replies (which reveals its origin)
//   3. popup posts 'authorization:github:<status>:<json>' back to that origin
function renderHandshake({ status, payload }) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  return `<!doctype html>
<html>
  <body>
    <p>Completing sign-in… you can close this window.</p>
    <script>
      (function () {
        function receiveMessage(e) {
          window.opener.postMessage(${JSON.stringify(message)}, e.origin);
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;
}
