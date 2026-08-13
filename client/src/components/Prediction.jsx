import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, Activity, Target, Zap, Shield, Map, AlertCircle, Loader2, Award, ChevronLeft } from 'lucide-react';
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

        if (response.data && response.data.status === 'success') {
          setPredictionData(response.data);
        } else {
          setError(response.data?.message || 'Failed to fetch intelligence data.');
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

  if (error || !predictionData) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <Navbar />
        <div style={{ padding: '40px', maxWidth: '600px', margin: '80px auto' }}>
          <div className="glass-panel" style={{ textAlign: 'center', border: '1px solid rgba(233, 64, 87, 0.3)', padding: '32px', borderRadius: '16px' }}>
            <AlertCircle size={48} color="#e94057" style={{ marginBottom: '20px' }} />
            <h2 style={{ color: '#fff', marginBottom: '16px' }}>Intelligence Breach</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>{error || 'No data returned from AI engine.'}</p>
            <button className="btn btn-primary" onClick={() => navigate('/player')}>Return to Selection</button>
          </div>
        </div>
      </div>
    );
  }

  const { metrics = {}, heatmap = {}, predictedScore = 0, formIndex = 0 } = predictionData;

  const displayMetrics = [
    { label: 'Power Play Impact', value: metrics.powerPlayImpact ?? 0, color: '#00d2ff' },
    { label: 'Match Winning Impact', value: metrics.matchWinningImpact ?? 0, color: '#00e676' },
    { label: 'Death Overs Efficiency', value: metrics.deathOversEfficiency ?? 0, color: '#ffb300' },
    { label: 'Pressure Handling', value: metrics.pressureHandling ?? 0, color: '#e94057' },
    { label: 'Boundary Consistency', value: metrics.boundaryConsistency ?? 0, color: '#f27121' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 20px 60px 20px' }}>
      <Navbar />

      {/* Navigation & Header */}
      <div style={{ marginTop: '20px', marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/player')} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}
        >
          <ChevronLeft size={18} /> Back to Player Selection
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', margin: 0 }}>{playerName}</h1>
            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>{country} • {matchType} Performance Insights</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 210, 255, 0.1)', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(0, 210, 255, 0.2)' }}>
            <Zap size={16} color="var(--primary)" />
            <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>AI Model Active</span>
          </div>
        </div>
      </div>

      {/* Top Level Quick Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Card 1: Projected Score */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>PROJECTED SCORE</span>
            <Target size={20} color="#00d2ff" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff' }}>
            {predictedScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '400' }}>Runs</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>Estimated runs for upcoming match</p>
        </div>

        {/* Card 2: Form Index */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>CURRENT FORM INDEX</span>
            <Activity size={20} color="#00e676" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff' }}>
            {formIndex} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ 100</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>Based on recent match ratings</p>
        </div>

        {/* Card 3: Confidence Level */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>MODEL CONFIDENCE</span>
            <Shield size={20} color="#f27121" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff' }}>
            {metrics?.confidenceInterval ? (metrics.confidenceInterval * 100).toFixed(0) : '85'}%
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>Data reliability score</p>
        </div>
      </div>

      {/* Main Grid: Breakdown & Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '24px' }}>
        
        {/* Performance Breakdown Section */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={20} color="var(--primary)" /> Performance Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {displayMetrics.map((metric, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>{metric.label}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700', color: metric.color }}>{metric.value}%</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${metric.value}%`, 
                      height: '100%', 
                      background: metric.color,
                      borderRadius: '4px',
                      transition: 'width 0.6s ease'
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Heatmap Section */}
        <div className="glass-panel" style={{ padding: '28px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map size={20} color="var(--primary)" /> Strike Zone Map
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>
              Zone Effectiveness
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', minHeight: '260px' }}>
            {Object.entries(heatmap || {}).map(([key, val]) => (
              <div 
                key={key} 
                style={{ 
                  background: getHeatColor(val), 
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justify: 'center',
                  padding: '16px 8px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'transform 0.2s, background 0.2s',
                  cursor: 'default'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', fontWeight: '600', marginBottom: '6px', textAlign: 'center' }}>
                  {key.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>{val}%</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', background: 'rgba(0, 210, 255, 0.05)', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
              <strong style={{ color: 'var(--primary)' }}>Note:</strong> Higher percentages indicates stronger scoring capability in those specific overs & zones.
            </p>
          </div>
        </div>

      </div>

      <style>{`
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