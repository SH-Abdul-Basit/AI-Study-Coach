import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, FileText, Code2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const recommendedCards = [
  { icon: Play, iconClass: 'rec-purple', title: 'C++ Full Course (Urdu/Hindi)', meta: 'YouTube · 4.5h' },
  { icon: FileText, iconClass: 'rec-red', title: 'Data Structures Notes (PDF)', meta: 'PDF · 120 Pages' },
  { icon: Code2, iconClass: 'rec-green', title: 'DSA Practice Set 100 Questions', meta: 'Practice' },
];

export default function BottomBanner() {
  const navigate = useNavigate();
  const { userProfile, user } = useAuth();
  const studentName = userProfile?.displayName?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Student';

  return (
    <section className="bottom-section">
      <div className="consistency-card">
        <div className="student-illustration" aria-hidden="true">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="49" cy="88" rx="40" ry="4" fill="#DCD8F8"/>
            <rect x="35" y="49" width="39" height="25" rx="3" fill="#A8A2BD"/>
            <rect x="39" y="53" width="31" height="18" rx="2" fill="#F7F6FD"/>
            <path d="M54 74h10l5 7H48l6-7Z" fill="#AAA5B8"/>
            <circle cx="72" cy="33" r="10" fill="#F2B37B"/>
            <path d="M62 32c1-10 17-14 22-3-5-5-11-3-16 3H62Z" fill="#2E2D35"/>
            <path d="M61 48c3-6 9-8 17-4 5 3 7 11 7 19H60c0-6-1-10 1-15Z" fill="#6D52E7"/>
            <path d="M60 55c-7 2-12 9-15 18" stroke="#F2B37B" strokeWidth="6" strokeLinecap="round"/>
            <circle cx="25" cy="70" r="8" fill="#78C66A" opacity=".8"/>
            <circle cx="18" cy="77" r="6" fill="#6EBA60"/>
            <rect x="21" y="78" width="6" height="11" rx="2" fill="#B88964"/>
          </svg>
        </div>
        <div className="consistency-copy">
          <h3>Consistency today,<br /><span>Success tomorrow.</span></h3>
          <p>Keep going, {studentName}! You&apos;ve got this. 💪</p>
          <button type="button" onClick={() => navigate('/study-plan')} style={{ cursor: 'pointer' }}>Start Studying</button>
        </div>
      </div>

      <div className="recommendations">
        <div className="rec-head">
          <h2>Recommended for You</h2>
          <button type="button">View All</button>
        </div>
        <div className="rec-grid">
          {recommendedCards.map(({ icon: Icon, iconClass, title, meta }) => (
            <article className="recommend-card" key={title}>
              <span className={`recommend-icon ${iconClass}`}><Icon size={15} /></span>
              <h3>{title}</h3>
              <p>{meta}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
