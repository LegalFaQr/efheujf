const programmes = new Set(['Pre-Nursery', 'Nursery', 'LKG', 'UKG', 'Daycare', 'Help me choose']);
const ages = new Set(['Under 2', '2', '3', '4', '5', '6+']);
const json = (data, status = 200, extraHeaders = {}) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extraHeaders } });
const clean = value => typeof value === 'string' ? value.trim().replace(/[\u0000-\u001f]/g, '') : '';
// The site's frontend is also hosted on GitHub Pages under this custom domain, so admissions API calls from there are cross-origin.
const ALLOWED_ORIGINS = new Set(['https://kabirainternational.com', 'https://www.kabirainternational.com']);
const corsHeaders = origin => ({ 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' });
// Fixed server-side destination — never read from the request, so it cannot be changed via dev tools or a forged submission.
const NOTIFY_EMAIL = 'kabiraschool.in@gmail.com';
// Shared secret for the Excel export below. Hardcoded (not an environment secret) so no account/credential setup is required to deploy this. Change it any time by editing this file.
export const EXPORT_KEY = '8d0kvga1sxq375r2pwmzft9nui4lj6bechoy';
// Lightweight branded 404 — kept inline rather than as a dist page to avoid extra build/routing complexity.
const notFoundPage = `<!doctype html><html lang="en-IN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found | Kabira The International School</title><meta name="robots" content="noindex"><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#102851;color:#fff;font:18px/1.6 'DM Sans',sans-serif;text-align:center;padding:24px}main{max-width:440px}h1{font:400 32px/1.2 'Playfair Display',Georgia,serif;margin:0 0 16px}p{color:#c9d6e8;margin:0 0 28px}a{display:inline-flex;padding:14px 24px;background:#94b862;color:#0b203f;text-decoration:none;font-weight:500}</style></head><body><main><h1>This page has wandered off.</h1><p>The page you're looking for doesn't exist. Let's get you back to Kabira The International School.</p><a href="/">Back to home ↗︎</a></main></body></html>`;

// Verifies a Cloudflare Turnstile token server-side. Returns true if valid.
async function verifyTurnstile(token, secret, ip) {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

// Sends a best-effort admission notification email via Resend. Never throws, so it can never break the enquiry response.
async function notifyAdmission(data, resendApiKey) {
  try {
    const html = `
      <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%;max-width:560px">
        <tr><td colspan="2" style="background:#122851;color:#fff;padding:18px 24px;font-size:18px;font-weight:600">
          New Admission Enquiry — Kabira The International School
        </td></tr>
        <tr style="background:#f5f7fa"><td style="padding:12px 16px;color:#555;width:40%"><strong>Reference</strong></td><td style="padding:12px 16px">${data.id.slice(0, 8).toUpperCase()}</td></tr>
        <tr><td style="padding:12px 16px;color:#555"><strong>Parent / Guardian</strong></td><td style="padding:12px 16px">${data.parentName}</td></tr>
        <tr style="background:#f5f7fa"><td style="padding:12px 16px;color:#555"><strong>Child's Name</strong></td><td style="padding:12px 16px">${data.childFirstName}</td></tr>
        <tr><td style="padding:12px 16px;color:#555"><strong>Age</strong></td><td style="padding:12px 16px">${data.childAge} years</td></tr>
        <tr style="background:#f5f7fa"><td style="padding:12px 16px;color:#555"><strong>Programme</strong></td><td style="padding:12px 16px">${data.programme}</td></tr>
        <tr><td style="padding:12px 16px;color:#555"><strong>Mobile</strong></td><td style="padding:12px 16px">+91 ${data.contactNumber}</td></tr>
        <tr style="background:#f5f7fa"><td style="padding:12px 16px;color:#555"><strong>Message</strong></td><td style="padding:12px 16px">${data.message || '—'}</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:13px;color:#888;margin-top:16px">Sent by Kabira admissions system · kabirainternational.com</p>
    `;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
      body: JSON.stringify({
        from: 'Kabira Admissions <admissions@kabirainternational.com>',
        to: [NOTIFY_EMAIL],
        subject: `New admission enquiry — ${data.childFirstName} (${data.programme})`,
        html,
      }),
    });
    if (!response.ok) console.error('Admission notification email failed', response.status, await response.text().catch(() => ''));
    else console.log('Admission notification email sent for', data.id.slice(0, 8));
  } catch (error) {
    console.error('Admission notification email failed', error);
  }
}

const u16 = n => [n & 0xff, (n >>> 8) & 0xff];
const u32 = n => [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff];
function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j++) crc = (crc & 1) ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function concatBytes(arrays) {
  const total = arrays.reduce((sum, a) => sum + a.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const a of arrays) { out.set(a, pos); pos += a.length; }
  return out;
}
// Builds an uncompressed (store-method) ZIP container — the format an .xlsx file uses — with no external dependency.
function zipStore(entries) {
  const encoder = new TextEncoder();
  const DOS_TIME = 0, DOS_DATE = 22561; // fixed placeholder timestamp; exact value is not meaningful for a data export
  const localParts = []; const centralParts = []; let offset = 0;
  for (const { name, data } of entries) {
    const nameBytes = encoder.encode(name);
    const crc = crc32(data); const size = data.length;
    const local = new Uint8Array([0x50,0x4b,0x03,0x04, ...u16(20), ...u16(0), ...u16(0), ...u16(DOS_TIME), ...u16(DOS_DATE), ...u32(crc), ...u32(size), ...u32(size), ...u16(nameBytes.length), ...u16(0)]);
    const localHeaderOffset = offset;
    localParts.push(local, nameBytes, data);
    offset += local.length + nameBytes.length + data.length;
    centralParts.push(new Uint8Array([0x50,0x4b,0x01,0x02, ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(DOS_TIME), ...u16(DOS_DATE), ...u32(crc), ...u32(size), ...u32(size), ...u16(nameBytes.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(localHeaderOffset)]), nameBytes);
  }
  const centralStart = offset;
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const eocd = new Uint8Array([0x50,0x4b,0x05,0x06, ...u16(0), ...u16(0), ...u16(entries.length), ...u16(entries.length), ...u32(centralSize), ...u32(centralStart), ...u16(0)]);
  return concatBytes([...localParts, ...centralParts, eocd]);
}
const xmlEscape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
function sheetRowXml(values, rowIndex) {
  const columns = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const cells = values.map((value, i) => `<c r="${columns[i]}${rowIndex}" t="inlineStr"><is><t xml:space="preserve">${xmlEscape(value)}</t></is></c>`).join('');
  return `<row r="${rowIndex}">${cells}</row>`;
}
// Builds a minimal but genuine .xlsx workbook (no library) so admissions can be opened directly in Excel.
function buildAdmissionsXlsx(rows) {
  const headers = ['Reference', 'Parent / Guardian', 'Child', 'Age', 'Programme', 'Mobile', 'Message', 'Status', 'Submitted (UTC)'];
  const dataRows = rows.map(r => [r.id, r.parent_name, r.child_first_name, r.child_age, r.programme, `+91 ${r.contact_number}`, r.message, r.status, r.created_at]);
  const sheetRows = [headers, ...dataRows].map((values, i) => sheetRowXml(values, i + 1)).join('');
  const sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`;
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`;
  const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Admissions" sheetId="1" r:id="rId1"/></sheets></workbook>`;
  const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`;
  const encoder = new TextEncoder();
  return zipStore([
    { name: '[Content_Types].xml', data: encoder.encode(contentTypes) },
    { name: '_rels/.rels', data: encoder.encode(rootRels) },
    { name: 'xl/workbook.xml', data: encoder.encode(workbookXml) },
    { name: 'xl/_rels/workbook.xml.rels', data: encoder.encode(workbookRels) },
    { name: 'xl/worksheets/sheet1.xml', data: encoder.encode(sheetXml) },
  ]);
}

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
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/admissions') {
      const origin = request.headers.get('origin');
      const allowedOrigin = origin === url.origin || ALLOWED_ORIGINS.has(origin);
      if (request.method === 'OPTIONS') return allowedOrigin ? new Response(null, { status: 204, headers: corsHeaders(origin) }) : new Response(null, { status: 403 });
      if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
      if (!allowedOrigin) return json({ error: 'Please submit your enquiry from the Kabira website.' }, 403);
      const cors = corsHeaders(origin);
      if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'Please use the admissions form on this website.' }, 415, cors);
      if (Number(request.headers.get('content-length') || 0) > 8192) return json({ error: 'This enquiry is too large.' }, 413, cors);
      let input;
      try {
        const reader = request.body?.getReader();
        const chunks = []; let length = 0;
        if (!reader) return json({ error: 'Please complete the form.' }, 400, cors);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.length;
          if (length > 8192) { await reader.cancel(); return json({ error: 'This enquiry is too large.' }, 413, cors); }
          chunks.push(value);
        }
        const bytes = new Uint8Array(length); let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
        input = JSON.parse(new TextDecoder().decode(bytes));
      } catch { return json({ error: 'Please check your form and try again.' }, 400, cors); }
      // Verify Turnstile token before anything else
      const turnstileToken = typeof input?.turnstileToken === 'string' ? input.turnstileToken : '';
      if (!turnstileToken) return json({ error: 'Please complete the security check and try again.' }, 400, cors);
      const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY, request.headers.get('cf-connecting-ip'));
      if (!turnstileOk) return json({ error: 'Security check failed. Please refresh the page and try again.' }, 403, cors);
      const checked = validateAdmission(input);
      if (checked.error) return json({ error: checked.error }, 400, cors);
      try {
        if (!env.DB) throw new Error('Missing admissions database');
        const saved = await saveAdmission(env.DB, checked.value);
        if (!saved) return json({ error: 'We have received several enquiries for this number. Please try again in an hour.' }, 429, cors);
        const notify = notifyAdmission(checked.value, env.RESEND_API_KEY);
        if (ctx?.waitUntil) ctx.waitUntil(notify); else await notify;
        return json({ ok: true, reference: checked.value.id, message: 'Thank you. Your admission enquiry has been received by Kabira.' }, 201, cors);
      } catch {
        console.error('Admissions storage unavailable');
        return json({ error: 'We could not save your enquiry right now. Your details are still in the form; please try again shortly.' }, 503, cors);
      }
    }
    if (url.pathname === '/api/admissions/export' && request.method === 'GET') {
      const key = url.searchParams.get('key') || '';
      // Constant response for "wrong key" so the endpoint can't be probed/enumerated.
      if (key !== EXPORT_KEY) return new Response(notFoundPage, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      if (!env.DB) return json({ error: 'Admissions database unavailable.' }, 503);
      try {
        const { results } = await env.DB.prepare('SELECT id, parent_name, child_first_name, child_age, programme, contact_number, message, status, created_at FROM admissions ORDER BY created_at DESC').all();
        const bytes = buildAdmissionsXlsx(results || []);
        return new Response(bytes, { headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="kabira-admissions.xlsx"',
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        } });
      } catch {
        console.error('Admissions export failed');
        return json({ error: 'Could not generate the export right now.' }, 503);
      }
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    const assets = typeof PUBLIC_ASSETS === 'undefined' ? {} : PUBLIC_ASSETS;
    const asset = Object.hasOwn(assets, pathname) ? assets[pathname] : null;
    if (!asset) return new Response(notFoundPage, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    const headers = { 'Content-Type': asset.type, 'ETag': asset.etag, 'Cache-Control': asset.type.startsWith('text/html') ? 'no-cache' : 'public, max-age=3600', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' };
    if (request.headers.get('if-none-match') === asset.etag) return new Response(null, { status: 304, headers });
    return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(asset.body), c => c.charCodeAt(0)), { headers });
  },
};
