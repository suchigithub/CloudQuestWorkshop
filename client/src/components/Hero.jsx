/* ==========================================================
 * Hero Component
 * 
 * Full-viewport hero section with workshop title, organizer
 * info, date/venue, and a call-to-action button.
 * Includes animated floating cloud particles.
 * ========================================================== */

import React from 'react';

function Hero() {
  return (
    <section id="hero" className="hero">
      {/* Animated background particles */}
      <div className="hero__particles">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`particle particle--${i + 1}`} />
        ))}
      </div>

      <div className="hero__content">
        {/* Azure badge */}
        <div className="hero__badge">
          <span className="hero__badge-icon">⚡</span>
          Microsoft Azure Workshop
        </div>

        {/* Main title */}
        <h1 className="hero__title">
          Cloud Quest
          <span className="hero__subtitle">Microsoft Azure Workshop</span>
        </h1>

        {/* Organizer info */}
        <p className="hero__organizer">
          Organized by <strong>Alliance University</strong><br />
          School of Advanced Computing
        </p>
        <p className="hero__association">
          In association with <strong>Microsoft Azure Developer Community</strong>
        </p>

        {/* Event quick info */}
        <div className="hero__info-cards">
          <div className="hero__info-card">
            <span className="hero__info-icon">📅</span>
            <div>
              <strong>March 14, 2026</strong>
              <span>Saturday</span>
            </div>
          </div>
          <div className="hero__info-card">
            <span className="hero__info-icon">⏰</span>
            <div>
              <strong>10:00 AM – 01:00 PM</strong>
              <span>3 Hours</span>
            </div>
          </div>
          <div className="hero__info-card">
            <span className="hero__info-icon">📍</span>
            <div>
              <strong>LT-517, LC-2</strong>
              <span>Alliance University</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <a href="#register" className="hero__cta">
          Register Now
          <span className="hero__cta-arrow">→</span>
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="hero__scroll-indicator">
        <span>Scroll Down</span>
        <div className="hero__scroll-arrow">↓</div>
      </div>
    </section>
  );
}

export default Hero;
