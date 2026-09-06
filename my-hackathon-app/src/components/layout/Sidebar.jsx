import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home, CalendarDays, BookOpen, FileText,
  Brain, TrendingUp, FolderOpen, Settings,
  MessageSquare, Flame, Star, GraduationCap, Menu, Archive
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

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
          <div className="streak-title"><Flame size={17} fill="currentColor" /> <strong>7</strong> <span>Day Streak</span></div>
          <p>Keep it up! 🔥</p>
          <div className="days">
            {['M','T','W','T','F','S','S'].map((day, i) => (
              <span key={`${day}-${i}`} className={i < 5 ? 'done' : ''}>{day}</span>
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
