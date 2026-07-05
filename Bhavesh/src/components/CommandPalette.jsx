import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiArrowRight, FiDownload, FiMail, FiGithub, FiLinkedin, FiCode, FiCompass, FiDroplet,
} from 'react-icons/fi';
import { nav, profile, socials } from '../data/content';
import { accents, applyAccent } from '../config';
import { scrollToSection } from '../hooks/useSmoothScroll';
import resumeUrl from '../assets/Bhavesh.pdf';
import { useToast } from './Toast';
import './CommandPalette.css';

export default function CommandPalette() {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => {
    const copyEmail = async () => {
      try {
        await navigator.clipboard.writeText(profile.email);
        toast('Email copied ∞', 'success');
      } catch (e) {
        toast('Could not copy email.', 'error');
      }
    };
    const download = () => {
      const a = document.createElement('a');
      a.href = resumeUrl;
      a.download = 'Bhavesh-Sharma-Resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast('Downloading résumé… ∞', 'success');
    };
    return [
      ...nav.map((n) => ({
        id: `go-${n.id}`, label: `Go to ${n.label}`, group: 'Navigate', icon: 'compass',
        action: () => scrollToSection(n.id),
      })),
      { id: 'resume', label: 'Download résumé (PDF)', group: 'Actions', icon: 'download', action: download },
      { id: 'email', label: `Copy email — ${profile.email}`, group: 'Actions', icon: 'mail', action: copyEmail },
      ...socials
        .filter((s) => s.icon !== 'globe')
        .map((s) => ({
          id: `soc-${s.label}`, label: `Open ${s.label}`, group: 'Links', icon: s.icon,
          action: () => window.open(s.href, '_blank', 'noopener,noreferrer'),
        })),
      ...accents.map((a) => ({
        id: `accent-${a.id}`, label: `Theme · ${a.label}`, group: 'Theme', icon: 'droplet',
        action: () => {
          applyAccent(a.id);
          toast(`Theme set to ${a.label}`, 'success');
        },
      })),
    ];
  }, [toast]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-command-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-command-palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      window.dispatchEvent(
        new CustomEvent('portfolio-xp', {
          detail: { amount: 15, id: 'open-palette', text: 'Command Explorer (Opened Ctrl+K Palette)' },
        })
      );
      setQuery('');
      setActive(0);
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 40);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const run = (cmd) => {
    if (!cmd) return;
    setOpen(false);
    setTimeout(() => cmd.action(), 60);
  };

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      run(results[active]);
    }
  };

  const iconFor = (name) =>
    ({
      compass: <FiCompass />, download: <FiDownload />, mail: <FiMail />,
      github: <FiGithub />, linkedin: <FiLinkedin />, code: <FiCode />, droplet: <FiDroplet />,
    }[name] || <FiArrowRight />);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            className="cmdk"
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Command menu"
          >
            <div className="cmdk-input">
              <FiSearch />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Search sections, actions, themes…"
                aria-label="Search commands"
              />
              <span className="cmdk-esc">ESC</span>
            </div>
            <ul className="cmdk-list">
              {results.length === 0 && <li className="cmdk-empty">No matches</li>}
              {results.map((c, i) => (
                <li key={c.id}>
                  <button
                    className={`cmdk-item ${i === active ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => run(c)}
                  >
                    <span className="cmdk-ico">{iconFor(c.icon)}</span>
                    <span className="cmdk-label">{c.label}</span>
                    <span className="cmdk-group">{c.group}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="cmdk-foot">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> select
              </span>
              <span>
                <kbd>esc</kbd> close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
