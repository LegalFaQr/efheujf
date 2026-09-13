// The frontend is hosted on GitHub Pages; the admissions API lives on the deployed Cloudflare Worker.
const ADMISSIONS_API_BASE = 'https://kabira-international-school.kabiraswebsite.workers.dev';
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
    const snapshot = JSON.stringify(payload);
    if (snapshot !== previousPayload || !pendingId) pendingId = crypto.randomUUID();
    previousPayload = snapshot;
    payload.requestId = pendingId;
    button.disabled = true;
    button.textContent = 'Sending your enquiry…';
    status.textContent = '';
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
    } catch (error) {
      status.dataset.state = 'error';
      status.textContent = error.name === 'AbortError' ? 'We could not confirm receipt yet. Your details are still here. Please retry; the same enquiry will not be saved twice.' : error.message;
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.textContent = 'Send admission enquiry ↗';
      status.focus();
    }
  });
}
