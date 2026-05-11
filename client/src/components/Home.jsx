import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Activity, Brain, Target, BarChart2, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)', fontFamily: 'inherit', overflowX: 'hidden' }}>
      
      <Navbar />

      {/* Hero Section */}
      <section style={{ 
        padding: '180px 40px 120px', 
        maxWidth: '1400px', margin: '0 auto',
        display: 'flex', alignItems: 'center', gap: '80px',
        position: 'relative'
      }}>
        {/* Glow Effects */}
        <div style={{ 
          position: 'absolute', top: '20%', left: '-10%', width: '600px', height: '600px', 
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.15) 0%, transparent 60%)', 
          filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none'
        }}></div>
        <div style={{ 
          position: 'absolute', bottom: '0', right: '-10%', width: '500px', height: '500px', 
          background: 'radial-gradient(circle, rgba(58, 123, 213, 0.1) 0%, transparent 60%)', 
          filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none'
        }}></div>

        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '4.8rem', fontWeight: '700', lineHeight: '1.05', marginBottom: '24px', letterSpacing: '-0.03em' 
          }}>
            Next-Generation <br />
            <span style={{ background: 'linear-gradient(90deg, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Cricket Analytics
            </span>
          </h1>
          <p style={{ 
            fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '48px', maxWidth: '560px' 
          }}>
            Empower your strategies with enterprise-grade machine learning. InsightCric delivers real-time win probabilities, deep player performance metrics, and curated intelligence.
          </p>
        </div>

        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div className="glass-panel" style={{ 
            padding: '2px', background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))',
            borderRadius: '24px', transform: 'perspective(1000px) rotateY(-8deg) rotateX(4deg)',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 210, 255, 0.1)',
            transition: 'transform 0.5s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'perspective(1000px) rotateY(-8deg) rotateX(4deg)'}
          >
            <div style={{ background: 'var(--bg-darker)', borderRadius: '22px', overflow: 'hidden' }}>
              {/* Mockup Top Bar */}
              <div style={{ height: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
              </div>
              {/* Mockup Dashboard Content */}
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ flex: 1, height: '140px', background: 'rgba(0, 210, 255, 0.05)', border: '1px solid rgba(0, 210, 255, 0.1)', borderRadius: '16px', display: 'flex', flexDirection: 'column', padding: '20px', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Target size={16} color="var(--primary)"/> Win Probability
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1 }}>78.4%</div>
                  </div>
                  <div style={{ flex: 1, height: '140px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', display: 'flex', flexDirection: 'column', padding: '20px', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Projected Score</div>
                    <div style={{ fontSize: '3rem', fontWeight: '700', color: '#fff', lineHeight: 1 }}>192<span style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}>/4</span></div>
                  </div>
                </div>
                <div style={{ height: '220px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '16px', padding: '24px' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Run Rate Analysis</div>
                  {/* Faux Chart */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '120px' }}>
                    {[40, 65, 45, 80, 55, 90, 75, 100, 85].map((h, i) => (
                      <div key={i} style={{ 
                        flex: 1, 
                        background: i === 7 ? 'linear-gradient(180deg, var(--primary) 0%, rgba(0, 210, 255, 0.2) 100%)' : 'rgba(255,255,255,0.08)', 
                        height: `${h}%`, 
                        borderRadius: '6px 6px 0 0',
                        boxShadow: i === 7 ? '0 0 20px rgba(0, 210, 255, 0.3)' : 'none'
                      }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '120px 40px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.02)', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '20px' }}>Core Capabilities</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
              Our platform processes thousands of data points per second to deliver actionable intelligence tailored for professional analysts.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { icon: <Brain size={32} />, title: "Predictive ML Engine", desc: "Advanced neural networks process historical and live data to forecast match outcomes with unprecedented accuracy." },
              { icon: <BarChart2 size={32} />, title: "Player Analytics", desc: "Granular statistical breakdowns, pitch maps, and form analysis for every professional player globally." },
              { icon: <Target size={32} />, title: "Strategic Matchups", desc: "Identify key bowler vs batsman matchups and optimal game scenarios before the coin toss even happens." }
            ].map((feature, idx) => (
              <div key={idx} style={{ 
                padding: '40px 32px', background: 'rgba(22, 27, 34, 0.6)', 
                border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px',
                transition: 'transform 0.3s, background 0.3s',
                cursor: 'default'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.background = 'rgba(30, 35, 45, 0.8)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(22, 27, 34, 0.6)' }}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(0, 210, 255, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  {feature.icon}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '16px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.05rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-darker)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
          <Activity size={24} color="var(--primary)" />
          <span style={{ fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>InsightCric</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '32px' }}>
          {/* <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About Us</Link>
          <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</Link> */}
          <a href="#privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</a>
        </div>
        <p style={{ fontSize: '0.95rem' }}>© 2026 InsightCric Analytics Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
