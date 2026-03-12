/* ==========================================================
 * EventDetails Component
 * 
 * Shows venue, date/time, and what to bring in a 
 * clean card-based layout.
 * ========================================================== */

import React from 'react';

function EventDetails() {
  return (
    <section id="details" className="details">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <span className="section-tag">Event Details</span>
          <h2 className="section-title">Everything You Need to Know</h2>
        </div>

        <div className="details__grid">
          {/* Venue card */}
          <div className="details__card">
            <div className="details__card-icon">📍</div>
            <h3>Venue</h3>
            <p className="details__primary">LT-517, LC-2</p>
            <p>Alliance University</p>
            <p>School of Advanced Computing</p>
          </div>

          {/* Date & Time card */}
          <div className="details__card">
            <div className="details__card-icon">📅</div>
            <h3>Date & Time</h3>
            <p className="details__primary">March 14, 2026</p>
            <p>Saturday</p>
            <p>10:00 AM – 01:00 PM</p>
          </div>

          {/* What to bring card */}
          <div className="details__card">
            <div className="details__card-icon">💻</div>
            <h3>What to Bring</h3>
            <ul className="details__list">
              <li>Laptop with browser</li>
              <li>Azure free account</li>
              <li>GitHub account</li>
              <li>Enthusiasm to learn!</li>
            </ul>
          </div>

          {/* Prerequisites card */}
          <div className="details__card">
            <div className="details__card-icon">📋</div>
            <h3>Prerequisites</h3>
            <ul className="details__list">
              <li>Basic programming knowledge</li>
              <li>Understanding of web concepts</li>
              <li>No prior Azure experience needed</li>
              <li>Open to all students</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventDetails;
