import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, LogOut, Settings } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { toggleSidebar } = useStudy();
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const displayName = userProfile?.fullName || userProfile?.name || user?.displayName || "Student";
  const firstName = displayName.split(" ")[0] || "Student";
  const avatarUrl =
    userProfile?.avatarUrl ||
    user?.photoURL ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}&backgroundColor=6347f5`;
  const semester = userProfile?.semester || (userProfile?.onboardingCompleted ? "Active Student" : "New Student");

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="dashboard-header">
      <div className="greeting">
        <button className="sidebar-toggle" type="button" onClick={toggleSidebar} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <div>
          <h1>Good morning, {firstName} <span aria-hidden="true">👋</span></h1>
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

        <div style={{ position: 'relative' }}>
          <button
            className="profile"
            type="button"
            aria-label="Open profile menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img src={avatarUrl} alt="Profile" />
            <span className="profile-copy">
              <strong>{displayName}</strong>
              <small>{semester}</small>
            </span>
            <ChevronDown size={15} />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '180px',
                background: '#fff',
                border: '1px solid #ECECF2',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                zIndex: 100,
                padding: '6px',
              }}
            >
              <button
                type="button"
                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#202033',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#F0ECFF')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
              >
                <Settings size={14} color="#6347F5" /> Settings
              </button>

              <div style={{ height: '1px', background: '#ECECF2', margin: '4px 0' }} />

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#EF4444',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#FEE2E2')}
                onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
              >
                <LogOut size={14} color="#EF4444" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
