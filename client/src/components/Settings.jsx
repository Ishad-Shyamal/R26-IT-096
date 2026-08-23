import React, { useState, useEffect } from 'react';
import { User, Bell, Palette, Key, Save, Shield, Database } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);

  // Dynamic user profile states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  // Load saved user profile on load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
    }
  }, []);

  const handleSave = () => {
    // Save updated values back to localStorage
    const updatedUser = { firstName, lastName, email };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and application settings.</p>
      </div>

      <div className="dashboard-grid">
        {/* Settings Navigation */}
        <div className="glass-panel col-span-3" style={{ padding: '20px' }}>
          <div className="nav-menu">
            <button 
              className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
              style={{ width: '100%', border: 'none', background: activeTab === 'account' ? 'linear-gradient(90deg, rgba(0, 210, 255, 0.1), transparent)' : 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
            >
              <User size={18} /> Account Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
              style={{ width: '100%', border: 'none', background: activeTab === 'preferences' ? 'linear-gradient(90deg, rgba(0, 210, 255, 0.1), transparent)' : 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
            >
              <Palette size={18} /> Display & UI
            </button>
            <button 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
              style={{ width: '100%', border: 'none', background: activeTab === 'notifications' ? 'linear-gradient(90deg, rgba(0, 210, 255, 0.1), transparent)' : 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
            >
              <Bell size={18} /> Notifications
            </button>
            <button 
              className={`nav-item ${activeTab === 'api' ? 'active' : ''}`}
              onClick={() => setActiveTab('api')}
              style={{ width: '100%', border: 'none', background: activeTab === 'api' ? 'linear-gradient(90deg, rgba(0, 210, 255, 0.1), transparent)' : 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
            >
              <Database size={18} /> Data & API
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
              style={{ width: '100%', border: 'none', background: activeTab === 'security' ? 'linear-gradient(90deg, rgba(0, 210, 255, 0.1), transparent)' : 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
            >
              <Shield size={18} /> Security
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="glass-panel col-span-9" style={{ minHeight: '600px' }}>
          
          {activeTab === 'account' && (
            <div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} color="var(--primary)" /> Account Profile
              </h3>
              
              <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative' }}>
                  <User size={40} color="var(--text-muted)" />
                  <button style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                </div>
                <div>
                  <h4 style={{ marginBottom: '8px' }}>Profile Picture</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>Upload a new avatar. Larger images will be resized.</p>
                  <button className="btn">Upload Image</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>First Name</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Last Name</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} 
                  />
                </div>
                <div className="col-span-12" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* ... other tabs remaining same ... */}

          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
            {saved && <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>Settings saved successfully!</span>}
            <button className="btn">Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} /> Save Changes
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Settings;