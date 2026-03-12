/* ==========================================================
 * Navbar Component
 * 
 * Fixed navigation bar with smooth-scroll links.
 * Includes a mobile hamburger menu toggle.
 * ========================================================== */

import React, { useState, useEffect } from 'react';

function Navbar({ user, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#speaker', label: 'Speaker' },
    { href: '#agenda', label: 'Agenda' },
    { href: '#details', label: 'Details' },
    { href: '#register', label: 'Register' },
    { href: '#login', label: 'Login' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        {/* Logo / Brand */}
        <a href="#hero" className="navbar__brand">
          <span className="navbar__icon">☁️</span>
          <span>Cloud Quest</span>
        </a>

        {/* Mobile hamburger toggle */}
        <button
          className={`navbar__toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span><span></span><span></span>
        </button>

        {/* Navigation links */}
        <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* User info (visible when logged in) */}
        {user && (
          <div className="navbar__user">
            <span className="navbar__user-name">👤 {user.name}</span>
            <button className="navbar__logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
