import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, Activity, Target, Zap, Shield, ChevronRight, Map, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from './Navbar';

const Prediction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictionData, setPredictionData] = useState(null);

  // Extract player info from location state
  const { country, playerName, matchType } = location.state || {};

  useEffect(() => {
    // Redirect if no player is selected
    if (!playerName) {
      navigate('/player');
      return;
    }

    const fetchPrediction = async () => {
      try {
        setLoading(true);
        const response = await axios.post('http://localhost:5002/api/predict', {
          country: country,
          category: matchType,
          playerName: playerName
        });

        if (response.data.status === 'success') {
          setPredictionData(response.data);
        } else {
          setError(response.data.message || 'Failed to fetch intelligence data.');
        }
      } catch (err) {
        console.error('Prediction error:', err);
        setError('Connection to AI Engine failed. Please ensure the microservice is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [country, playerName, matchType, navigate]);

  const getHeatColor = (value) => {
    if (value > 80) return 'rgba(0, 210, 255, 0.8)';
    if (value > 60) return 'rgba(0, 210, 255, 0.6)';
    if (value > 40) return 'rgba(0, 210, 255, 0.4)';
    if (value > 20) return 'rgba(0, 210, 255, 0.2)';
    return 'rgba(255, 255, 255, 0.05)';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <Navbar />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
          <Loader2 size={48} className="animate-spin" color="var(--primary)" />
          <p style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '1.2rem' }}>Initializing AI Neural Network...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <Navbar />
        <div style={{ padding: '40px', maxWidth: '600px', margin: '80px auto' }}>
          <div className="glass-panel" style={{ textAlign: 'center', border: '1px solid rgba(233, 64, 87, 0.3)' }}>
            <AlertCircle size={48} color="#e94057" style={{ marginBottom: '20px' }} />
            <h2 style={{ color: '#fff', marginBottom: '16px' }}>Intelligence Breach</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/player')}>Return to Selection</button>
          </div>
        </div>
      </div>
    );
  }

  const { metrics, heatmap, predictedScore } = predictionData;

  const displayMetrics = [
    { label: 'Power Play Impact', value: metrics.powerPlayImpact, color: 'var(--primary)' },
    { label: 'Match Winning Impact', value: metrics.matchWinningImpact, color: 'var(--success)' },
    { label: 'Death Overs Efficiency', value: metrics.deathOversEfficiency, color: 'var(--warning)' },
    { label: 'Pressure Handling', value: metrics.pressureHandling, color: 'var(--secondary)' },
    { label: 'Boundary Consistency', value: metrics.boundaryConsistency, color: '#f27121' },
  ];

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
             <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{playerName}</h2>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{country} • {matchType} Specialist</p>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {displayMetrics.map((metric, idx) => (
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
                Confidence Interval: <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{(metrics.confidenceInterval * 100).toFixed(1)}%</span>
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
            <span className="ml-tag">Model Data</span>
          </div>

          <div style={{ 
            aspectRatio: '4/3', width: '100%', background: 'rgba(0,0,0,0.2)', 
            borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' 
          }}>
            {/* Generating a visual grid from the heatmap data keys */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', height: '100%' }}>
              {Object.entries(heatmap).map(([key, val]) => (
                <div 
                  key={key} 
                  style={{ 
                    background: getHeatColor(val), 
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'transform 0.2s',
                    cursor: 'help'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  title={`${key}: ${val}`}
                >
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>{key.replace('_', ' ')}</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(0, 210, 255, 0.8)' }} /> Dominant
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'rgba(0, 210, 255, 0.2)' }} /> Weak
              </div>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>
              Projected Score: {predictedScore}
            </div>
          </div>
          
          <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(0, 210, 255, 0.05)', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
               <strong style={{ color: 'var(--primary)' }}>AI Insight:</strong> Based on historical data from {country}, {playerName} shows {metrics.powerPlayImpact > 60 ? 'strong' : 'moderate'} potential in {matchType} conditions. Prediction engine estimates a {predictedScore} run output.
             </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Prediction;
