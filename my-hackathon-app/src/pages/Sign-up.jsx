import React, { useState } from 'react';
import '../styles/sign-up.css';
import { useNavigate } from 'react-router-dom';
export default function StudyCoachSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    university: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
const handleSubmit = (e) => {
  e.preventDefault();
  // ...your validation logic here...
  // if everything is valid:
  navigate('/questainaire');
};
  return (
    /* 1. The wrapper goes exactly here, wrapping your main container */
    <div className="signup-page-wrapper"> 
      <div className="signup-container">
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
              <svg className="plane" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M58 6L6 28L26 38L58 6Z" fill="#818CF8" />
                <path d="M58 6L26 38V54L36 43L58 6Z" fill="#6366F1" />
                <path d="M26 38L58 6L40 48L26 38Z" fill="#4F46E5" />
              </svg>

              <svg className="book-doodle" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C12 16 20 12 32 16C44 12 52 16 52 16V48C52 48 44 44 32 48C20 44 12 48 12 48V16Z" fill="#EEF2FF" stroke="#6366F1" strokeWidth="3" strokeLinejoin="round" />
                <path d="M32 16V48" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
                <path d="M18 24C23 22 27 23 27 23" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
                <path d="M18 30C23 28 27 29 27 29" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
                <path d="M37 23C37 23 41 22 46 24" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
                <path d="M37 29C37 29 41 28 46 30" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
              </svg>

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
              <button id="loginButton" type="button" onClick={() => navigate('/login')}>
  Log in
</button>
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

            <form id="signupForm" noValidate onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="fullName">Full Name</label>
                <div className="input-box">
                  <span className="field-icon user-icon"></span>
                  <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" autoComplete="name" />
                </div>
                <small className="error" id="fullNameError"></small>
              </div>

              <div className="field">
                <label htmlFor="university">University</label>
                <div className="input-box">
                  <span className="field-icon university-icon"></span>
                  <select id="university" name="university" value={formData.university} onChange={handleChange}>
                    <option value="">Enter your university</option>
                    <option value="NUST">NUST</option>
                    <option value="FAST National University">FAST National University</option>
                    <option value="COMSATS University">COMSATS University</option>
                    <option value="LUMS">LUMS</option>
                    <option value="University of the Punjab">University of the Punjab</option>
                    <option value="UET Taxila">UET Taxila</option>
                    <option value="Quaid-i-Azam University">Quaid-i-Azam University</option>
                    <option value="Other">Other</option>
                  </select>
                  <span className="chevron"></span>
                </div>
                <small className="error" id="universityError"></small>
              </div>

              <div className="field">
                <label htmlFor="email">Email Address</label>
                <div className="input-box">
                  <span className="field-icon mail-icon"></span>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" autoComplete="email" />
                </div>
                <small className="error" id="emailError"></small>
              </div>

              <div className="field password-field">
                <label htmlFor="password">Password</label>
                <div className="input-box">
                  <span className="field-icon lock-icon"></span>
                  <input id="password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Create a password" autoComplete="new-password" />
                  <button className="eye" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}></button>
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
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" autoComplete="new-password" />
                  <button className="eye" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}></button>
                </div>
                <small className="error" id="confirmPasswordError"></small>
              </div>

              <div className="terms-wrap">
                <label className="terms-label">
                  <input id="terms" name="terms" type="checkbox" checked={formData.terms} onChange={handleChange} />
                  <span className="fake-checkbox"></span>
                  <span>I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.</span>
                </label>
                <small className="error" id="termsError"></small>
              </div>

             <button id="submitBtn" className="create-btn" type="submit">
  Create Account
</button>

              <div className="free-note">
                <span className="shield">♥</span> Free for students. No credit card required.
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
      </div>
    </div>
  );
}