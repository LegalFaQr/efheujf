// Keep the existing public .html URLs while Pages serves extensionless assets internally.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'kabirainternational.com') {
      url.protocol = 'https:';
      url.hostname = 'www.kabirainternational.com';
      return Response.redirect(url.href, 301);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {status:405, headers:{Allow:'GET, HEAD'}});
    }
    if (env.HTML_PAGES.has(url.pathname)) {
      url.pathname = url.pathname === '/index.html' ? '/' : url.pathname.slice(0, -5);
    }
    const response = await env.ASSETS.fetch(new Request(url, request));
    if (!new URL(request.url).hostname.endsWith('.pages.dev')) return response;
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex');
    return new Response(response.body, {status:response.status, statusText:response.statusText, headers});
  }
};
