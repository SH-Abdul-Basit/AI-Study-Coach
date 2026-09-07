import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, CalendarDays, BookOpen,
  Brain, TrendingUp, FolderOpen, Settings,
  MessageSquare, Flame, Star, GraduationCap, Archive
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: Home, label: 'Dashboard', to: '/dashboard' },
  { icon: CalendarDays, label: 'Study Plan', to: '/study-plan' },
  { icon: BookOpen, label: 'My Courses', to: '/courses' },
  { icon: Brain, label: 'Practice', to: '/practice' },
  { icon: Archive, label: 'Past Papers', to: '/past-papers' },
  { icon: MessageSquare, label: 'AI Coach', to: '/ai-coach', badge: 'New' },
  { icon: TrendingUp, label: 'Progress', to: '/progress' },
  { icon: FolderOpen, label: 'Materials', to: '/materials' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export default function Sidebar() {
  const { sidebarOpen, closeSidebar } = useStudy();
  const { userProfile } = useAuth();

  const streak = userProfile?.currentStreak ?? 1;
  const weeklyDays = userProfile?.weeklyActivity || [
    { short: 'M', active: true },
    { short: 'T', active: false },
    { short: 'W', active: false },
    { short: 'T', active: false },
    { short: 'F', active: false },
    { short: 'S', active: false },
    { short: 'S', active: false },
  ];

  return (
    <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-icon" aria-hidden="true"><GraduationCap size={17} /></div>
        <span>Study Coach</span>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ icon: Icon, label, to, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
            onClick={closeSidebar}
          >
            <span className="sidebar-item-left">
              <Icon size={16} strokeWidth={1.8} />
              <span>{label}</span>
            </span>
            {badge && <span className="new-badge">{badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <section className="streak-card">
          <div className="streak-title">
            <Flame size={17} fill="currentColor" />
            <strong>{streak}</strong>
            <span>Day Streak</span>
          </div>
          <p>{streak > 1 ? `${streak} days strong! Keep going! 🔥` : "Study today to keep your streak! 🔥"}</p>
          <div className="days">
            {weeklyDays.map((d, i) => (
              <span
                key={`${d.short || d.day || 'd'}-${i}`}
                className={d.active ? 'done' : ''}
                style={d.isToday ? { outline: '2px solid #6347F5', outlineOffset: '1px' } : {}}
              >
                {d.short || (d.day ? d.day[0] : '•')}
              </span>
            ))}
          </div>
        </section>

        <section className="premium-card">
          <div className="premium-title"><Star size={15} fill="currentColor" /> Unlock Premium</div>
          <p>Get unlimited AI chats, past papers &amp; smart insights.</p>
          <button type="button">Upgrade Now</button>
        </section>
      </div>
    </aside>
  );
}
