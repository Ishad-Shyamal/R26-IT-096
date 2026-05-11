import React, { useState } from 'react';
import Navbar from './Navbar';
import { Mail, MapPin, Send, Phone } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-darker)', color: 'var(--text-main)', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
      
      <Navbar />

      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0, 210, 255, 0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(58, 123, 213, 0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '160px', paddingLeft: '40px', paddingRight: '40px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          
          {/* Left Column: Info */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.2)', padding: '6px 16px', borderRadius: '20px', marginBottom: '24px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Support 24/7
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '700', lineHeight: '1.05', marginBottom: '24px', letterSpacing: '-0.02em' }}>
              Let's talk about <br/>
              <span style={{ background: 'linear-gradient(90deg, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your data.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '48px', maxWidth: '480px' }}>
              Whether you need enterprise API access, custom ML modeling, or just have a question about our platform, our team is ready to help.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={20} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '4px', fontWeight: '600' }}>Email Us</h4>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.95rem' }}>Our friendly team is here to help.</p>
                  <a href="#" style={{ color: 'var(--text-main)', fontWeight: '500', textDecoration: 'none' }}>hello@insightcric.com</a>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '4px', fontWeight: '600' }}>Visit Us</h4>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.95rem' }}>Come say hello at our HQ.</p>
                  <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>100 Innovation Drive, Tech Park</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Phone size={20} color="var(--primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '4px', fontWeight: '600' }}>Call Us</h4>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.95rem' }}>Mon-Fri from 8am to 5pm.</p>
                  <a href="#" style={{ color: 'var(--text-main)', fontWeight: '500', textDecoration: 'none' }}>+1 (555) 000-0000</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div style={{ background: 'rgba(22, 27, 34, 0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '32px' }}>Send a message</h3>
            
            {submitted ? (
              <div style={{ padding: '32px 24px', background: 'rgba(46, 160, 67, 0.1)', borderRadius: '12px', border: '1px solid rgba(46, 160, 67, 0.3)', color: 'var(--success)', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(46, 160, 67, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Send size={24} color="var(--success)" />
                </div>
                <h4 style={{ marginBottom: '8px', fontSize: '1.2rem' }}>Message Sent Successfully!</h4>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>Thank you for reaching out. Our team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>First Name</label>
                    <input 
                      type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} 
                      placeholder="Jane"
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Last Name</label>
                    <input 
                      type="text" required 
                      style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} 
                      placeholder="Doe"
                      onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                  <input 
                    type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none', transition: 'border-color 0.2s', fontSize: '0.95rem' }} 
                    placeholder="jane@company.com"
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Message</label>
                  <textarea 
                    required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows="4" 
                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'var(--text-main)', outline: 'none', resize: 'vertical', transition: 'border-color 0.2s', fontSize: '0.95rem' }}
                    placeholder="Tell us what you need help with..."
                    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.05rem', borderRadius: '12px', marginTop: '8px' }}>
                  Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
