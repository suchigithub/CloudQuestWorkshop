/* ==========================================================
 * Login Component
 * 
 * Login form for registered users. Validates credentials
 * against the .NET API /api/login endpoint.
 * Shows a welcome card after successful login.
 * ========================================================== */

import React, { useState } from 'react';

function Login({ user, onLogin }) {
  const [form, setForm] = useState({ Email: '', Password: '' });
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(null);
  const [lockedUntil, setLockedUntil] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setAttemptsRemaining(null);
        setLockedUntil(null);
        onLogin(data.user);
        setForm({ Email: '', Password: '' });
      } else if (res.status === 423) {
        setStatus('locked');
        setMessage(data.error);
        setLockedUntil(data.lockedUntil);
        setAttemptsRemaining(0);
      } else {
        setStatus('error');
        setMessage(data.error || 'Login failed. Please try again.');
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining);
        }
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="login" className="login">
      <div className="container">
        {/* Section header */}
        <div className="section-header">
          <span className="section-tag">Login</span>
          <h2 className="section-title">
            {user ? 'Welcome Back!' : 'Already Registered?'}
          </h2>
          <p className="section-desc">
            {user
              ? 'You are logged in and ready for the workshop.'
              : 'Log in with your registered email and password.'}
          </p>
        </div>

        {user ? (
          /* Logged-in welcome card */
          <div className="login__welcome">
            <div className="login__welcome-card">
              <div className="login__avatar">
                <span>{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <h3>{user.name}</h3>
              <p className="login__welcome-email">{user.email}</p>
              <p className="login__welcome-inst">{user.institution}</p>
              <div className="login__welcome-badge">
                ✅ Registered for Cloud Quest Workshop
              </div>
            </div>
          </div>
        ) : (
          /* Login form */
          <div className="login__form-wrapper">
            <form className="login__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  name="Email"
                  value={form.Email}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                  required
                  maxLength={254}
                />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input
                  type="password"
                  id="login-password"
                  name="Password"
                  value={form.Password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="login__submit"
                disabled={submitting}
              >
                {submitting ? 'Logging in...' : 'Log In'}
              </button>

              {/* Status message */}
              {status && (
                <div className={`register__status register__status--${status === 'locked' ? 'error' : status}`}>
                  {status === 'success' ? '✅' : status === 'locked' ? '🔒' : '❌'} {message}
                </div>
              )}

              {attemptsRemaining !== null && attemptsRemaining > 0 && (
                <div className="register__status register__status--error">
                  ⚠️ {attemptsRemaining} attempt{attemptsRemaining !== 1 ? 's' : ''} remaining before account lockout
                </div>
              )}

              <p className="login__register-link">
                Don't have an account?{' '}
                <a href="#register">Register here</a>
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

export default Login;
