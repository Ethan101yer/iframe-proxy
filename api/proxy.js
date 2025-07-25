// api/proxy.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const target = req.query.url;
  if (!target) {
    res.status(400).send('Missing url parameter');
    return;
  }
  const response = await fetch(target, { redirect: 'follow' });
  let html = await response.text();

  // Ensure relative assets still load
  const baseTag = `<base href="${target}">`;
  html = html.replace(/<head>/i, `<head>${baseTag}`);

  // Remove X-Frame-Options so we can iframe it
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
