const programmes = new Set(['Pre-Nursery', 'Nursery', 'LKG', 'UKG', 'Daycare', 'Help me choose']);
const ages = new Set(['Under 2', '2', '3', '4', '5', '6+']);
const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
const clean = value => typeof value === 'string' ? value.trim().replace(/[\u0000-\u001f]/g, '') : '';

export function validateAdmission(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Please complete the admission enquiry form.' };
  const parentName = clean(input.parentName);
  const childFirstName = clean(input.childFirstName);
  const childAge = clean(input.childAge);
  const programme = clean(input.programme);
  const contactNumber = clean(input.contactNumber).replace(/[\s()+-]/g, '').replace(/^91(?=\d{10}$)/, '');
  const message = clean(input.message);
  const id = clean(input.requestId);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return { error: 'Please reload the page and try again.' };
  if (parentName.length < 2 || parentName.length > 100) return { error: 'Please enter the parent or guardian’s name (2–100 characters).' };
  if (!childFirstName || childFirstName.length > 60) return { error: 'Please enter your child’s first name (up to 60 characters).' };
  if (!ages.has(childAge) || !programmes.has(programme)) return { error: 'Please select your child’s age and a programme.' };
  if (!/^[6-9]\d{9}$/.test(contactNumber)) return { error: 'Please enter a valid 10-digit Indian mobile number.' };
  if (message.length > 1000) return { error: 'Please keep your message within 1,000 characters.' };
  if (input.consent !== true) return { error: 'Please confirm that you agree to be contacted about this enquiry.' };
  if (clean(input.website)) return { error: 'Your enquiry could not be accepted. Please try again.' };
  return { value: { id, parentName, childFirstName, childAge, programme, contactNumber, message } };
}

async function saveAdmission(db, data) {
  const now = new Date();
  const since = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  // The conditional insert and conflict handling make repeat requests safe.
  const result = await db.prepare(`INSERT INTO admissions
    (id, parent_name, child_first_name, child_age, programme, contact_number, message, consent_at, created_at)
    SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
    WHERE (SELECT COUNT(*) FROM admissions WHERE contact_number = ? AND created_at > ?) < 3
    ON CONFLICT(id) DO NOTHING`).bind(data.id, data.parentName, data.childFirstName, data.childAge, data.programme, data.contactNumber, data.message, now.toISOString(), now.toISOString(), data.contactNumber, since).run();
  if (result.success === false) throw new Error('Admission insert failed');
  if (result.meta?.changes === 0) {
    const existing = await db.prepare('SELECT id FROM admissions WHERE id = ? AND contact_number = ?').bind(data.id, data.contactNumber).first();
    if (!existing) return false;
  }
  return true;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/admissions') {
      if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
      if (request.headers.get('origin') !== url.origin || request.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'Please submit your enquiry from the Kabira website.' }, 403);
      if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'Please use the admissions form on this website.' }, 415);
      if (Number(request.headers.get('content-length') || 0) > 8192) return json({ error: 'This enquiry is too large.' }, 413);
      let input;
      try {
        const reader = request.body?.getReader();
        const chunks = []; let length = 0;
        if (!reader) return json({ error: 'Please complete the form.' }, 400);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.length;
          if (length > 8192) { await reader.cancel(); return json({ error: 'This enquiry is too large.' }, 413); }
          chunks.push(value);
        }
        const bytes = new Uint8Array(length); let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
        input = JSON.parse(new TextDecoder().decode(bytes));
      } catch { return json({ error: 'Please check your form and try again.' }, 400); }
      const checked = validateAdmission(input);
      if (checked.error) return json({ error: checked.error }, 400);
      try {
        if (!env.DB) throw new Error('Missing admissions database');
        const saved = await saveAdmission(env.DB, checked.value);
        if (!saved) return json({ error: 'We have received several enquiries for this number. Please try again in an hour.' }, 429);
        return json({ ok: true, reference: checked.value.id, message: 'Thank you. Your admission enquiry has been received by Kabira.' }, 201);
      } catch {
        console.error('Admissions storage unavailable');
        return json({ error: 'We could not save your enquiry right now. Your details are still in the form; please try again shortly.' }, 503);
      }
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    const assets = typeof PUBLIC_ASSETS === 'undefined' ? {} : PUBLIC_ASSETS;
    const asset = Object.hasOwn(assets, pathname) ? assets[pathname] : null;
    if (!asset) return new Response('Page not found', { status: 404 });
    const headers = { 'Content-Type': asset.type, 'ETag': asset.etag, 'Cache-Control': asset.type.startsWith('text/html') ? 'no-cache' : 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' };
    if (request.headers.get('if-none-match') === asset.etag) return new Response(null, { status: 304, headers });
    return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(asset.body), c => c.charCodeAt(0)), { headers });
  },
};
