/* ==========================================================
 * Footer Component
 * 
 * Simple footer with organizer info, links, and copyright.
 * ========================================================== */

import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand column */}
          <div className="footer__brand">
            <h3>☁️ Cloud Quest</h3>
            <p>Microsoft Azure Workshop</p>
            <p className="footer__org">
              Alliance University<br />
              School of Advanced Computing
            </p>
          </div>

          {/* Quick links */}
          <div className="footer__links">
            <h4>Quick Links</h4>
            <a href="#hero">Home</a>
            <a href="#speaker">Speaker</a>
            <a href="#agenda">Agenda</a>
            <a href="#details">Details</a>
            <a href="#register">Register</a>
          </div>

          {/* Resources */}
          <div className="footer__links">
            <h4>Resources</h4>
            <a href="https://azure.microsoft.com" target="_blank" rel="noopener noreferrer">Microsoft Azure</a>
            <a href="https://learn.microsoft.com" target="_blank" rel="noopener noreferrer">Microsoft Learn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} Cloud Quest Workshop. Organized by 
            Alliance University School of Advanced Computing in association 
            with Microsoft Azure Developer Community.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
