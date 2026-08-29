import { useState, useRef } from 'react';
import { User, Bell, Key, Save, Shield, Upload, Trash2, Eye, EyeOff } from 'lucide-react';
const AVATAR_OPTIONS = ['🏏', '🧢', '🏆', '⚡', '🎯', '👑', '🔥', '🛡️'];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  // Load user details & avatar from localStorage
  const [userData, setUserData] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('userData') || '{}');
    return {
      firstName: savedData.firstName || 'Cricket',
      lastName: savedData.lastName || 'Enthusiast',
      email: savedData.email || 'user@insightcric.com',
      avatar: savedData.avatar || null // Stores Base64 string or Emoji string
    };
  });

  // Handle local image file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectEmojiAvatar = (emoji) => {
    setUserData(prev => ({ ...prev, avatar: emoji }));
  };

  const handleRemoveAvatar = () => {
    setUserData(prev => ({ ...prev, avatar: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const [currentPassword, setCurrentPassword] = useState(() => {
    const savedData = JSON.parse(localStorage.getItem('userData') || '{}');
    return savedData.password || '';
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsDontMatch = newPassword && confirmPassword && newPassword !== confirmPassword;

  const handleSave = () => {
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        return;
      }
    }

    const storedUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedUser = {
      ...storedUser,
      ...userData,
      password: newPassword ? newPassword : currentPassword,
    };
    localStorage.setItem('userData', JSON.stringify(updatedUser));

    if (newPassword) {
      setCurrentPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const renderAvatarPreview = () => {
    if (!userData.avatar) {
      return <User size={40} color="var(--text-muted)" />;
    }
    // Check if avatar string is an image URL/DataURI or a simple emoji/character
    if (userData.avatar.startsWith('data:image')) {
      return (
        <img 
          src={userData.avatar} 
          alt="Avatar Preview" 
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
        />
      );
    }
    return <span style={{ fontSize: '2.5rem' }}>{userData.avatar}</span>;
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
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
              style={{ width: '100%', border: 'none', background: activeTab === 'notifications' ? 'linear-gradient(90deg, rgba(0, 210, 255, 0.1), transparent)' : 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
            >
              <Bell size={18} /> Notifications
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
              
              <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'center' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', overflow: 'hidden', border: '2px solid var(--primary)' }}>
                  {renderAvatarPreview()}
                </div>

                <div>
                  <h4 style={{ marginBottom: '6px' }}>Profile Picture</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
                    Upload an image file (Max 2MB) or select an avatar below.
                  </p>
                  
                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="btn" onClick={() => fileInputRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={16} /> Upload Image
                    </button>
                    {userData.avatar && (
                      <button className="btn" onClick={handleRemoveAvatar} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff4d4d', borderColor: 'rgba(255, 77, 77, 0.3)' }}>
                        <Trash2 size={16} /> Remove
                      </button>
                    )}
                  </div>

                  {/* Preset Avatar Selectors */}
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>Or choose an avatar icon:</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {AVATAR_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleSelectEmojiAvatar(emoji)}
                          style={{
                            background: userData.avatar === emoji ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                            border: userData.avatar === emoji ? '1px solid var(--primary)' : '1px solid var(--panel-border)',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>First Name</label>
                  <input 
                    type="text" 
                    value={userData.firstName} 
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Last Name</label>
                  <input 
                    type="text" 
                    value={userData.lastName} 
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} 
                  />
                </div>
                <div className="col-span-12" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    value={userData.email} 
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }} 
                  />
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
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Get notified about upcoming matches.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>User Encouragement</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Alert me when I didn,t use the application for more than 7 days</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ marginBottom: '4px' }}>Update alerts</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Get notified about new updates</p>
                  </div>
                  <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                </div>
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
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      readOnly
                      value={currentPassword}
                      style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(v => !v)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(v => !v)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ width: '100%', padding: '12px 44px 12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(v => !v)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordsDontMatch && (
                      <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '6px' }}>
                        New password and confirmation don't match.
                      </p>
                    )}
                  </div>
                </div>
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