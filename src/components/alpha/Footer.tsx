import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ParticleText from './ParticleText';

interface FooterProps {
  theme: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const [brandName] = useState('RezFix');
  const [navLinks] = useState([
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms of Service', path: '/terms' },
  ]);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 640);
  const [fontSize, setFontSize] = useState(Math.min(380, window.innerWidth / 3) * 0.64);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 640;
      setIsDesktop(desktop);
      if (desktop) {
        setFontSize(Math.min(380, Math.max(160, window.innerWidth / 4)) * 0.64);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });
    // Run once on mount to align
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logoColor = theme === 'dark' ? '#ffffff' : '#111111';

  return (
    <footer className="footer">
      <div className="footer-split">
        {isDesktop && (
          <nav className="footer-links">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="footer-nav-link" style={{ fontWeight: '800' }}>
                {link.name}
              </Link>
            ))}
          </nav>
        )}

        <div
          className="footer-logo"
          style={{
            height: 'auto',
            minHeight: isDesktop ? '240px' : '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            contain: 'layout',
            overflow: 'hidden',
            flex: 1,
            width: isDesktop ? 'auto' : '100%'
          }}
        >
          {window.innerWidth >= 1024 ? (
            <ParticleText
              text={brandName}
              fontSize={fontSize}
              height={320}
              color={logoColor}
              className="select-none pointer-events-none flex-shrink-0"
              disableInteraction={false}
            />
          ) : (
            <div
              className="mobile-footer-logo"
              style={{
                color: logoColor,
                fontFamily: '"Neue Montreal", sans-serif',
                fontWeight: 'bold',
                fontSize: isDesktop ? 'clamp(80px, 12vw, 200px)' : 'clamp(48px, 17.6vw, 160px)',
                lineHeight: 1,
                textAlign: 'center',
                width: '100%',
                userSelect: 'none',
                padding: '2rem 0'
              }}
            >
              {brandName}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;