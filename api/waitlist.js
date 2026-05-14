const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://wsayghqewyqvybzflqew.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzYXlnaHFld3lxdnliemZscWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NDgxNzAsImV4cCI6MjA5NDMyNDE3MH0.29_PNiKVVY2516F1p8lE0N_fFY80s4m-97mDZBXs21E';
const EMAIL_USER = process.env.EMAIL_USER || 'info.lexnotes@gmail.com';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { intent, name, email, college, year_sem } = req.body || {};
    if (!intent || !name || !email) return res.status(400).json({ error: 'Missing required fields' });
    if (!['buyer', 'seller'].includes(intent)) return res.status(400).json({ error: 'Invalid intent' });

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { error } = await supabase.from('waitlist_signups').insert([{ intent, name, email, college: college || null, year_sem: year_sem || null }]);
    if (error) return res.status(400).json({ error: error.message });

    if (process.env.EMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: EMAIL_USER, pass: process.env.EMAIL_APP_PASSWORD } });
      await transporter.sendMail({
        from: `LexNotes <${EMAIL_USER}>`,
        to: email,
        subject: 'You joined the LexNotes waitlist',
        html: `<div style="font-family:Georgia,serif;background:#f4eee3;color:#1f1712;padding:28px"><h2>Welcome to LexNotes.</h2><p>Thanks for joining the early-access waitlist.</p><p>We’re building LexNotes carefully for law students who care about clarity, structure, and quality study material.</p><p>We’ll let you know when early access opens.</p><br/><p>— LexNotes</p></div>`
      });
      await supabase.from('waitlist_signups').update({ confirmation_email_sent: true }).eq('email', email);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
