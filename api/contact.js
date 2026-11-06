// Contact form → email to David via Resend.
// Env: RESEND_API_KEY (send-only key scoped to davidreich.me). Optional: CONTACT_TO.
// Never emails the visitor (prevents the form being used as a spam relay).

const TO = process.env.CONTACT_TO || 'david@davidreich.me';
const FROM = 'davidreich.me website <website@davidreich.me>';
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
  if (body.website || body.company) return res.status(200).json({ ok: true });

  const email = String(body.email || '').trim().slice(0, 254);
  const note = String(body.note || '').trim().slice(0, 5000);
  const clip = (v, n) => String(v || '').replace(/[\r\n]+/g, ' ').trim().slice(0, n);
  const name = clip(body.name, 120), org = clip(body.org, 160), phone = clip(body.phone, 40), kind = clip(body.kind, 80);
  if (!name) return res.status(400).json({ error: 'Please add your name.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Please enter a valid email.' });
  if (note.length < 2) return res.status(400).json({ error: 'Add a few lines about the project.' });

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      reply_to: email,
      subject: `${kind || 'Website inquiry'}: ${name}${org ? ` (${org})` : ''}`,
      text: `From: ${name} <${email}>\nCompany: ${org || '—'}\nPhone: ${phone || '—'}\nAbout: ${kind || '—'}\n\n${note}\n\n— Sent from the contact form on davidreich.me. Reply to this email to answer them directly.`,
      html: `<p><strong>From:</strong> ${esc(name)} &lt;<a href="mailto:${esc(email)}">${esc(email)}</a>&gt;<br><strong>Company:</strong> ${esc(org || '—')}<br><strong>Phone:</strong> ${esc(phone || '—')}<br><strong>About:</strong> ${esc(kind || '—')}</p><p style="white-space:pre-wrap">${esc(note)}</p><hr><p style="color:#666;font-size:13px">Sent from the contact form on davidreich.me. Reply to this email to answer them directly.</p>`,
    }),
  });

  if (!r.ok) {
    console.error('resend error', r.status, await r.text().catch(() => ''));
    return res.status(502).json({ error: 'Could not send right now. Please email david@davidreich.me.' });
  }
  return res.status(200).json({ ok: true });
}
