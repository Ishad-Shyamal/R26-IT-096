import React, { useState } from 'react';
import { User, Bell, Palette, Shield, Upload, CheckCircle } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // Helper component for Vercel-style setting cards
  const SettingCard = ({ title, description, children, onSave, footerText }) => (
    <div style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', background: 'var(--bg-dark)', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
      <div style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px', color: 'var(--text-main)' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>{description}</p>
        <div>{children}</div>
      </div>
      {(onSave || footerText) && (
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{footerText}</span>
          {onSave && (
            <button className="btn btn-primary" onClick={onSave} style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {saved ? <><CheckCircle size={14} /> Saved</> : 'Save'}
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '48px' }}>
      
      {/* Left Sidebar Menu */}
      <div style={{ width: '240px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '32px', letterSpacing: '-0.02em' }}>Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'account', icon: <User size={16} />, label: 'Account' },
            { id: 'preferences', icon: <Palette size={16} />, label: 'Appearance' },
            { id: 'notifications', icon: <Bell size={16} />, label: 'Notifications' },
            { id: 'security', icon: <Shield size={16} />, label: 'Security' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', width: '100%', 
                padding: '10px 16px', border: 'none', borderRadius: '6px',
                background: activeTab === tab.id ? 'rgba(255,255,255,0.1)' : 'transparent', 
                color: activeTab === tab.id ? 'var(--text-main)' : 'var(--text-muted)',
                textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem',
                fontWeight: activeTab === tab.id ? '500' : '400',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if(activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-main)' }}
              onMouseLeave={(e) => { if(activeTab !== tab.id) e.currentTarget.style.color = 'var(--text-muted)' }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Content Area */}
      <div style={{ flex: 1, paddingBottom: '100px', paddingRight: '50px' }}>
        
        {activeTab === 'account' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Account Settings</h1>
            
            <SettingCard 
              title="Profile Image" 
              description="This is your avatar. It will be displayed on your dashboard and public predictions."
              footerText="An image of 256x256 is recommended."
              onSave={handleSave}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={28} color="var(--primary)" />
                </div>
                <button style={{ background: 'var(--bg-darker)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={(e)=>e.currentTarget.style.background='var(--bg-darker)'}>
                  Select File
                </button>
              </div>
            </SettingCard>

            <SettingCard 
              title="Display Name" 
              description="Please enter your full name, or a display name you are comfortable with."
              footerText="Please use 32 characters at maximum."
              onSave={handleSave}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <input type="text" defaultValue="Cricket" style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-main)', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                <input type="text" defaultValue="Enthusiast" style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-main)', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
              </div>
            </SettingCard>

            <SettingCard 
              title="Email Address" 
              description="The email address associated with your InsightCric account."
              footerText="We will email you to verify the change."
              onSave={handleSave}
            >
              <input type="email" defaultValue="user@insightcric.com" style={{ width: '100%', maxWidth: '400px', padding: '10px 16px', background: 'var(--bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-main)', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
            </SettingCard>
            
            <SettingCard 
              title="Delete Account" 
              description="Permanently remove your Personal Account and all of its contents from the InsightCric platform. This action is not reversible."
            >
              <button style={{ background: 'rgba(255, 51, 102, 0.1)', border: '1px solid rgba(255, 51, 102, 0.5)', color: '#ff3366', padding: '10px 16px', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(255, 51, 102, 0.2)'} onMouseLeave={(e)=>e.currentTarget.style.background='rgba(255, 51, 102, 0.1)'}>
                Delete Personal Account
              </button>
            </SettingCard>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Appearance</h1>
            
            <SettingCard 
              title="Theme Preference" 
              description="Choose how InsightCric looks to you. Select a specific theme or sync with your system."
              onSave={handleSave}
            >
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, border: '2px solid var(--primary)', borderRadius: '8px', padding: '16px', background: 'var(--bg-darker)', cursor: 'pointer' }}>
                  <div style={{ width: '100%', height: '80px', background: '#0a0c10', borderRadius: '4px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}></div>
                  <div style={{ fontWeight: '500', textAlign: 'center' }}>Dark Mode</div>
                </div>
                <div style={{ flex: 1, border: '2px solid transparent', borderRadius: '8px', padding: '16px', background: 'var(--bg-darker)', cursor: 'pointer', opacity: '0.5' }}>
                  <div style={{ width: '100%', height: '80px', background: '#ffffff', borderRadius: '4px', marginBottom: '12px', border: '1px solid rgba(0,0,0,0.1)' }}></div>
                  <div style={{ fontWeight: '500', textAlign: 'center' }}>Light Mode</div>
                </div>
              </div>
            </SettingCard>
            
            <SettingCard 
              title="Data Density" 
              description="Choose how much information is packed into the dashboard at once."
              onSave={handleSave}
            >
               <select style={{ padding: '10px 16px', background: 'var(--bg-darker)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-main)', borderRadius: '6px', outline: 'none', cursor: 'pointer', width: '200px' }}>
                  <option>Comfortable</option>
                  <option>Compact</option>
                </select>
            </SettingCard>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Notifications</h1>
            
            <SettingCard 
              title="Email Notifications" 
              description="Manage the emails you receive from InsightCric."
              onSave={handleSave}
            >
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: "Weekly Digest", desc: "A summary of matches and predictions for the week." },
                  { title: "Product Updates", desc: "Feature announcements and change logs." },
                  { title: "Security Alerts", desc: "Important notices about your account security.", locked: true }
                ].map((item, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: item.locked ? 'not-allowed' : 'pointer', opacity: item.locked ? 0.7 : 1 }}>
                    <input type="checkbox" defaultChecked={item.locked || i === 0} disabled={item.locked} style={{ marginTop: '4px', width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '2px' }}>{item.title}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </SettingCard>
          </div>
        )}

        {activeTab === 'security' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Security Settings</h1>
            
            <SettingCard 
              title="Change Password" 
              description="Ensure your account is using a long, random password to stay secure."
              onSave={handleSave}
              footerText="Use at least 8 characters. Don't use a password from another site."
            >
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                  <input type="password" placeholder="Current Password" style={{ width: '100%', padding: '10px 16px', background: 'var(--bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-main)', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
                  <input type="password" placeholder="New Password" style={{ width: '100%', padding: '10px 16px', background: 'var(--bg-darker)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'var(--text-main)', outline: 'none', transition: 'border-color 0.2s' }} onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} />
               </div>
            </SettingCard>
            
            <SettingCard 
              title="Two-Factor Authentication" 
              description="Add an additional layer of security to your account during login."
            >
               <button style={{ background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.3)', color: 'var(--primary)', padding: '10px 16px', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.background='rgba(0, 210, 255, 0.2)'} onMouseLeave={(e)=>e.currentTarget.style.background='rgba(0, 210, 255, 0.1)'}>
                Enable 2FA
              </button>
            </SettingCard>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;
