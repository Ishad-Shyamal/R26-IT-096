import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Newspaper,
  Activity,
  Brain,
  Target,
  Settings,
  LogOut,
  Info,
  Mail,
  LogIn,
  UserPlus
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, [location]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setShowLogoutConfirm(false);
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'News Curator', path: '/news', icon: <Newspaper size={20} /> },
    { name: 'Player Analysis', path: '/player', icon: <Activity size={20} /> },
    { name: 'Match Previews', path: '/matchpreviewreview', icon: <Brain size={20} /> },
    { name: 'Win Predictor', path: '/predictor', icon: <Target size={20} /> },
    { name: 'About Us', path: '/about', icon: <Info size={20} /> },
    { name: 'Contact Us', path: '/contact', icon: <Mail size={20} /> },
  ];

  return (
    <div className="sidebar">
      {/* Navigation Links */}
      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`nav-item ${
              currentPath === item.path ? 'active' : ''
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Account Settings & Auth Actions */}
      <div className="nav-menu">
        <Link
          to="/settings"
          className={`nav-item ${
            currentPath === '/settings' ? 'active' : ''
          }`}
        >
          <Settings size={20} />
          Settings
        </Link>

        {!isLoggedIn && (
          <>
            <Link
              to="/login"
              className={`nav-item ${
                currentPath === '/login' ? 'active' : ''
              }`}
            >
              <LogIn size={20} />
              Login
            </Link>

            <Link
              to="/signup"
              className={`nav-item ${
                currentPath === '/signup' ? 'active' : ''
              }`}
            >
              <UserPlus size={20} />
              Sign Up
            </Link>
          </>
        )}

        {isLoggedIn && (
          <button
            onClick={handleLogoutClick}
            className="nav-item"
            style={{
              color: 'var(--danger)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
              fontFamily: 'inherit',
              fontSize: 'inherit'
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 8, 15, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(20, 26, 38, 0.95), rgba(13, 17, 23, 0.98))',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              padding: '32px 28px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 210, 255, 0.05)',
            }}
          >
            {/* Visual Accent Badge */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 59, 48, 0.12)',
                border: '1px solid rgba(255, 59, 48, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: '#ff4d4d',
              }}
            >
              <LogOut size={26} />
            </div>

            <h3
              style={{
                color: '#ffffff',
                marginBottom: '8px',
                fontSize: '1.35rem',
                fontWeight: '600',
                letterSpacing: '-0.02em',
              }}
            >
              Log Out of InsightCric?
            </h3>

            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.92rem',
                lineHeight: '1.5',
                marginBottom: '28px',
              }}
            >
              Are you sure you want to log out? You will need to sign in again to access your personalized dashboard.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={cancelLogout}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontWeight: '500',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #e11d48, #be123c)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(225, 29, 72, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(225, 29, 72, 0.35)';
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;