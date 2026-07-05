import { useState } from 'react';
import {
  FiMail, FiGithub, FiLinkedin, FiCode, FiGlobe, FiSend, FiCopy, FiCheck, FiLoader,
} from 'react-icons/fi';
import { profile, socials } from '../data/content';
import { telegram } from '../config';
import { scrollToSection } from '../hooks/useSmoothScroll';
import { useToast } from './Toast';
import Magnetic from './Magnetic';
import Reveal from './Reveal';
import LocalClock from './LocalClock';
import CodeCipher from './CodeCipher';
import './Contact.css';

const ICONS = { github: FiGithub, linkedin: FiLinkedin, code: FiCode, globe: FiGlobe };
const EMPTY = { name: '', email: '', date: '', message: '' };

function ContactForm() {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle');

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const emailOk = /\S+@\S+\.\S+/.test(form.email);
  const valid = form.name.trim() && emailOk && form.message.trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || status === 'sending') return;
    setStatus('sending');

    const lines = [
      ' New message from your portfolio',
      '',
      ` Name: ${form.name}`,
      `️ Email: ${form.email}`,
      form.date ? ` Preferred date: ${form.date}` : null,
      ` Message: ${form.message}`,
      '',
      ` ${new Date().toLocaleString()}`,
    ].filter(Boolean);

    try {
      const res = await fetch(`https://api.telegram.org/bot${telegram.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegram.chatId,
          text: lines.join('\n'),
          disable_web_page_preview: true,
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error('telegram-error');
      setStatus('sent');
      toast('Message sent — I’ll get back to you soon! ∞', 'success');
      setForm(EMPTY);
      setTimeout(() => setStatus('idle'), 2600);
    } catch (err) {
      setStatus('error');
      toast('Couldn’t send. Please email me directly.', 'error');
      setTimeout(() => setStatus('idle'), 2600);
    }
  };

  const label = {
    idle: (
      <>
        Send message <FiSend />
      </>
    ),
    sending: (
      <>
        Sending… <FiLoader className="spin" />
      </>
    ),
    sent: (
      <>
        Sent <FiCheck />
      </>
    ),
    error: (
      <>
        Try again <FiSend />
      </>
    ),
  }[status];

  return (
    <form className="cform glass" onSubmit={submit} noValidate>
      <div className="cform-row">
        <label className="cfield">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Your name"
            autoComplete="name"
            required
          />
        </label>
        <label className="cfield">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@email.com"
            autoComplete="email"
            required
          />
        </label>
      </div>

      <label className="cfield">
        <span>Preferred date (optional)</span>
        <input type="date" name="date" value={form.date} onChange={onChange} />
      </label>

      <label className="cfield">
        <span>Message</span>
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          rows={4}
          placeholder="Tell me about the role, project, or idea…"
          required
        />
      </label>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
        <button
          type="submit"
          className={`btn cform-submit ${status}`}
          disabled={!valid || status === 'sending'}
        >
          {label}
        </button>
      </div>
      <p className="cform-note">Your message is delivered straight to my inbox. No spam, ever.</p>
    </form>
  );
}

function PortScanner() {
  const [logs, setLogs] = useState([]);
  const [scanning, setScanning] = useState(false);

  const startScan = () => {
    if (scanning) return;
    setScanning(true);
    setLogs(['[+] Initializing Port Scanner...', '[+] Targeting: localhost (Bhavesh-Portfolio)']);

    const steps = [
      { delay: 600, log: '[+] Port 80 (HTTP) ........ [ OPEN ] - React Client' },
      { delay: 1200, log: '[+] Port 443 (HTTPS) ...... [ OPEN ] - SSL Secured' },
      { delay: 1800, log: '[+] Port 3000 (Backend) ... [ OPEN ] - API Node' },
      { delay: 2400, log: '[+] Port 27017 (MongoDB) .. [ SECURED ] - Firewall Active' },
      { delay: 3000, log: '[+] Port 22 (SSH) ......... [ CLOSED ] - Root Blocked' },
      { delay: 3600, log: '[*] Scan Complete. Host is SECURE (0 Critical Leaks).' },
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step.log]);
        if (step.log.startsWith('[*]')) {
          setScanning(false);
        }
      }, step.delay);
    });
  };

  return (
    <div className="port-scanner glass">
      <div className="scanner-head">
        <span className="scanner-dot"></span>
        <span className="scanner-title">Security Console (Simulation)</span>
      </div>
      <div className="scanner-display">
        {logs.length === 0 ? (
          <div className="scanner-placeholder">Click button to scan host security ports...</div>
        ) : (
          <div className="scanner-logs">
            {logs.map((log, index) => (
              <div key={index} className={`scanner-log-line ${log.startsWith('[*]') ? 'complete' : ''}`}>
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className="btn btn-ghost scanner-btn"
        onClick={startScan}
        disabled={scanning}
      >
        {scanning ? 'Scanning Ports...' : 'Scan Host Ports'}
      </button>
    </div>
  );
}

export default function Contact() {
  const toast = useToast();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      toast('Email copied! Ready to build something infinite ', 'success');
      window.dispatchEvent(
        new CustomEvent('portfolio-xp', {
          detail: { amount: 30, id: 'copy-email', text: 'Serious Recruiter (Copied Email Address)' },
        })
      );
    } catch (e) {
      toast('Could not copy — long-press to select.', 'error');
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">contact</span>
            <h2 className="section-title">
              Let&rsquo;s build something <span className="grad-text">infinite</span>
            </h2>
          </div>
          <p className="section-lead muted">
            Open to software / full-stack roles, internships and collaborations. Drop a line below
            or reach out directly.
          </p>
        </div>

        <div className="contact-grid">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="contact-side">
            <button className="contact-email glass" onClick={copyEmail} data-cursor>
              <span className="contact-email-icon">
                <FiMail />
              </span>
              <span className="contact-email-text">
                <em>Email</em>
                <CodeCipher text={profile.email} />
              </span>
              <FiCopy className="contact-email-copy" />
            </button>

            <div className="contact-socials">
              {socials.map((s) => {
                const Icon = ICONS[s.icon] || FiGlobe;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social"
                    data-cursor
                  >
                    <Icon />
                    <span>{s.label}</span>
                    <em>{s.short}</em>
                  </a>
                );
              })}
            </div>

            <PortScanner />
          </Reveal>
        </div>
      </div>

      <footer className="footer">
        <div className="container footer-inner">
          <button className="footer-brand" onClick={() => scrollToSection('top')}>
            <span className="footer-mark">∞</span>
            <span>{profile.name}</span>
          </button>
          <LocalClock />
          <span className="footer-copy">
            © {new Date().getFullYear()} {profile.name} · Engineering scalable web systems &amp; seamless pixel experiences.
          </span>
        </div>
      </footer>
    </section>
  );
}
