import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Home, Newspaper, Activity, Brain, Target, Settings, LogOut, Info, Mail, LogIn, UserPlus } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'News Curator', path: '#news', icon: <Newspaper size={20} /> },
    { name: 'Player Analysis', path: '/player', icon: <Activity size={20} /> },
    { name: 'Match Previews', path: '#previews', icon: <Brain size={20} /> },
    { name: 'Win Predictor', path: '#win', icon: <Target size={20} /> },
    // { name: 'About Us', path: '/about', icon: <Info size={20} /> },
    // { name: 'Contact Us', path: '/contact', icon: <Mail size={20} /> },
  ];

  return (
    <div className="sidebar">
      <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="brand-icon">
          <Activity size={24} />
        </div>
        <div className="brand-name">InsightCric</div>
      </Link>

      <nav className="nav-menu" style={{ flex: 1 }}>
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="nav-menu">
        <Link to="/settings" className={`nav-item ${currentPath === '/settings' ? 'active' : ''}`}>
          <Settings size={20} />
          Settings
        </Link>
        <Link to="/login" className="nav-item" style={{ color: 'var(--danger)' }}>
          <LogOut size={20} />
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
