/* ==========================================================
 * Speaker Component
 * 
 * Showcases the workshop speaker with a profile image,
 * name, title, company, and brief bio.
 * ========================================================== */

import React from 'react';

function Speaker() {
  return (
    <section id="speaker" className="speaker">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <span className="section-tag">Featured Speaker</span>
          <h2 className="section-title">Meet Your Instructor</h2>
          <p className="section-desc">
            Learn from an industry expert with extensive experience in 
            Microsoft Azure and cloud-native development.
          </p>
        </div>

        {/* Speaker card */}
        <div className="speaker__card">
          <div className="speaker__image-wrapper">
            {/* Profile image placeholder – uses CSS-generated avatar */}
            <div className="speaker__image">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#0078D4', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#50E6FF', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="98" fill="url(#grad)" />
                <circle cx="100" cy="80" r="35" fill="white" opacity="0.9" />
                <ellipse cx="100" cy="155" rx="50" ry="35" fill="white" opacity="0.9" />
                <text x="100" y="88" textAnchor="middle" fill="#0078D4" fontSize="20" fontWeight="bold">SN</text>
              </svg>
            </div>
            {/* Microsoft badge */}
            <div className="speaker__badge">
              <span>Microsoft</span>
            </div>
          </div>

          <div className="speaker__info">
            <h3 className="speaker__name">Ms. Suchitra Nayak</h3>
            <p className="speaker__role">Technical Project Manager – Microsoft Engagement</p>
            <p className="speaker__company">Tech Mahindra</p>

            <div className="speaker__divider"></div>

            <p className="speaker__bio">
              A seasoned technology professional with deep expertise in Microsoft Azure, 
              cloud-native architectures, and enterprise application development. Suchitra 
              brings hands-on experience in guiding teams through digital transformation 
              journeys, delivering scalable cloud solutions, and driving innovation with 
              Azure services.
            </p>

            {/* Expertise tags */}
            <div className="speaker__tags">
              <span className="tag">Azure Cloud</span>
              <span className="tag">Cloud Native</span>
              <span className="tag">App Deployment</span>
              <span className="tag">UI/UX Design</span>
              <span className="tag">DevOps</span>
              <span className="tag">Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Speaker;
