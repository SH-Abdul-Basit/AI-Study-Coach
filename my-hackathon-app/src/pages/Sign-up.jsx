import React from 'react';
import '../styles/sign-up.css';

const StudyCoachSignUp = () => {
  return (
    <>
      <section className="left-side">
        <header className="brand">
          <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 27L32 14L56 27L32 40L8 27Z" fill="#6050F6" />
            <path d="M17 32V39C17 42.5 23.7 47 32 47C40.3 47 47 42.5 47 39V32L32 40L17 32Z" fill="#4F46E5" />
            <path d="M56 27V39" stroke="#6050F6" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="56" cy="41" r="2.5" fill="#6050F6" />
            <path d="M56 43.5V48" stroke="#6050F6" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div>
            <h1>Study Coach</h1>
            <p>Your AI study coach</p>
          </div>
        </header>

        <main className="left-main">
          <section className="hero">
            <h2>Let’s build your<br /><span>smartest</span> semester.</h2>
            <p>
              Create your account in less than a minute and<br className="desktop-break" />
              get a personalized study plan that actually works.
            </p>
          </section>

          <section className="features">
            <article className="feature">
              <div className="feature-icon feature-purple">✦</div>
              <div>
                <h3>Personalized Study Plans</h3>
                <p>AI creates a plan just for you.</p>
              </div>
            </article>

            <article className="feature">
              <div className="feature-icon feature-green">▣</div>
              <div>
                <h3>All Resources in One Place</h3>
                <p>Notes, books, past papers, quizzes &amp; more.</p>
              </div>
            </article>

            <article className="feature">
              <div className="feature-icon feature-orange">◎</div>
              <div>
                <h3>Stay Consistent</h3>
                <p>Daily goals, progress tracking &amp; motivation.</p>
              </div>
            </article>

            <article className="feature">
              <div className="feature-icon feature-pink">♙</div>
              <div>
                <h3>AI Tutor 24/7</h3>
                <p>Ask anything. Get clear explanations instantly.</p>
              </div>
            </article>
          </section>

          <section className="illustration-area" aria-hidden="true">
            <img className="plane" src="assets/images/paper-plane.svg" alt="" />
            <img className="book-doodle" src="assets/images/book-doodle.svg" alt="" />

            <span className="spark spark-a">✦</span>
            <span className="spark spark-b">✧</span>
            <span className="spark spark-c">✦</span>
          </section>
        </main>

        <div className="privacy">
          <span className="privacy-icon">♡</span>
          <span>Your data is safe with us. We never share your information.</span>
        </div>
      </section>

      <section className="right-side">
        <div className="signup-card">

          <div className="login-top">
            <span>Already have an account?</span>
            <button id="loginButton" type="button">Log in</button>
          </div>

          <div className="signup-heading">
            <h2>Create your account <span>👋</span></h2>
            <p>Join thousands of students across Pakistan.</p>
          </div>

          <div className="social-row">
            <button type="button" className="social-btn" id="googleButton">
              <span className="google-g">G</span>
              Sign up with Google
            </button>
            <button type="button" className="social-btn" id="microsoftButton">
              <span className="ms-logo"><i></i><i></i><i></i><i></i></span>
              Sign up with Microsoft
            </button>
          </div>

          <div className="or-row">
            <span></span><b>or</b><span></span>
          </div>

          <form id="signupForm" noValidate>

            <div className="field">
              <label htmlFor="fullName">Full Name</label>
              <div className="input-box">
                <span className="field-icon user-icon"></span>
                <input id="fullName" name="fullName" type="text"
                  placeholder="Enter your full name" autoComplete="name" />
              </div>
              <small className="error" id="fullNameError"></small>
            </div>

            <div className="field">
              <label htmlFor="university">University</label>
              <div className="input-box">
                <span className="field-icon university-icon"></span>
                <select id="university" name="university">
                  <option value="">Enter your university</option>
                  <option>NUST</option>
                  <option>FAST National University</option>
                  <option>COMSATS University</option>
                  <option>LUMS</option>
                  <option>University of the Punjab</option>
                  <option>UET Taxilla</option>
                  <option>Quaid-i-Azam University</option>
                  <option>Other</option>
                </select>
                <span className="chevron"></span>
              </div>
              <small className="error" id="universityError"></small>
            </div>

            <div className="field">
              <label htmlFor="email">Email Address</label>
              <div className="input-box">
                <span className="field-icon mail-icon"></span>
                <input id="email" name="email" type="email"
                  placeholder="Enter your email" autoComplete="email" />
              </div>
              <small className="error" id="emailError"></small>
            </div>

            <div className="field password-field">
              <label htmlFor="password">Password</label>
              <div className="input-box">
                <span className="field-icon lock-icon"></span>
                <input id="password" name="password" type="password"
                  placeholder="Create a password" autoComplete="new-password" />
                <button className="eye" type="button" data-target="password"
                  aria-label="Show password"></button>
              </div>

              <div className="requirements">
                <span id="reqLength"><i>✓</i> At least 8 characters</span>
                <span id="reqNumber"><i>✓</i> One number</span>
                <span id="reqSpecial"><i>✓</i> One special character</span>
              </div>
              <small className="error" id="passwordError"></small>
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-box">
                <span className="field-icon lock-icon"></span>
                <input id="confirmPassword" name="confirmPassword" type="password"
                  placeholder="Confirm your password" autoComplete="new-password" />
                <button className="eye" type="button" data-target="confirmPassword"
                  aria-label="Show password"></button>
              </div>
              <small className="error" id="confirmPasswordError"></small>
            </div>

            <div className="terms-wrap">
              <label className="terms-label">
                <input id="terms" type="checkbox" />
                <span className="fake-checkbox"></span>
                <span>I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                  and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.</span>
              </label>
              <small className="error" id="termsError"></small>
            </div>

            <button className="create-btn" type="submit">Create Account</button>

            <div className="free-note">
              <span className="shield">♥</span>
              Free for students. No credit card required.
            </div>
          </form>
        </div>

        <div className="social-proof">
          <div className="people-icon">●●</div>
          <div>
            <strong>Loved by students in 100+ universities across Pakistan 🇵🇰</strong>
            <p>Start your journey to better grades today.</p>
          </div>
        </div>
      </section>

      <div className="toast" id="toast" role="status" aria-live="polite"></div>
    </>
  );
};

export default StudyCoachSignUp;