import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './Header.css';

type NavLinkItem = {
  name: string;
  path: string;
};

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const brandName = 'RezFix';

  const moonMaskRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const navLinks: NavLinkItem[] = [
    { name: 'Showcase', path: '/' },
    { name: 'About Us', path: '/about' },
  ];

  useEffect(() => {
    if (!moonMaskRef.current) return;
    const isDark = theme === 'dark';
    gsap.to(moonMaskRef.current, {
      x: isDark ? 6 : 24,
      y: isDark ? -6 : -24,
      opacity: isDark ? 1 : 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, [theme]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuOpen) return;
      if (navRef.current && navRef.current.contains(e.target as Node)) return;
      setMenuOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [menuOpen]);

  return (
    <header className={`header header-${theme}`}>
      <nav ref={navRef} className="nav">
        <Link to="/" className="brand">{brandName}</Link>

        <div className="controls flex items-center">
          <img
            src={theme === 'dark' ? '/images/moon.png' : '/images/sun.png'}
            alt="Theme Toggle Icon"
            className="toggle-icon"
            onClick={(e) => { e.stopPropagation(); onToggleTheme(); }}
            role="button"
          />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`nav-toggle text-text ${menuOpen ? 'open' : ''}`}
            aria-label="Menu toggle"
            type="button"
          >
            <svg className="hm" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" style={{ width: '24px', height: '24px' }}>
              <circle cx="4" cy="4" r="2" />
              <circle cx="12" cy="4" r="2" />
              <circle cx="20" cy="4" r="2" />
              <circle cx="4" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="20" cy="12" r="2" />
              <circle cx="4" cy="20" r="2" />
              <circle cx="12" cy="20" r="2" />
              <circle cx="20" cy="20" r="2" />
            </svg>
          </button>
        </div>

        <div className={`sub-menu ${menuOpen ? 'open' : ''}`}>
          <div className="sub-menu-shell">
            <div className="sub-menu-section">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`menu-item ${location.pathname === link.path ? 'menu-item-active' : 'menu-item-inactive'}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="sub-menu-divider" />

            <div className="sub-menu-section">
              <div className="sub-menu-label">Resources</div>
              <div className="sub-menu-resource-list">
                <Link to="/privacy-policy" className="menu-item menu-item-secondary" onClick={() => setMenuOpen(false)}>
                  Privacy Policy
                </Link>
                <Link to="/terms" className="menu-item menu-item-secondary" onClick={() => setMenuOpen(false)}>
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;