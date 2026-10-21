import { useEffect, useState } from 'react';
import { person } from '../content';
import './Nav.css';

const links = [
  ['Projects', '#work'],
  ['Experience', '#experience'],
  ['About', '#about'],
  ['Contact', '#contact'],
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <div className="wrap nav__inner">
        <a className="nav__name" href="#top">
          {person.name}
          <span className="nav__mark" aria-hidden="true" />
        </a>
        <button
          className="nav__toggle data"
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
        <nav id="nav-links" className={`nav__links${open ? ' is-open' : ''}`} aria-label="Sections">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="nav__link data" onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <a className="nav__link nav__resume data" href={person.resume} download="Gunjan_Purohit_Resume.pdf">
            Résumé ↓
          </a>
        </nav>
      </div>
    </header>
  );
}
