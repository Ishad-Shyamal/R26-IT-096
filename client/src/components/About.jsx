import 'react';
import { Users, Target, Zap, Shield } from 'lucide-react';

const About = () => {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="page-title">About InsightCric</h1>
        <p className="page-subtitle">Revolutionizing cricket analytics through advanced machine learning and data science.</p>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel col-span-12" style={{ marginBottom: '24px' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '16px' }}>Our Vision</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
            InsightCric was born out of a passion for cricket and a deep understanding of data science. We aim to bridge the gap between raw statistics and actionable intelligence, empowering fans, analysts, and teams with cutting-edge tools to understand the game better. Our platform leverages state-of-the-art ML models to provide predictive insights, comprehensive player analysis, and real-time match dynamics.
          </p>
        </div>

        <div className="glass-panel col-span-6">
          <div className="stat-header" style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-main)' }}>Our Mission</h3>
            <Target size={20} color="var(--primary)" />
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            To deliver the most accurate, real-time cricket analytics platform in the world, combining the art of the game with the science of numbers.
          </p>
        </div>

        <div className="glass-panel col-span-6">
          <div className="stat-header" style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-main)' }}>Core Values</h3>
            <Shield size={20} color="var(--primary)" />
          </div>
          <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Data-Driven Objectivity</li>
            <li>Continuous Innovation</li>
            <li>Fan-Centric Experience</li>
            <li>Integrity in Analytics</li>
          </ul>
        </div>
        
        <div className="glass-panel col-span-12" style={{ marginTop: '24px' }}>
          <h3 style={{ color: 'var(--text-main)', marginBottom: '24px' }}>What Powers Us</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
             <div className="news-item" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Zap size={32} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <h4 style={{ marginBottom: '8px' }}>Real-Time Processing</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>MERN stack architecture optimized for low-latency live data feeds.</p>
             </div>
             <div className="news-item" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Users size={32} color="var(--secondary)" style={{ marginBottom: '16px' }} />
                <h4 style={{ marginBottom: '8px' }}>Personalization</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tailored news and insights based on your favorite teams and players.</p>
             </div>
             <div className="news-item" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Target size={32} color="var(--danger)" style={{ marginBottom: '16px' }} />
                <h4 style={{ marginBottom: '8px' }}>Predictive Modeling</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Advanced neural networks to project match outcomes with high accuracy.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;