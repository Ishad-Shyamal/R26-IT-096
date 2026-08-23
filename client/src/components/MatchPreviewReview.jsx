import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Send,
  History,
  MapPin,
  Star,
  ShieldCheck,
  Target,
  Zap,
  Quote,
  Calendar,
  Layers,
  Award,
  ChevronDown,
  ArrowLeft,
  Users
} from 'lucide-react';

// Dictionary mapping the exact dropdown team strings to their precise asset file extension / path formats
const flagMap = {
  "India": "/flags/india.webp",
  "Sri Lanka": "/flags/sri lanka.webp",
  "Australia": "/flags/australia.webp",
  "Bangladesh": "/flags/bangladesh.png",
  "England": "/flags/england.webp",
  "West Indies": "/flags/west indies.png",
  "New Zealand": "/flags/new zealand.png",
  "Pakistan": "/flags/pakistan.webp",
  "Zimbabwe": "/flags/zimbabwe.png",
  "Ireland": "/flags/ireland.png",
  "Afghanistan": "/flags/afghanistan.png",
  "South Africa": "/flags/south africa.webp"
};

const MatchPreviewReview = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Restore full state if navigating back from Lineups page
  const restored = location.state || {};

  const [mode, setMode] = useState(restored.restoreMode || null);

  const [formData, setFormData] = useState({
    team1:        restored.team1        || '',
    team2:        restored.team2        || '',
    format:       restored.format       || 'TEST',
    venueCountry: restored.venueCountry || '',
    venue:        restored.venue        || '',
    match_date:   restored.match_date   || ''
  });

  const [result, setResult] = useState(restored.result || null);
  const [loading, setLoading] = useState(false);
  // ── Snapshot of teams at the moment Generate Analysis was clicked ──
  const [submittedTeams, setSubmittedTeams] = useState({ team1: '', team2: '' });

  // Hardcoded list of international cricket teams requested
  const teamsList = Object.keys(flagMap);

  // Venue dataset parsed directly from your system's venues_df.csv file
  const venuesData = {
    "India": [
      "Narendra Modi Stadium",
      "Wankhede Stadium",
      "Eden Gardens",
      "M. Chinnaswamy",
      "Arun Jaitley",
      "M.A. Chidambaram",
      "HPCA Stadium",
      "Maharaja Yadavindra",
      "Rajiv Gandhi Intl",
      "MCA Stadium",
      "Sawai Mansingh",
      "Shaheed Veer Narayan",
      "Barsapara Stadium",
      "Ekana Stadium",
      "IS Bindra Stadium",
      "VCA Stadium",
      "JSCA Stadium",
      "Holkar Stadium",
      "SCA Stadium",
      "Dr. Y.S.R. ACA-VDCA"
    ],
    "Australia": [
      "MCG",
      "SCG",
      "Optus Stadium",
      "Adelaide Oval",
      "The Gabba",
      "Bellerive Oval",
      "Manuka Oval",
      "Marvel Stadium",
      "Carrara Stadium"
    ],
    "England": [
      "Lord's",
      "The Oval",
      "Edgbaston",
      "Old Trafford",
      "Headingley",
      "Trent Bridge",
      "Rose Bowl"
    ],
    "South Africa": [
      "Wanderers",
      "Newlands",
      "Centurion",
      "Kingsmead",
      "St George's Park"
    ],
    "New Zealand": [
      "Eden Park",
      "Hagley Oval",
      "Wellington Basin",
      "Seddon Park"
    ],
    "Pakistan": [
      "Gaddafi Stadium",
      "National Stadium",
      "Multan Stadium"
    ],
    "UAE": [
      "Dubai Int. Stadium",
      "Sheikh Zayed",
      "Sharjah Stadium"
    ],
    "Sri Lanka": [
      "R. Premadasa",
      "Galle Int.",
      "Pallekele",
      "Rangiri Dambulla International Stadium",
      "Sinhalese Sports Club Ground"
    ],
    "West Indies": [
      "Kensington Oval",
      "Daren Sammy",
      "Providence"
    ],
    "Bangladesh": [
      "Sher-e-Bangla"
    ],
    "Zimbabwe": [
      "Harare Sports"
    ],
    "Ireland": [
      "Malahide"
    ]
  };

  // Automatically reset the venue name if the selected country changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      venue: ''
    }));
  }, [formData.venueCountry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null); // Clear previous results to protect conditional rendering cascades
    // Snapshot the teams at submit time so innings flags don't shift if dropdowns change
    setSubmittedTeams({ team1: formData.team1, team2: formData.team2 });

    // Determine the endpoint based on the mode
    const endpoint =
      mode === 'preview'
        ? 'predict/probable11'
        : 'review/generate';

    // Structure payload precisely matching the expected MatchRequest backend model
    const payload = {
      team1: formData.team1,
      team2: formData.team2,
      format: formData.format,
      venue: formData.venue, // Passes the selected venue name text string
      match_date: formData.match_date
    };

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error('Error connecting to backend:', error);
    } finally {
      setLoading(false); // ✅ FIXED: Changed `loading(false)` to `setLoading(false)`
    }
  };

  const PlayerCard = ({ player }) => (
    <div
      className="player-card glass-panel"
      style={{
        marginBottom: '10px',
        padding: '15px',
        borderLeft: '4px solid var(--primary)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h4 style={{ margin: 0, color: 'white' }}>
            {player.player_name}
          </h4>
          <span
            style={{
              fontSize: '0.85rem',
              color: 'var(--primary)',
              fontWeight: 'bold'
            }}
          >
            {player.role}
          </span>
        </div>
      </div>

      {player.reason && (
        <p
          style={{
            fontSize: '0.78rem',
            marginTop: '8px',
            opacity: 0.9,
            lineHeight: '1.4',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '8px'
          }}
        >
          {player.reason}
        </p>
      )}
    </div>
  );

  // Beautiful Modern Styled Input Container styles
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
    minWidth: '180px' // Expanded slightly to cater cleanly to image inline insertions
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

  const selectStyleWithFlag = {
    ...inputStyle,
    paddingLeft: '55px' // Extra left padding to make visual space for the flag image component
  };

  const iconStyle = {
    position: 'absolute',
    left: '15px',
    pointerEvents: 'none',
    opacity: 0.7,
    color: 'var(--primary, #00f3ff)',
    zIndex: 2
  };

  const flagStyle = {
    position: 'absolute',
    left: '15px',
    width: '28px',
    height: '18px',
    objectFit: 'cover',
    borderRadius: '3px',
    pointerEvents: 'none',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    zIndex: 2
  };

  const arrowIconStyle = {
    position: 'absolute',
    right: '15px',
    pointerEvents: 'none',
    opacity: 0.5,
    color: '#ffffff',
    zIndex: 2
  };

  if (!mode) {
    return (
      <div className="dashboard-grid">
        <div
          className="glass-panel col-span-6"
          onClick={() => setMode('preview')}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            padding: '40px'
          }}
        >
          <Send size={48} color="var(--primary)" />
          <h2>Match Preview</h2>
          <p>Generate intelligence for upcoming matches</p>
        </div>

        <div
          className="glass-panel col-span-6"
          onClick={() => setMode('review')}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            padding: '40px'
          }}
        >
          <History size={48} color="var(--primary)" />
          <h2>Match Review</h2>
          <p>Analyze completed matches from historical data</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="match-container"
      style={{
        padding: '20px',
        maxWidth: '1500px', // Adjusted up slightly to fit selectors comfortably alongside injected flags
        margin: '0 auto',
        color: 'white'
      }}
    >
      {/* Upgraded Premium Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <button
          onClick={() => {
            setMode(null);
            setResult(null);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            fontSize: '0.88rem',
            fontWeight: '500',
            color: '#d1d5db',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
            e.currentTarget.style.borderColor = 'rgba(0, 243, 255, 0.4)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#d1d5db';
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <ArrowLeft size={16} />
          Back to Selection
        </button>

{mode === 'preview' && result?.success && (
        <button
          onClick={() =>
            navigate('/lineups', {
              state: {
                team1:        formData.team1,
                team2:        formData.team2,
                format:       formData.format,
                venue:        formData.venue,
                venueCountry: formData.venueCountry,
                match_date:   formData.match_date,
                result:       result,
                probableTeam1: result?.data?.team1_results?.players || [],
                probableTeam2: result?.data?.team2_results?.players || [],
                fromMode:     mode,
              }
            })
          }
          style={{
            display:'flex',
            alignItems:'center',
            gap:'8px',
            padding:'10px 18px',
            fontSize:'0.88rem',
            fontWeight:'500',
            color:'var(--primary,#00f3ff)',
            background:'rgba(0,243,255,0.05)',
            border:'1px solid rgba(0,243,255,0.2)',
            borderRadius:'10px',
            cursor:'pointer'
          }}
        >
          <Users size={16}/>
          Lineups
        </button>
        )}
      </div>

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
          {mode === 'preview' ? 'Match Preview' : 'Review Match'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Main Layout Row Wrapper: Brings everything to one row/single line */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap', // Safeguard wrapping mechanism for smaller screens
              alignItems: 'center',
              gap: '12px',
              width: '100%'
            }}
          >
            {/* Team 1 Select Dropdown with dynamic flag attachment */}
            <div style={inputContainerStyle} className="input-field-focus">
              {formData.team1 ? (
                <img 
                  src={flagMap[formData.team1]} 
                  alt="" 
                  style={flagStyle} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <Award size={18} style={iconStyle} />
              )}
              <select
                className="custom-input"
                style={formData.team1 ? selectStyleWithFlag : inputStyle}
                value={formData.team1}
                onChange={(e) =>
                  setFormData({ ...formData, team1: e.target.value })
                }
                required
              >
                <option value="" disabled style={{ background: '#1a1a1a' }}>Select Team 1</option>
                {teamsList.map((team) => (
                  <option key={team} value={team} disabled={team === formData.team2} style={{ background: '#1a1a1a' }}>{team}</option>
                ))}
              </select>
              <ChevronDown size={16} style={arrowIconStyle} />
            </div>

            {/* Team 2 Select Dropdown with dynamic flag attachment */}
            <div style={inputContainerStyle} className="input-field-focus">
              {formData.team2 ? (
                <img 
                  src={flagMap[formData.team2]} 
                  alt="" 
                  style={flagStyle} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <Award size={18} style={iconStyle} />
              )}
              <select
                className="custom-input"
                style={formData.team2 ? selectStyleWithFlag : inputStyle}
                value={formData.team2}
                onChange={(e) =>
                  setFormData({ ...formData, team2: e.target.value })
                }
                required
              >
                <option value="" disabled style={{ background: '#1a1a1a' }}>Select Team 2</option>
                {teamsList.map((team) => (
                  <option key={team} value={team} disabled={team === formData.team1} style={{ background: '#1a1a1a' }}>{team}</option>
                ))}
              </select>
              <ChevronDown size={16} style={arrowIconStyle} />
            </div>

            {/* Venue Country — preview only */}
            {mode === 'preview' && (
              <div style={inputContainerStyle} className="input-field-focus">
                <MapPin size={18} style={iconStyle} />
                <select
                  style={inputStyle}
                  value={formData.venueCountry}
                  onChange={(e) =>
                    setFormData({ ...formData, venueCountry: e.target.value })
                  }
                  required
                >
                  <option value="" disabled style={{ background: '#1a1a1a' }}>Select Country</option>
                  {Object.keys(venuesData).map((country) => (
                    <option key={country} value={country} style={{ background: '#1a1a1a' }}>{country}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={arrowIconStyle} />
              </div>
            )}

            {/* Venue Name — preview only */}
            {mode === 'preview' && (
              <div
                style={{
                  ...inputContainerStyle,
                  opacity: !formData.venueCountry ? 0.6 : 1,
                  cursor: !formData.venueCountry ? 'not-allowed' : 'pointer'
                }}
                className="input-field-focus"
              >
                <MapPin size={18} style={iconStyle} />
                <select
                  style={inputStyle}
                  value={formData.venue}
                  onChange={(e) =>
                    setFormData({ ...formData, venue: e.target.value })
                  }
                  disabled={!formData.venueCountry}
                  required
                >
                  <option value="" disabled style={{ background: '#1a1a1a' }}>
                    {!formData.venueCountry ? "Choose Country First" : "Select Venue Name"}
                  </option>
                  {formData.venueCountry &&
                    venuesData[formData.venueCountry].map((stadium) => (
                      <option key={stadium} value={stadium} style={{ background: '#1a1a1a' }}>
                        {stadium}
                      </option>
                    ))}
                </select>
                <ChevronDown size={16} style={arrowIconStyle} />
              </div>
            )}

            {/* Date — review only */}
            {mode === 'review' && (
              <div style={inputContainerStyle} className="input-field-focus">
                <Calendar size={18} style={iconStyle} />
                <input
                  type="date"
                  required
                  value={formData.match_date}
                  onChange={(e) =>
                    setFormData({ ...formData, match_date: e.target.value })
                  }
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
                
                <style>{`
                  .custom-date-picker {
                    appearance: none;
                    -webkit-appearance: none;
                  }
                  .custom-date-picker::-webkit-datetime-edit { 
                    display: none; 
                  }
                  .custom-date-picker::before {
                    content: attr(data-date);
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    color: inherit;
                    pointer-events: none;
                    font-family: inherit;
                  }
                  .custom-date-picker::-webkit-calendar-picker-indicator {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    color: transparent;
                    cursor: pointer;
                  }
                `}</style>
              </div>
            )}

            {/* Match Format Dropdown Selector */}
            <div style={inputContainerStyle} className="input-field-focus">
              <Layers size={18} style={iconStyle} />
              <select
                className="custom-input"
                style={inputStyle}
                value={formData.format}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    format: e.target.value
                  })
                }
              >
                <option value="TEST" style={{ background: '#1a1a1a' }}>TEST</option>
                <option value="ODI" style={{ background: '#1a1a1a' }}>ODI</option>
                <option value="T20" style={{ background: '#1a1a1a' }}>T20</option>
              </select>
              <ChevronDown size={16} style={arrowIconStyle} />
            </div>

            {/* Action Submit Button nested cleanly directly inside the same single row */}
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '5px'
              }}
            >
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
                className="submit-btn-hover"
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ marginRight: '5px' }}></span>
                    Analyzing...
                  </>
                ) : (
                  'Generate Analysis'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* PREVIEW RESULTS */}
      {result && result.success && mode === 'preview' && (
        <div className="results-wrapper">
          <div
            className="glass-panel"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px',
              padding: '20px',
              borderLeft: '5px solid var(--primary)'
            }}
          >
            <div>
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--primary)'
                }}
              >
                <MapPin size={20} />
                Venue Analysis
              </h3>
              <p>
                <strong>Ground:</strong>{' '}
                {result.data.match_info.venue},{' '}
                {result.data.venue_details?.city || 'Location Data Loading...'}
              </p>
              <p>
                <strong>Conditions:</strong>{' '}
                {result.data.venue_details?.pitch_type || 'Natural'}{' '}
                surface. Expect{' '}
                {result.data.venue_details?.assistance || 'Balanced'}{' '}
                assistance.
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h2 style={{ letterSpacing: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                {flagMap[result.data.match_info.team1] && (
                  <img src={flagMap[result.data.match_info.team1]} alt="" style={{ width: '30px', height: '20px', borderRadius: '3px', objectFit: 'cover' }} />
                )}
                {result.data.match_info.team1}{' '}
                <span style={{ color: 'gray', fontSize: '1.2rem', margin: '0 5px' }}>VS</span>{' '}
                {result.data.match_info.team2}
                {flagMap[result.data.match_info.team2] && (
                  <img src={flagMap[result.data.match_info.team2]} alt="" style={{ width: '30px', height: '20px', borderRadius: '3px', objectFit: 'cover' }} />
                )}
              </h2>
              <p
                style={{
                  color: 'var(--primary)',
                  fontWeight: 'bold'
                }}
              >
                {result.data.match_info.format} FORMAT
              </p>
            </div>
          </div>

          {/* ✅ MATCH OUTLOOK SECTION WITH TARGETED FLAGS DIRECTLY UNDERNEATH */}
          <div
            className="glass-panel"
            style={{
              padding: '25px',
              marginBottom: '20px',
              backgroundColor: 'rgba(0, 243, 255, 0.05)'
            }}
          >
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <Quote size={20} color="var(--primary)" />
              Match Outlook
            </h3>
            <p
              style={{
                lineHeight: '1.7',
                fontSize: '1.05rem',
                color: '#e0e0e0',
                marginBottom: '15px'
              }}
            >
              {result.data.match_outlook}
            </p>
            
            {/* Added Request Target Block for Flags mapping down directly below Outlook container */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', tracking: '1px', opacity: 0.6 }}>Contending Flags:</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {flagMap[result.data.match_info.team1] && <img src={flagMap[result.data.match_info.team1]} alt={result.data.match_info.team1} style={{ width: '35px', height: '22px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }} />}
                {flagMap[result.data.match_info.team2] && <img src={flagMap[result.data.match_info.team2]} alt={result.data.match_info.team2} style={{ width: '35px', height: '22px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }} />}
              </div>
            </div>
          </div>

          {/* ✅ STRATEGY PANELS WITH TARGETED FLAGS PLACED ABOVE */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '30px'
            }}
          >
            <div className="glass-panel" style={{ padding: '20px' }}>
              {/* Flag Placed ABOVE Team 1 Strategy section heading */}
              <div style={{ marginBottom: '10px' }}>
                {flagMap[result.data.match_info.team1] && (
                  <img src={flagMap[result.data.match_info.team1]} alt="" style={{ width: '40px', height: '25px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }} />
                )}
              </div>
              <h3
                style={{
                  color: 'var(--primary)',
                  borderBottom: '1px solid #333',
                  paddingBottom: '10px',
                  marginTop: '0'
                }}
              >
                {result.data.match_info.team1} Strategy
              </h3>
              <div style={{ marginTop: '15px' }}>
                <p>
                  <Star size={16} color="gold" />{' '}
                  <strong>Key Player:</strong>{' '}
                  {result.data.team1_results.key_player}
                </p>
                <p>
                  <Target size={16} color="#ff4d4d" />{' '}
                  <strong>Primary Role:</strong>{' '}
                  {result.data.team1_results.key_role}
                </p>
                <p>
                  <ShieldCheck size={16} color="#4ade80" />{' '}
                  <strong>Strength:</strong>{' '}
                  {result.data.team1_results.strength}
                </p>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              {/* Flag Placed ABOVE Team 2 Strategy section heading */}
              <div style={{ marginBottom: '10px' }}>
                {flagMap[result.data.match_info.team2] && (
                  <img src={flagMap[result.data.match_info.team2]} alt="" style={{ width: '40px', height: '25px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.15)' }} />
                )}
              </div>
              <h3
                style={{
                  color: 'var(--primary)',
                  borderBottom: '1px solid #333',
                  paddingBottom: '10px',
                  marginTop: '0'
                }}
              >
                {result.data.match_info.team2} Strategy
              </h3>
              <div style={{ marginTop: '15px' }}>
                <p>
                  <Star size={16} color="gold" />{' '}
                  <strong>Key Player:</strong>{' '}
                  {result.data.team2_results.key_player}
                </p>
                <p>
                  <Target size={16} color="#ff4d4d" />{' '}
                  <strong>Primary Role:</strong>{' '}
                  {result.data.team2_results.key_role}
                </p>
                <p>
                  <ShieldCheck size={16} color="#4ade80" />{' '}
                  <strong>Strength:</strong>{' '}
                  {result.data.team2_results.strength}
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '30px'
            }}
          >
            <div>
              <h3
                style={{
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Zap size={18} color="#FFD700" />
                {result.data.match_info.team1} Lineup
              </h3>
              {result.data.team1_results.players?.map((p, idx) => (
                <PlayerCard key={idx} player={p} />
              ))}
            </div>

            <div>
              <h3
                style={{
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Zap size={18} color="#FFD700" />
                {result.data.match_info.team2} Lineup
              </h3>
              {result.data.team2_results.players?.map((p, idx) => (
                <PlayerCard key={idx} player={p} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REVIEW RESULTS */}
      {result && mode === 'review' && (
        <div className="results-wrapper">
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
              <h3 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {flagMap[formData.team1] && <img src={flagMap[formData.team1]} alt="" style={{ width: '24px', height: '16px', borderRadius: '2px' }} />}
                {result.match_title || 'Match Review Summary'}
                {flagMap[formData.team2] && <img src={flagMap[formData.team2]} alt="" style={{ width: '24px', height: '16px', borderRadius: '2px' }} />}
              </h3>
              <p>
                <strong>Venue:</strong> {result.venue || formData.venue}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <h2 style={{ letterSpacing: '1px' }}>{result.date || formData.match_date}</h2>
              <p
                style={{
                  color: 'var(--primary)',
                  fontWeight: 'bold'
                }}
              >
                FINAL RESULT
              </p>
            </div>
          </div>

          {result.scores && (
            <div
              className="glass-panel"
              style={{
                padding: '25px',
                marginBottom: '20px'
              }}
            >
              <h4
                style={{
                  marginBottom: '15px',
                  borderBottom: '1px solid #333',
                  paddingBottom: '10px'
                }}
              >
                Innings Summary
              </h4>

              {/* ── Derive batting order from toss string ── */}
              {(() => {
                const tossStr    = result.toss || '';
                const choseToBat = tossStr.toLowerCase().includes('bat');
                const teams      = [submittedTeams.team1, submittedTeams.team2];
                const tossWinner = teams.find(t =>
                  tossStr.toLowerCase().includes(t.toLowerCase())
                ) || teams[0];
                const firstBat  = choseToBat
                  ? tossWinner
                  : teams.find(t => t !== tossWinner) || teams[1];
                const secondBat = teams.find(t => t !== firstBat) || teams[0];

                const inningsConfig = [
                  { key: 'inn1', label: '1st Inn', team: firstBat  },
                  { key: 'inn2', label: '2nd Inn', team: secondBat },
                  { key: 'inn3', label: '3rd Inn', team: firstBat  },
                  { key: 'inn4', label: '4th Inn', team: secondBat },
                ];

                return (
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {inningsConfig.map(({ key, label, team }) =>
                      result.scores[key] && result.scores[key] !== '0/0' ? (
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
                          <p style={{ color: 'var(--primary)', margin: '0 0 8px 0' }}>{label}</p>

                          {/* Team flag using flagMap already defined at top of file */}
                          {flagMap[team] && (
                            <img
                              src={flagMap[team]}
                              alt={team}
                              style={{
                                width: '42px',
                                height: '28px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                                display: 'block',
                                margin: '0 auto 6px auto',
                                border: '1px solid rgba(255,255,255,0.15)'
                              }}
                            />
                          )}

                          {/* Team name */}
                          <p style={{
                            margin: '0 0 8px 0',
                            fontSize: '0.72rem',
                            color: 'rgba(255,255,255,0.55)'
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
          )}

          <div
            className="glass-panel"
            style={{
              padding: '25px',
              backgroundColor: 'rgba(0, 243, 255, 0.05)',
              borderTop: '2px solid var(--primary)'
            }}
          >
            <h3>
              <Quote size={20} color="var(--primary)" />
              Analysis
            </h3>

            <p
              style={{
                fontStyle: 'italic',
                lineHeight: '1.8',
                fontSize: '1.1rem'
              }}
            >
              "
              {formData.format === 'TEST' && result.summary
                ? result.summary
                    .replace(/0 was instrumental in the (win|match)\.?/gi, '')
                    .replace(/South Africa/g, 'South Africa')
                    .trim()
                : result.summary || 'No summary overview provided.'}
              "
            </p>

            <div
              style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(255, 77, 77, 0.1)',
                borderLeft: '4px solid #ff4d4d'
              }}
            >
              <strong>Verdict:</strong> {result.final_result || 'N/A'}
            </div>
          </div>
        </div>
      )}

      {/* ERROR DISPLAY */}
      {result && result.error && (
        <div
          className="glass-panel"
          style={{
            padding: '30px',
            textAlign: 'center',
            border: '1px solid #ff4d4d',
            marginTop: '20px'
          }}
        >
          <p style={{ color: '#ff4d4d' }}>{result.error}</p>
        </div>
      )}
    </div>
  );
};

export default MatchPreviewReview;