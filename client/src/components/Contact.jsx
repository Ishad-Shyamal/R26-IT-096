import  { useState } from 'react';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';

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
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">Have questions or feedback? We'd love to hear from you.</p>
      </div>

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