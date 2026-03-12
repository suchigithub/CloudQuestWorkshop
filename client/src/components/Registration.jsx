/* ==========================================================
 * Registration Component
 * 
 * Contains a registration form and a QR code section.
 * Form submits to the .NET API /api/register endpoint.
 * ========================================================== */

import React, { useState } from 'react';

function Registration() {
  const [form, setForm] = useState({ Name: '', Email: '', Password: '', Institution: '' });
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setForm({ Name: '', Email: '', Password: '', Institution: '' });
      } else {
        setStatus('error');
        setMessage(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="register" className="register">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <span className="section-tag">Register Now</span>
          <h2 className="section-title">Secure Your Spot</h2>
          <p className="section-desc">
            Limited seats available! Register now to join the Cloud Quest workshop.
          </p>
        </div>

        <div className="register__grid">
          {/* Registration form */}
          <div className="register__form-wrapper">
            <form className="register__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="Name"
                  value={form.Name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="Email"
                  value={form.Email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  maxLength={254}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="Password"
                  value={form.Password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 characters)"
                  required
                  minLength={6}
                  maxLength={100}
                />
              </div>

              <div className="form-group">
                <label htmlFor="institution">Institution / Organization</label>
                <input
                  type="text"
                  id="institution"
                  name="Institution"
                  value={form.Institution}
                  onChange={handleChange}
                  placeholder="e.g., Alliance University"
                  required
                  maxLength={200}
                />
              </div>

              <button
                type="submit"
                className="register__submit"
                disabled={submitting}
              >
                {submitting ? 'Registering...' : 'Register for Workshop'}
              </button>

              {/* Status message */}
              {status && (
                <div className={`register__status register__status--${status}`}>
                  {status === 'success' ? '✅' : '❌'} {message}
                </div>
              )}
            </form>
          </div>

          {/* QR Code section */}
          <div className="register__qr">
            <div className="register__qr-card">
              <h3>Scan to Register</h3>
              <p>Use your phone camera to scan the QR code</p>

              {/* SVG QR code placeholder */}
              <div className="register__qr-image">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <rect width="200" height="200" fill="white" rx="8" />
                  {/* QR positioning squares */}
                  <rect x="10" y="10" width="50" height="50" fill="#0078D4" rx="4" />
                  <rect x="18" y="18" width="34" height="34" fill="white" rx="2" />
                  <rect x="24" y="24" width="22" height="22" fill="#0078D4" rx="2" />

                  <rect x="140" y="10" width="50" height="50" fill="#0078D4" rx="4" />
                  <rect x="148" y="18" width="34" height="34" fill="white" rx="2" />
                  <rect x="154" y="24" width="22" height="22" fill="#0078D4" rx="2" />

                  <rect x="10" y="140" width="50" height="50" fill="#0078D4" rx="4" />
                  <rect x="18" y="148" width="34" height="34" fill="white" rx="2" />
                  <rect x="24" y="154" width="22" height="22" fill="#0078D4" rx="2" />

                  {/* Data pattern */}
                  {[70,80,90,100,110,120].map((x) =>
                    [70,80,90,100,110,120].map((y) => (
                      <rect
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        width="8"
                        height="8"
                        fill={(x + y) % 20 === 0 ? '#0078D4' : ((x * y) % 3 === 0 ? '#50E6FF' : '#0078D4')}
                        opacity={(x + y) % 30 === 0 ? 0.3 : 0.8}
                        rx="1"
                      />
                    ))
                  )}

                  {/* Center logo area */}
                  <rect x="80" y="80" width="40" height="40" fill="white" rx="4" />
                  <text x="100" y="105" textAnchor="middle" fill="#0078D4" fontSize="14" fontWeight="bold">CQ</text>
                </svg>
              </div>

              <p className="register__qr-note">
                Or register using the form
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Registration;
