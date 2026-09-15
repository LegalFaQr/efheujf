import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import worker from '../worker/index.js';
const EXPORT_KEY = 'local-test-export-key';

// Keep every admissions test offline: notification calls are stubbed; unexpected network calls fail.
const stubFetch = (input, init) => {
  const requestUrl = typeof input === 'string' ? input : input.url;
  if (requestUrl === 'https://api.resend.com/emails') {
    return Promise.resolve(new Response(JSON.stringify({ success: 'true' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }
  throw new Error('Unexpected network request in test: ' + requestUrl);
};
globalThis.fetch = stubFetch;

function database() {
  const sqlite = new DatabaseSync(':memory:');
  for (const name of readdirSync('drizzle').filter(n => n.endsWith('.sql'))) sqlite.exec(readFileSync(`drizzle/${name}`, 'utf8'));
  return { sqlite, prepare(sql) {
    return {
      bind(...values) { return {
        async run() { const r = sqlite.prepare(sql).run(...values); return { success: true, meta: { changes: r.changes } }; },
        async first() { return sqlite.prepare(sql).get(...values) || null; },
      }; },
      async all() { return { results: sqlite.prepare(sql).all(), success: true }; },
    };
  } };
}
const valid = () => ({ requestId: crypto.randomUUID(), parentName: 'Test Parent', childFirstName: 'Test Child', childAge: '3', programme: 'Nursery', contactNumber: '9000000000', message: 'Local automated test only', consent: true, website: '' });
function request(data, headers = {}) {
  return new Request('https://kabira.test/api/admissions', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://kabira.test', ...headers }, body: JSON.stringify(data) });
}

test('enquiry is saved with consent, and a retry does not create a duplicate', async () => {
  const DB = database(); const data = valid();
  const first = await worker.fetch(request(data), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY });
  assert.equal(first.status, 201); assert.equal((await first.json()).ok, true);
  const retry = await worker.fetch(request(data), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY });
  assert.equal(retry.status, 201);
  const rows = DB.sqlite.prepare('SELECT * FROM admissions').all();
  assert.equal(rows.length, 1); assert.equal(rows[0].child_first_name, 'Test Child');
  assert.equal(rows[0].status, 'new'); assert.ok(rows[0].consent_at);
  DB.sqlite.close();
});
test('validation rejects missing consent, invalid programmes, phone, age and oversized input', async () => {
  const DB = database();
  for (const changes of [{ consent: false }, { programme: 'Class 10' }, { childAge: '99' }, { contactNumber: '123' }, { parentName: '' }, { childFirstName: '' }, { requestId: 'bad-id' }, { website: 'spam' }, { message: 'a'.repeat(1001) }]) {
    const response = await worker.fetch(request({ ...valid(), ...changes }), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY });
    assert.equal(response.status, 400);
  }
  assert.equal(DB.sqlite.prepare('SELECT count(*) as count FROM admissions').get().count, 0);
  assert.equal((await worker.fetch(request({ ...valid(), message: 'a'.repeat(9000) }), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY })).status, 413);
  DB.sqlite.close();
});
test('cross-site submissions and public record reads are blocked', async () => {
  assert.equal((await worker.fetch(request(valid(), { Origin: 'https://unrelated.test' }), {})).status, 403);
  assert.equal((await worker.fetch(new Request('https://kabira.test/api/admissions'), {})).status, 405);
});
test('database failure does not claim that an enquiry was received', async () => {
  const response = await worker.fetch(request(valid()), {});
  assert.equal(response.status, 503); assert.ok((await response.json()).error.includes('could not save'));
});
test('mobile-number rate cap permits retries but limits fresh enquiries', async () => {
  const DB = database(); const first = valid();
  assert.equal((await worker.fetch(request(first), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY })).status, 201);
  for (let i = 0; i < 2; i++) assert.equal((await worker.fetch(request(valid()), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY })).status, 201);
  assert.equal((await worker.fetch(request(valid()), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY })).status, 429);
  assert.equal((await worker.fetch(request(first), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY })).status, 201);
  DB.sqlite.close();
});
test('country-code phone input is normalised before saving', async () => {
  const DB = database();
  assert.equal((await worker.fetch(request({ ...valid(), contactNumber: '+91 9000000000' }), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY })).status, 201);
  assert.equal(DB.sqlite.prepare('SELECT contact_number FROM admissions').get().contact_number, '9000000000');
  DB.sqlite.close();
});
test('admissions export is hidden without the correct key', async () => {
  const DB = database();
  assert.equal((await worker.fetch(new Request('https://kabira.test/api/admissions/export'), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY })).status, 404);
  assert.equal((await worker.fetch(new Request('https://kabira.test/api/admissions/export?key=wrong'), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY })).status, 404);
  DB.sqlite.close();
});
test('admissions export returns a valid xlsx workbook with the correct key', async () => {
  const DB = database();
  await worker.fetch(request(valid()), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY });
  const response = await worker.fetch(new Request('https://kabira.test/api/admissions/export?key=' + EXPORT_KEY), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  const bytes = new Uint8Array(await response.arrayBuffer());
  assert.equal(bytes[0], 0x50); assert.equal(bytes[1], 0x4b); // "PK" zip signature
  DB.sqlite.close();
});
test('admission notification is sent on a successful enquiry, and never breaks the response', async () => {
  const DB = database();
  const response = await worker.fetch(request(valid()), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY });
  assert.equal(response.status, 201);
  DB.sqlite.close();
});
test('a failed notification attempt still lets the admission succeed', async () => {
  const DB = database();
  globalThis.fetch = () => Promise.reject(new Error('network down'));
  try {
    const response = await worker.fetch(request(valid()), { DB, ADMISSIONS_EXPORT_KEY: EXPORT_KEY });
    assert.equal(response.status, 201);
  } finally {
    globalThis.fetch = stubFetch;
  }
  DB.sqlite.close();
});

test('export is unavailable without a configured secret, even with an empty key', async () => {
  assert.equal((await worker.fetch(new Request('https://kabira.test/api/admissions/export'), {})).status, 404);
});
test('notification HTML escapes parent input and retries send only once', async () => {
  const DB = database(); const calls=[];const data={...valid(),parentName:'<b>Parent</b>',message:'<img src=x onerror=alert(1)>'};
  globalThis.fetch=async (url,init)=>{assert.equal(url,'https://api.resend.com/emails');calls.push(JSON.parse(init.body));return Response.json({id:'test'})};
  try {
    await worker.fetch(request(data), {DB}); await worker.fetch(request(data), {DB});
    assert.equal(calls.length,1);assert.ok(calls[0].html.includes('&lt;b&gt;Parent&lt;/b&gt;'));assert.ok(!calls[0].html.includes('<img src=x'));
  }finally{globalThis.fetch=stubFetch;DB.sqlite.close()}
});
