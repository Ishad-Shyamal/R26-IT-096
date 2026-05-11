import React from 'react';
import { TrendingUp, Activity, Target, Zap, Shield, ChevronRight, BarChart3, Map } from 'lucide-react';
import Navbar from './Navbar';

const Prediction = () => {
  // Mock data for a selected player (e.g., Virat Kohli)
  const player = {
    name: 'Virat Kohli',
    country: 'India',
    metrics: [
      { label: 'Power Play Impact', value: 65, color: 'var(--primary)' },
      { label: 'Match Winning Impact', value: 80, color: 'var(--success)' },
      { label: 'Death Overs Efficiency', value: 70, color: 'var(--warning)' },
      { label: 'Pressure Handling', value: 78, color: 'var(--secondary)' },
      { label: 'Boundary Consistency', value: 81, color: '#f27121' },
    ]
  };

  // Mock Heatmap data (Strike rate in different zones)
  const heatmapData = [
    [120, 150, 180, 140, 110],
    [160, 210, 240, 190, 130],
    [140, 190, 220, 170, 120],
    [110, 130, 150, 120, 100],
  ];

  const getHeatColor = (value) => {
    if (value > 200) return 'rgba(0, 210, 255, 0.8)';
    if (value > 170) return 'rgba(0, 210, 255, 0.6)';
    if (value > 140) return 'rgba(0, 210, 255, 0.4)';
    if (value > 110) return 'rgba(0, 210, 255, 0.2)';
    return 'rgba(255, 255, 255, 0.05)';
  };

  return (
    <div style={{ maxWidth: '100%', paddingBottom: '60px' }}>
      <Navbar />
      
      {/* Page Header */}
      <div style={{ marginTop: '40px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div className="brand-icon" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #f27121, #e94057)' }}>
            <TrendingUp size={18} />
          </div>
          <h1 className="page-title" style={{ margin: 0 }}>Predictive Intelligence</h1>
        </div>
        <p className="page-subtitle">Advanced ML-driven outcome forecasting and player performance projections.</p>
      </div>

      <div className="dashboard-grid">
        {/* Card 1: Player Performance Prediction Details */}
        <div className="glass-panel col-span-6" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
             <div style={{ 
               display: 'inline-flex', padding: '8px 16px', background: 'rgba(0, 210, 255, 0.1)', 
               borderRadius: '20px', border: '1px solid rgba(0, 210, 255, 0.2)', marginBottom: '16px' 
             }}>
               <span className="ml-tag" style={{ margin: 0 }}>
                 <Zap size={14} /> Performance Analysis
               </span>
             </div>
             <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{player.name}</h2>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{player.country} • Top Order Batter</p>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {player.metrics.map((metric, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>{metric.label}</span>
                  <span style={{ fontWeight: '700', color: metric.color }}>{metric.value}%</span>
                </div>
                <div className="progress-container" style={{ height: '10px', background: 'rgba(255,255,255,0.05)' }}>
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${metric.value}%`, 
                      background: metric.color,
                      boxShadow: `0 0 10px ${metric.color}44`
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '40px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--panel-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Shield size={20} color="var(--success)" />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
                Confidence Interval: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>94.2%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Heatmap Card */}
        <div className="glass-panel col-span-6">
          <div className="stat-header" style={{ marginBottom: '32px' }}>
            <h3 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Map size={20} color="var(--primary)" /> Strike Zone Heatmap
            </h3>
            <span className="ml-tag">Live Data</span>
          </div>

          <div style={{ 
            aspectRatio: '4/3', width: '100%', background: 'rgba(0,0,0,0.2)', 
            borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' 
          }}>
            {heatmapData.map((row, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', gap: '8px' }}>
                {row.map((val, j) => (
                  <div 
                    key={j} 
                    style={{ 
                      flex: 1, 
                      background: getHeatColor(val), 
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      color: val > 150 ? '#fff' : 'rgba(255,255,255,0.3)',
                      fontWeight: '700',
                      transition: 'transform 0.2s',
                      cursor: 'help'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    title={`Strike Rate: ${val}`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(0, 210, 255, 0.8)' }} /> High
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(0, 210, 255, 0.2)' }} /> Low
              </div>
            </div>
            <button className="btn" style={{ fontSize: '0.85rem' }}>
              Detailed Zones <ChevronRight size={16} />
            </button>
          </div>
          
          <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(0, 210, 255, 0.05)', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
               <strong style={{ color: 'var(--primary)' }}>Analysis:</strong> Player shows extreme dominance in the mid-wicket and long-on regions (Strike Rate 220+). Recommend pace-off deliveries outside off-stump.
             </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Prediction;
