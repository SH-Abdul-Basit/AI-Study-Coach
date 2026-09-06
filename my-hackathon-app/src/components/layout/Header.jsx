import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { mockUser } from '../../data/mockData';
import { useStudy } from '../../context/StudyContext';

export default function Header() {
  const { toggleSidebar } = useStudy();
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      <div className="greeting">
        <button className="sidebar-toggle" type="button" onClick={toggleSidebar} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <div>
          <h1>Good morning, {mockUser.name} <span aria-hidden="true">👋</span></h1>
          <p>Let's make today productive and closer to your goals.</p>
        </div>
      </div>

      <div className="header-tools">
        <label className="search-box">
          <Search size={15} aria-hidden="true" />
          <input type="text" placeholder="Search anything..." aria-label="Search" />
          <kbd>Ctrl /</kbd>
        </label>

        <button className="header-icon-btn notification-btn" type="button" aria-label="Notifications">
          <Bell size={16} />
          <span className="notification-dot">3</span>
        </button>

        <button className="profile" type="button" aria-label="Open profile" onClick={() => navigate('/settings')}>
          <img src={mockUser.avatarUrl} alt="Profile" />
          <span className="profile-copy">
            <strong>{mockUser.fullName}</strong>
            <small>{mockUser.semester}</small>
          </span>
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  );
}
