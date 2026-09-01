import React from 'react';
import '../styles/sign-in.css';

const StudyCoachSignIn = () => {
  return (
    <div className="container">
      <section className="left-panel">
        <div className="dot-pattern"></div>

        <div className="brand">
          <div className="brand-logo">
            <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 27L32 14L56 27L32 40L8 27Z" fill="#6050F6" />
              <path d="M17 32V39C17 42.5 23.7 47 32 47C40.3 47 47 42.5 47 39V32L32 40L17 32Z" fill="#4F46E5" />
              <path d="M56 27V39" stroke="#6050F6" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="56" cy="41" r="2.5" fill="#6050F6" />
              <path d="M56 43.5V48" stroke="#6050F6" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">Study Coach</span>
            <span className="brand-tagline">Your AI study coach</span>
          </div>
        </div>

        <h1 className="headline">
          Stop <span className="highlight">guessing</span><br />
          what to study.
        </h1>

        <p className="lead-text">
          Your AI study coach that tells you what to learn, where to learn it, what to practice and what to revise — all in one place.
        </p>

        <svg className="decor decor-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M3 5c2.4-1 5.4-1 7.5 0v13c-2.1-1-5.1-1-7.5 0V5z" />
          <path d="M18.5 5c-2.1-1-5.1-1-7.5 0v13c2.4-1 5.4-1 7.5 0V5z" />
        </svg>

        <svg className="decor decor-sparkle" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" />
        </svg>

        <div className="features-plan-row">
          <div className="features-list">

            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                  <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>AI Study Guidance</h3>
                <p>Personalized plans and smart recommendations just for you.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                  <path d="M4 5.5c2.1-1 5.1-1 7 0v13c-1.9-1-4.9-1-7 0v-13z" />
                  <path d="M20 5.5c-2.1-1-5.1-1-7 0v13c1.9-1 4.9-1 7 0v-13z" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Notes, Resources &amp; More</h3>
                <p>Curated notes, books, past papers and practice questions.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="7.5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div className="feature-text">
                <h3>Stay on Track</h3>
                <p>Daily goals, progress tracking and motivation to keep you consistent.</p>
              </div>
            </div>

          </div>

          <div className="plan-card">
            <div className="plan-header">
              <span className="plan-title">Today's Plan</span>
              <span className="plan-date">May 15, 2025</span>
            </div>

            <div className="plan-item">
              <span className="plan-status status-done">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.2 4.2L19 7" />
                </svg>
              </span>
              <span className="plan-item-text">
                <span className="plan-item-title">Variables in C++</span>
                <span className="plan-item-sub">Review notes &middot; 20 min</span>
              </span>
            </div>

            <div className="plan-item">
              <span className="plan-status status-active">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              <span className="plan-item-text">
                <span className="plan-item-title">Functions &amp; Parameters</span>
                <span className="plan-item-sub">Practice 10 questions &middot; 30 min</span>
              </span>
            </div>

            <div className="plan-item">
              <span className="plan-status status-upcoming"></span>
              <span className="plan-item-text">
                <span className="plan-item-title plan-item-muted">Loops</span>
                <span className="plan-item-sub">Mini quiz &middot; 20 min</span>
              </span>
            </div>

            <div className="plan-streak">
              <span className="streak-flame">&#128293;</span>
              <span>7 day streak</span>
            </div>
          </div>
        </div>

        <div className="illustration-wrap">
          <img
            src="assets/images/bacha.png"
            alt="Study Coach student illustration"
            width="383"
            height="280"
          />
        </div>
      </section>

      <section className="right-panel">
        <div className="auth-top">
          <span className="auth-top-text">New here?</span>
          <button type="button" className="btn-outline">Create an account</button>
        </div>

        <div className="auth-card">
          <h2 className="auth-heading">Welcome back <span className="wave">&#128075;</span></h2>
          <p className="auth-subtext">Log in to continue your learning journey.</p>

          <div className="social-buttons">
            <button type="button" className="btn-social">
              <svg className="icon-google" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3c-7.7 0-14.3 4.3-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.6 26.7 37.5 24 37.5c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 40.6 16.3 45 24 45z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C40.9 36 44 30.9 44 24c0-1.4-.1-2.7-.4-3.5z" />
              </svg>
              Continue with Google
            </button>

            <button type="button" className="btn-social">
              <svg className="icon-microsoft" viewBox="0 0 23 23">
                <rect x="1" y="1" width="10" height="10" fill="#F35325" />
                <rect x="12" y="1" width="10" height="10" fill="#81BC06" />
                <rect x="1" y="12" width="10" height="10" fill="#05A6F0" />
                <rect x="12" y="12" width="10" height="10" fill="#FFBA08" />
              </svg>
              Continue with Microsoft
            </button>
          </div>

          <div className="divider"><span>or</span></div>

          <form className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <input type="email" id="email" name="email" placeholder="Enter your email" />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
              <div className="input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 018 0v3" />
                </svg>
                <input type="password" id="password" name="password" placeholder="Enter your password" />
                <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>

            <label className="checkbox-row">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>

            <button type="submit" className="btn-primary">Log in</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default StudyCoachSignIn;