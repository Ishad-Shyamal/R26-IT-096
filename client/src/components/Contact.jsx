import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Send, Activity, Phone } from 'lucide-react';
import Navbar from './Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-darker)', color: 'var(--text-main)', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0, 210, 255, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(58, 123, 213, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* Navigation */}
      <Navbar />
      {/* <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, 
        padding: '20px 40px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        background: 'rgba(10, 12, 16, 0.8)', backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        zIndex: 1000 
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'inherit' }}>
          <Activity size={28} color="var(--primary)" />
          <span style={{ fontSize: '1.4rem', fontWeight: '700', letterSpacing: '-0.02em' }}>InsightCric</span>
        </Link>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>Log In</Link>
        </div>
      </nav> */}

      <div className="dashboard-grid">
        <div className="glass-panel col-span-5">
          <h3 style={{ color: 'var(--text-main)', marginBottom: '24px' }}>Get in Touch</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="brand-icon" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Email</div>
                <div style={{ color: 'var(--text-muted)' }}>support@insightcric.com</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="brand-icon" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                <MessageSquare size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Social Media</div>
                <div style={{ color: 'var(--text-muted)' }}>@InsightCric on X/Twitter</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="brand-icon" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>Office</div>
                <div style={{ color: 'var(--text-muted)' }}>Innovation Hub, Tech Park, City</div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel col-span-7">
          <h3 style={{ color: 'var(--text-main)', marginBottom: '24px' }}>Send a Message</h3>
          
          {submitted ? (
            <div style={{ padding: '24px', background: 'rgba(46, 160, 67, 0.1)', borderRadius: '12px', border: '1px solid var(--success)', color: 'var(--success)', textAlign: 'center' }}>
              <h4 style={{ marginBottom: '8px' }}>Message Sent Successfully!</h4>
              <p style={{ fontSize: '0.9rem' }}>Thank you for reaching out. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit' }} 
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit' }} 
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows="5" 
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--panel-border)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 24px' }}>
                <Send size={16} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
