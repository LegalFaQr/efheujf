// The frontend is hosted on GitHub Pages; the admissions API lives on the deployed Cloudflare Worker.
const ADMISSIONS_API_BASE = 'https://kabira-international-school.kabiraswebsite.workers.dev';

// ── Cloudflare Turnstile — invisible, execute-on-submit ──────────────────────
// Widget renders with zero visible UI. Fires silently on submit. Only shows a
// brief challenge if Cloudflare genuinely suspects a bot (rare for real users).
const TS_SITE_KEY = '0x4AAAAAEzFsFRLQ4OgEpOW';
let tsWidgetId = null;
let tsResolve = null;

function initTurnstile() {
  const el = document.getElementById('turnstile-widget');
  if (!el || !window.turnstile || tsWidgetId !== null) return;
  tsWidgetId = window.turnstile.render(el, {
    sitekey: TS_SITE_KEY,
    execution: 'execute',
    appearance: 'interaction-only',
    callback: token => { if (tsResolve) { tsResolve(token); tsResolve = null; } },
    'expired-callback': () => { if (tsResolve) { tsResolve(null); tsResolve = null; } },
    'error-callback': () => { if (tsResolve) { tsResolve(null); tsResolve = null; } },
  });
}
// Handle both: Turnstile already loaded, or loads after this script
window.onloadTurnstileCallback = initTurnstile;
if (window.turnstile) initTurnstile();

function getTurnstileToken() {
  return new Promise(resolve => {
    if (tsWidgetId === null) { resolve(''); return; }
    tsResolve = resolve;
    window.turnstile.execute(tsWidgetId);
    // 15-second safety timeout
    setTimeout(() => { if (tsResolve) { tsResolve(''); tsResolve = null; } }, 15000);
  });
}
// ─────────────────────────────────────────────────────────────────────────────

const form = document.querySelector('#admission-form');
if (form) {
  const programmeField = form.querySelector('select[name=programme]');
  const requestedProgramme = new URLSearchParams(location.search).get('programme');
  if (programmeField && requestedProgramme && [...programmeField.options].some(option => option.value === requestedProgramme)) {
    programmeField.value = requestedProgramme;
  }
  const button = form.querySelector('button[type=submit]');
  const status = form.querySelector('.form-status');
  let pendingId;
  let previousPayload;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;
    const values = new FormData(form);
    const payload = Object.fromEntries(values);
    payload.consent = values.get('consent') === 'on';
    delete payload['cf-turnstile-response']; // remove if auto-injected; we manage token ourselves
    const snapshot = JSON.stringify(payload);
    if (snapshot !== previousPayload || !pendingId) pendingId = crypto.randomUUID();
    previousPayload = snapshot;
    payload.requestId = pendingId;
    button.disabled = true;
    button.textContent = 'Sending your enquiry…';
    status.textContent = '';
    // Request Turnstile token before hitting the API
    const turnstileToken = await getTurnstileToken();
    if (!turnstileToken) {
      status.dataset.state = 'error';
      status.textContent = 'Security check failed. Please refresh the page and try again.';
      button.disabled = false;
      button.textContent = 'Send admission enquiry ↗︎';
      status.focus();
      return;
    }
    payload.turnstileToken = turnstileToken;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`${ADMISSIONS_API_BASE}/api/admissions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), signal: controller.signal,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) throw new Error(result?.error || 'Your enquiry could not be saved. Please try again shortly.');
      status.dataset.state = 'success';
      status.textContent = `Thank you. Your enquiry has been received by Kabira. Reference: ${result.reference.slice(0, 8).toUpperCase()}. This is an enquiry, not confirmation of admission — you're also welcome to call or WhatsApp us on +91 91151 04300 any time.`;
      form.reset(); pendingId = null; previousPayload = null;
      if (window.turnstile && tsWidgetId !== null) window.turnstile.reset(tsWidgetId);
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.name === 'AbortError' ? 'We could not confirm receipt yet. Your details are still here. Please retry; the same enquiry will not be saved twice.' : error.message;
      if (window.turnstile && tsWidgetId !== null) window.turnstile.reset(tsWidgetId);
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.textContent = 'Send admission enquiry ↗︎';
      status.focus();
    }
  });
}
