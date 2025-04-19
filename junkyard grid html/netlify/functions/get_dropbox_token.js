// netlify/functions/get_dropbox_token.js
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const REFRESH_TOKEN = process.env.DROPBOX_REFRESH_TOKEN;
  const CLIENT_ID     = process.env.DROPBOX_CLIENT_ID;
  const CLIENT_SECRET = process.env.DROPBOX_CLIENT_SECRET;

  // Dropbox requires Basic auth on this endpoint
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`)
                        .toString('base64');

  const params = new URLSearchParams();
  params.append('grant_type',    'refresh_token');
  params.append('refresh_token', REFRESH_TOKEN);

  const resp = await fetch('https://api.dropboxapi.com/oauth2/token', {
    method:  'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type':  'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!resp.ok) {
    const err = await resp.json();
    console.error('Dropbox token refresh error:', err);
    return { statusCode: 500, body: JSON.stringify(err) };
  }

  const { access_token } = await resp.json();

  return {
    statusCode: 200,
    body: JSON.stringify({ access_token })
  };
};
