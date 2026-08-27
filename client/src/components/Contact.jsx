import React, { useState } from 'react';
import { Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import Navbar from './Navbar';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        'service_cx58ylg',
        'template_p1qmjsu',
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        'R_pLkCN2siWwtMh0e'
      )
      .then(() => {
        setSubmitted(true);
        setError(false);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 3000);
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        setError(true);
      });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-darker)', color: 'var(--text-main)', paddingBottom: '80px', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0, 210, 255, 0.12) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(58, 123, 213, 0.08) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <Navbar />

      {/* Main Container */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', paddingTop: '130px', paddingLeft: '24px', paddingRight: '24px', position: 'relative', zIndex: 1 }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 className="page-title" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '12px' }}>Contact Our Team</h1>
          <p className="page-subtitle" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Have questions about InsightCric analytics, subscriptions, or platform features? We'd love to hear from you.
          </p>
        </div>

        {/* Content Grid */}
        <div className="dashboard-grid">
          
          {/* Contact Details Card */}
          <div className="glass-panel col-span-5" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '28px', fontWeight: '600' }}>Get in Touch</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '4px' }}>Email Us</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>support@insightcric.com</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)' }}>
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '4px' }}>Social Media</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>@InsightCric</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary)' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '1rem', marginBottom: '4px' }}>Location</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Malabe, Colombo, Sri Lanka</div>
                  </div>
                </div>

              </div>
            </div>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Response time: Typically within 24 hours.
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-panel col-span-7" style={{ padding: '32px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', marginBottom: '28px', fontWeight: '600' }}>Send a Message</h3>
            
            {submitted ? (
              <div style={{ padding: '32px', background: 'rgba(46, 160, 67, 0.12)', borderRadius: '12px', border: '1px solid var(--success)', color: 'var(--success)', textAlign: 'center' }}>
                <h4 style={{ marginBottom: '8px', fontSize: '1.2rem', fontWeight: '600' }}>Message Sent Successfully!</h4>
                <p style={{ fontSize: '0.95rem', opacity: 0.9 }}>Thank you for reaching out. We will get back to you shortly.</p>
              </div>
            ) : (
              <>
              {error && (
                <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(248, 81, 73, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px', color: 'var(--danger)', fontSize: '0.9rem' }}>
                  Something went wrong sending your message. Please try again or email us directly.
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem' }} 
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem' }} 
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows="5" 
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-main)', outline: 'none', fontFamily: 'inherit', resize: 'vertical', fontSize: '0.95rem' }}
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                  <Send size={16} /> Send Message
                </button>
              </form>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;