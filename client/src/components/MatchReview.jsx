import React, { useState } from 'react';
import {
  Quote,
  Award,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';

const MatchReview = () => {
  const teamsList = [
    "Afghanistan", "Australia", "Bangladesh", "England",
    "India", "Ireland", "New Zealand", "Pakistan",
    "South Africa", "Sri Lanka", "West Indies", "Zimbabwe"
  ].sort();

  const [formData, setFormData] = useState({
    team1: '',
    team2: '',
    format: 'ODI',
    match_date: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/review/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Review Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Shared input styles (matches MatchPreviewReview layout) ──
  const inputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
    padding: '0 15px',
    flex: '1',
    minWidth: '150px'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 10px 14px 35px',
    background: 'transparent',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none'
  };

  const iconStyle = {
    position: 'absolute',
    left: '15px',
    pointerEvents: 'none',
    opacity: 0.7,
    color: 'var(--primary, #00f3ff)'
  };

  const arrowIconStyle = {
    position: 'absolute',
    right: '15px',
    pointerEvents: 'none',
    opacity: 0.5,
    color: '#ffffff'
  };

  return (
    <div
      className="review-content"
      style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', color: 'white' }}
    >
      {/* ── FORM PANEL ── */}
      <div
        className="glass-panel"
        style={{
          padding: '25px 30px',
          marginBottom: '30px',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <h2 style={{ marginBottom: '25px', textAlign: 'center', fontWeight: '600', letterSpacing: '0.5px' }}>
          Review Match
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
              width: '100%'
            }}
          >
            {/* FIELD 1 — Team 1 */}
            <div style={inputContainerStyle}>
              <Award size={18} style={iconStyle} />
              <select
                style={inputStyle}
                value={formData.team1}
                onChange={e => setFormData({ ...formData, team1: e.target.value })}
                required
              >
                <option value="" disabled style={{ background: '#1a1a1a' }}>Select Team 1</option>
                {teamsList.map(team => (
                  <option key={`t1-${team}`} value={team} style={{ background: '#1a1a1a' }}>{team}</option>
                ))}
              </select>
              <ChevronDown size={16} style={arrowIconStyle} />
            </div>

            {/* FIELD 2 — Team 2 */}
            <div style={inputContainerStyle}>
              <Award size={18} style={iconStyle} />
              <select
                style={inputStyle}
                value={formData.team2}
                onChange={e => setFormData({ ...formData, team2: e.target.value })}
                required
              >
                <option value="" disabled style={{ background: '#1a1a1a' }}>Select Team 2</option>
                {teamsList.map(team => (
                  <option key={`t2-${team}`} value={team} style={{ background: '#1a1a1a' }}>{team}</option>
                ))}
              </select>
              <ChevronDown size={16} style={arrowIconStyle} />
            </div>

            {/* FIELD 3 — Date Selector with forced DD/MM/YYYY Presentation format masking */}
            <div style={inputContainerStyle} className="input-field-focus">
              <Calendar size={18} style={iconStyle} />
              <input
                type="date"
                required
                value={formData.match_date}
                onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                data-date={
                  formData.match_date
                    ? formData.match_date.split('-').reverse().join('/')
                    : 'DD/MM/YYYY'
                }
                style={{
                  ...inputStyle,
                  colorScheme: 'dark',
                  position: 'relative',
                  color: formData.match_date ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}
                className="custom-date-picker"
              />
            </div>

            {/* FIELD 4 — Format */}
            <div style={inputContainerStyle}>
              <Layers size={18} style={iconStyle} />
              <select
                style={inputStyle}
                value={formData.format}
                onChange={e => setFormData({ ...formData, format: e.target.value })}
              >
                <option value="ODI" style={{ background: '#1a1a1a' }}>ODI</option>
                <option value="T20" style={{ background: '#1a1a1a' }}>T20</option>
                <option value="TEST" style={{ background: '#1a1a1a' }}>TEST</option>
              </select>
              <ChevronDown size={16} style={arrowIconStyle} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, var(--primary, #00f3ff) 0%, #00a8ff 100%)',
                color: 'black',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                height: '48px',
                padding: '0 25px',
                fontSize: '0.95rem',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 15px rgba(0, 243, 255, 0.2)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minWidth: '160px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Fetching...' : 'Generate Analysis'}
            </button>
          </div>
        </form>
      </div>

      {/* ── RESULTS DISPLAY ── */}
      {result && result.match_title && (
        <div className="results-wrapper">
          {/* Header Card */}
          <div
            className="glass-panel"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              padding: '20px',
              borderLeft: '5px solid var(--primary)',
              marginBottom: '20px'
            }}
          >
            <div>
              <h3 style={{ color: 'var(--primary)', margin: 0 }}>{result.match_title}</h3>
              <p style={{ margin: '5px 0 0 0' }}>
                <strong>Venue:</strong> {result.venue || 'N/A'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ letterSpacing: '1px', margin: 0 }}>
                {result.date ? result.date.split('-').reverse().join('/') : 'N/A'}
              </h2>
              <p style={{ color: 'var(--primary)', fontWeight: 'bold', margin: '5px 0 0 0' }}>
                FINAL RESULT
              </p>
            </div>
          </div>

          {/* Innings Score Summary */}
          <div className="glass-panel" style={{ padding: '25px', marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px', marginTop: 0 }}>
              Innings Summary
            </h4>

            {/* ── Derive batting order from toss string ── */}
            {(() => {
              // toss string e.g. "England won & chose to Bat" or "England won & chose to Bowl"
              const tossStr    = result.toss || '';
              const choseToBat = tossStr.toLowerCase().includes('bat');

              // fuzzy-match toss winner against the two teams
              const teams = [formData.team1, formData.team2];
              const tossWinner = teams.find(t =>
                tossStr.toLowerCase().includes(t.toLowerCase())
              ) || teams[0];

              // who batted first
              const firstBat  = choseToBat
                ? tossWinner
                : teams.find(t => t !== tossWinner) || teams[1];
              const secondBat = teams.find(t => t !== firstBat) || teams[0];

              // Debug: log toss parsing to verify
              console.log('TOSS STRING:', tossStr);
              console.log('TOSS WINNER:', tossWinner);
              console.log('CHOSE TO BAT:', choseToBat);
              console.log('FIRST BAT:', firstBat, '| SECOND BAT:', secondBat);
              console.log('SCORES:', result.scores);

              // map team name → flag image path (using files in /public/flags/)
              const flagFile = {
                'Afghanistan' : '/flags/afghanistan.png',
                'Australia'   : '/flags/australia.webp',
                'Bangladesh'  : '/flags/bangladesh.png',
                'England'     : '/flags/england.webp',
                'India'       : '/flags/india.webp',
                'Ireland'     : '/flags/ireland.png',
                'New Zealand' : '/flags/new%20zealand.png',
                'Pakistan'    : '/flags/pakistan.webp',
                'South Africa': '/flags/south%20africa.webp',
                'Sri Lanka'   : '/flags/sri%20lanka.webp',
                'West Indies' : '/flags/west%20indies.png',
                'Zimbabwe'    : '/flags/zimbabwe.png',
              };

              const inningsConfig = [
                { key: 'inn1', label: '1st Inn', team: firstBat  },
                { key: 'inn2', label: '2nd Inn', team: secondBat },
                { key: 'inn3', label: '3rd Inn', team: firstBat  },
                { key: 'inn4', label: '4th Inn', team: secondBat },
              ];

              return (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  {inningsConfig.map(({ key, label, team }) =>
                    result.scores?.[key] && result.scores[key] !== '0/0' && result.scores[key] !== 'null' ? (
                      <div
                        key={key}
                        style={{
                          padding: '15px',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: '10px',
                          flex: '1',
                          textAlign: 'center'
                        }}
                      >
                        {/* Innings label */}
                        <p style={{ color: 'var(--primary)', margin: 0, marginBottom: '10px' }}>
                          {label}
                        </p>

                        {/* Team flag image */}
                        <img
                          src={flagFile[team] || '/flags/afghanistan.png'}
                          alt={team}
                          style={{
                            width: '42px',
                            height: '28px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                            display: 'block',
                            margin: '0 auto 6px auto'
                          }}
                        />

                        {/* Team name */}
                        <p style={{
                          margin: '0 0 8px 0',
                          fontSize: '0.72rem',
                          color: 'rgba(255,255,255,0.55)',
                          letterSpacing: '0.3px'
                        }}>
                          {team}
                        </p>

                        {/* Score */}
                        <h3 style={{ margin: 0 }}>{result.scores[key]}</h3>
                      </div>
                    ) : null
                  )}
                </div>
              );
            })()}
          </div>

          {/* Detailed Analysis Output */}
          <div
            className="glass-panel"
            style={{
              padding: '25px',
              backgroundColor: 'rgba(0, 243, 255, 0.05)',
              borderTop: '2px solid var(--primary)'
            }}
          >
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 15px 0' }}>
              <Quote size={20} color="var(--primary)" />
              Detailed Analysis
            </h3>
            <p style={{ fontStyle: 'italic', lineHeight: '1.8', fontSize: '1.1rem', margin: 0 }}>
              "{result.summary}"
            </p>
            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0, 243, 255, 0.05)', borderLeft: '4px solid var(--primary)' }}>
              <strong>Verdict:</strong> {result.final_result || 'N/A'}
            </div>
          </div>
        </div>
      )}

      {/* Error Output Boundary */}
      {result && result.error && (
        <div
          className="glass-panel"
          style={{ marginTop: '20px', padding: '20px', border: '1px solid #ff4d4d', textAlign: 'center' }}
        >
          <h3 style={{ color: '#ff4d4d', margin: '0 0 10px 0' }}>Data Not Found</h3>
          <p style={{ margin: 0 }}>{result.error}</p>
        </div>
      )}

      {/* Dynamic Native CSS Formatter Overlays */}
      <style>{`
        .custom-date-picker::-webkit-datetime-edit { 
          display: none !important; 
        }
        .custom-date-picker::before {
          content: attr(data-date);
          position: absolute;
          left: 45px;
          top: 50%;
          transform: translateY(-50%);
          color: inherit;
          pointer-events: none;
        }
        .custom-date-picker::-webkit-calendar-picker-indicator {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          color: transparent;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default MatchReview;