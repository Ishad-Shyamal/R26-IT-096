import React, { useState } from 'react';
import { User, Bell, Palette, Key, Save, Shield, Database } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
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
                  <input type="text" defaultValue="Cricket" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Last Name</label>
                  <input type="text" defaultValue="Enthusiast" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} />
                </div>
                <div className="col-span-12" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                  <input type="email" defaultValue="user@insightcric.com" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={20} color="var(--primary)" /> Display & UI
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--panel-border)' }}>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Theme</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>InsightCric is optimized for Dark Mode.</p>
                  </div>
                  <select style={{ padding: '8px 16px', background: 'var(--bg-dark)', border: '1px solid var(--panel-border)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}>
                    <option>Dark Theme</option>
                    <option>Midnight Blue</option>
                    <option>Pitch Black</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--panel-border)' }}>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Accent Color</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose the primary color for buttons and charts.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#00d2ff', border: '2px solid white', cursor: 'pointer' }}></div>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ff3366', cursor: 'pointer' }}></div>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#00cc66', cursor: 'pointer' }}></div>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#ff9900', cursor: 'pointer' }}></div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Compact Dashboard</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reduce spacing to show more data on screen.</p>
                  </div>
                  <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} color="var(--primary)" /> Notifications
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Live Match Alerts</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Get notified about wickets, boundaries, and milestones.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>ML Prediction Shifts</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Alert me when the Win Predictor swings by more than 10%.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Daily News Digest</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Receive a daily summary of personalized cricket news.</p>
                  </div>
                  <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={20} color="var(--primary)" /> Data & API Integrations
              </h3>
              
              <div style={{ background: 'rgba(0, 210, 255, 0.05)', border: '1px solid rgba(0, 210, 255, 0.2)', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Key size={16} /> API Access Key
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Use this key to access InsightCric's raw ML predictions and data via our REST API.</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input type="text" readOnly value="sk_test_51Nx...v8M2k" style={{ flex: 1, padding: '12px 16px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', fontFamily: 'monospace' }} />
                  <button className="btn">Copy</button>
                  <button className="btn btn-primary">Regenerate</button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid var(--panel-border)' }}>
                <div>
                  <h4 style={{ marginBottom: '4px' }}>Data Refresh Rate</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>How often should the dashboard fetch live data?</p>
                </div>
                <select style={{ padding: '8px 16px', background: 'var(--bg-dark)', border: '1px solid var(--panel-border)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}>
                  <option>Every 5 seconds</option>
                  <option>Every 15 seconds</option>
                  <option>Every 30 seconds</option>
                  <option>Manual Refresh</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="var(--primary)" /> Security
              </h3>
              
              <div style={{ display: 'grid', gap: '20px', marginBottom: '32px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Password</label>
                  <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>New Password</label>
                    <input type="password" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Confirm New Password</label>
                    <input type="password" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} />
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                <div>
                  <h4 style={{ marginBottom: '4px' }}>Two-Factor Authentication</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add an extra layer of security to your account.</p>
                </div>
                <button className="btn">Enable 2FA</button>
              </div>
            </div>
          )}

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
