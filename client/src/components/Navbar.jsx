import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Command Center', path: '/dashboard' },
    { name: 'Contact', path: '/contact' },
    { name: 'About Us', path: '/about' },
  ];

  return (
    <nav style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, 
      padding: '16px 60px', 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      background: 'rgba(10, 12, 16, 0.8)', backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      zIndex: 1000 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '60px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <Activity size={32} color="var(--primary)" />
          <span style={{ fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.03em', color: '#fff' }}>InsightCric</span>
        </Link>
        
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              style={{ 
                color: location.pathname === link.path ? 'var(--primary)' : 'var(--text-muted)', 
                textDecoration: 'none', 
                fontSize: '1rem', 
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-main)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = location.pathname === link.path ? 'var(--primary)' : 'var(--text-muted)';
              }}
            >
              {link.name}
              {location.pathname === link.path && (
                <div style={{ 
                  position: 'absolute', bottom: '-26px', left: '0', right: '0', 
                  height: '3px', background: 'var(--primary)', borderRadius: '2px',
                  boxShadow: '0 0 12px var(--primary-glow)'
                }}></div>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link 
          to="/login" 
          style={{ 
            color: '#fff', 
            textDecoration: 'none', 
            fontSize: '0.95rem', 
            fontWeight: '600',
            padding: '10px 24px',
            borderRadius: '12px',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            background: 'rgba(0, 210, 255, 0.05)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(0, 210, 255, 0.15)';
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 210, 255, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 210, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
          }}
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
