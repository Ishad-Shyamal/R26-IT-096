import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin, Star, ShieldCheck, Target, Zap, Quote, Calendar,
  Layers, Award, ChevronDown, ArrowLeft, Clock, Users, CheckCircle2
} from 'lucide-react';
import Navbar from './Navbar';

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

const venuesData = {
  "India": ["Narendra Modi Stadium","Wankhede Stadium","Eden Gardens","M. Chinnaswamy",
    "Arun Jaitley","M.A. Chidambaram","HPCA Stadium","Maharaja Yadavindra",
    "Rajiv Gandhi Intl","MCA Stadium","Sawai Mansingh","Shaheed Veer Narayan",
    "Barsapara Stadium","Ekana Stadium","IS Bindra Stadium","VCA Stadium",
    "JSCA Stadium","Holkar Stadium","SCA Stadium","Dr. Y.S.R. ACA-VDCA"],
  "Australia": ["MCG","SCG","Optus Stadium","Adelaide Oval","The Gabba",
    "Bellerive Oval","Manuka Oval","Marvel Stadium","Carrara Stadium"],
  "England": ["Lord's","Kennington Oval","Edgbaston","Old Trafford","Headingley",
    "Trent Bridge","Rose Bowl"],
  "South Africa": ["Wanderers","Newlands","Centurion","Kingsmead","St George's Park"],
  "New Zealand": ["Eden Park","Hagley Oval","Wellington Basin","Seddon Park"],
  "Pakistan": ["Gaddafi Stadium","National Stadium","Multan Stadium"],
  "UAE": ["Dubai Int. Stadium","Sheikh Zayed","Sharjah Stadium"],
  "Sri Lanka": ["R. Premadasa","Galle Int.","Pallekele",
    "Rangiri Dambulla International Stadium","Sinhalese Sports Club Ground"],
  "West Indies": ["Kensington Oval","Daren Sammy","Providence"],
  "Bangladesh": ["Sher-e-Bangla"],
  "Zimbabwe": ["Harare Sports"],
  "Ireland": ["Malahide"]
};

const YEARS = [2027, 2028, 2029, 2030];
const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];
const DATE_NUMBERS = Array.from({ length: 31 }, (_, i) => i + 1);
const UpcomingYears = () => {
  const navigate = useNavigate();
  const carried = useLocation().state || {};

  const [formData, setFormData] = useState({
    team1: carried.team1 || '',
    team2: carried.team2 || '',
    format: carried.format || 'TEST',
    venueCountry: carried.venueCountry || '',
    venue: carried.venue || '',
    year: carried.year || 2027,
    month: carried.month || 'March',
    date: carried.date || 1
  });
  const [result, setResult] = useState(carried.result || null);
  const [loading, setLoading] = useState(false);
  const [showTournaments, setShowTournaments] = useState(false);

  const teamsList = Object.keys(flagMap);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    let data;
    try {
      const res = await fetch('http://127.0.0.1:8000/predict/upcoming11', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team1: formData.team1,
          team2: formData.team2,
          format: formData.format,
          venue: formData.venue,
          year: Number(formData.year),
          month: formData.month,
          date: carried.date || 1
        })
      });
      data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error connecting to backend:', err);
      data = { success: false, error: 'Could not reach the prediction service.' };
      setResult(data);
    } finally {
      setLoading(false);
    }
    // Write the full form + result into this history entry so that
    // navigating away (e.g. to Validation) and coming back restores it
    // instead of resetting to the page's original entry state.
    navigate('.', { replace: true, state: { ...formData, result: data } });
  };

  const inputContainerStyle = {
    position: 'relative', display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', transition: 'all 0.3s ease', padding: '0 15px',
    flex: '1', minWidth: '170px'
  };
  const inputStyle = {
    width: '100%', padding: '14px 10px 14px 35px', background: 'transparent',
    border: 'none', color: '#fff', fontSize: '0.95rem', outline: 'none',
    cursor: 'pointer', WebkitAppearance: 'none', MozAppearance: 'none',
    appearance: 'none'
  };
  const selectStyleWithFlag = { ...inputStyle, paddingLeft: '55px' };
  const iconStyle = { position: 'absolute', left: '15px', pointerEvents: 'none',
    opacity: 0.7, color: 'var(--primary,#00f3ff)', zIndex: 2 };
  const flagStyle = { position: 'absolute', left: '15px', width: '28px', height: '18px',
    objectFit: 'cover', borderRadius: '3px', pointerEvents: 'none',
    border: '1px solid rgba(255,255,255,0.15)', zIndex: 2 };
  const arrowIconStyle = { position: 'absolute', right: '15px', pointerEvents: 'none',
    opacity: 0.5, color: '#fff', zIndex: 2 };
  const opt = { background: '#1a1a1a' };

  const PlayerCard = ({ player }) => (
      <div
        className="player-card glass-panel"
        style={{
          marginBottom: '10px',
          padding: '15px',
          borderLeft: '4px solid var(--primary)'
        }}
      >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,243,255,0.1)', border: '1px solid rgba(0,243,255,0.3)',
          fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)'
        }}>{player.batting_position}</span>
        <div>
          <h4 style={{ margin: 0, color: 'white' }}>{player.player_name}</h4>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 'bold' }}>
            {player.role} 
          </span>
        </div>
      </div>
      {player.reason && (
        <p style={{ fontSize: '0.78rem', marginTop: '8px', opacity: 0.9,
                    lineHeight: '1.4', borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '8px' }}>
          {player.reason}
        </p>
      )}
    </div>
  );

  const TeamColumn = ({ title, res }) => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '15px' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={18} color="#FFD700" /> {title} Projected XI
        </h3>
        {typeof res?.lineup_retained === 'number' && (
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
            
          </span>
        )}
      </div>
      {res?.error && <p style={{ color: '#ff4d4d' }}>{res.error}</p>}
      {res?.players?.map((p, i) => <PlayerCard key={i} player={p} />)}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="match-container"
           style={{ padding: '20px', paddingTop: '120px', maxWidth: '1500px',
                    margin: '0 auto', color: 'white' }}>


        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: showTournaments ? '15px' : '25px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '0.88rem',
                color: '#d1d5db',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={16} /> Back to Match Preview
            </button>

            <button
              onClick={() => {
                if (!result?.success) return;
                navigate('/validation-years', {
                  state: {
                    team1: formData.team1,
                    team2: formData.team2,
                    format: formData.format,
                    venue: formData.venue,
                    year: formData.year,
                    month: formData.month,
                    date: formData.date,
                    result: result,
                  }
                });
              }}
              disabled={!result?.success}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                fontSize: '0.88rem',
                fontWeight: '500',
                color: result?.success
                  ? 'var(--primary,#00f3ff)'
                  : 'rgba(255,255,255,0.3)',
                background: 'rgba(0,243,255,0.05)',
                border: '1px solid rgba(0,243,255,0.2)',
                borderRadius: '10px',
                cursor: result?.success ? 'pointer' : 'not-allowed'
              }}
            >
              <CheckCircle2 size={16} /> Validation
            </button>
          </div>

          <button
            onClick={() => setShowTournaments(!showTournaments)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '0.88rem',
              fontWeight: '500',
              color: 'var(--primary,#00f3ff)',
              background: 'rgba(0,243,255,0.05)',
              border: '1px solid rgba(0,243,255,0.2)',
              borderRadius: '10px',
              cursor: 'pointer'
            }}
          >
            <Clock size={16} />
            Tournaments
            <ChevronDown
              size={15}
              style={{
                transform: showTournaments
                  ? 'rotate(180deg)'
                  : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </button>
        </div>

        {showTournaments && (
          <div
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '20px 25px',
              marginBottom: '20px',
              background: 'rgba(15,20,30,0.95)',
              border: '1px solid rgba(0,243,255,0.2)',
              borderRadius: '14px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
            }}
          >
            <h3
              style={{
                margin: '0 0 18px',
                color: 'var(--primary,#00f3ff)',
                fontSize: '1rem'
              }}
            >
              Upcoming Major Tournaments
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '18px'
              }}
            >
              <div
                style={{
                  padding: '15px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px'
                }}
              >
                <strong>2027 ICC World Test Championship Final</strong>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '8px' }}>
                  🗓️ June 2027
                </div>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '4px' }}>
                  📍 England (Lord's Cricket Ground)
                </div>
              </div>
              <div
                style={{
                  padding: '15px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px'
                }}
              >
                <strong>2027 Asia Cup</strong>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '8px' }}>
                  🗓️ June – July 2027
                </div>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '4px' }}>
                  📍 Bangladesh 
                </div>
              </div>
              <div
                style={{
                  padding: '15px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px'
                }}
              >
                <strong>2027 ICC Men's ODI World Cup</strong>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '8px' }}>
                  🗓️ October – November 2027
                </div>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '4px' }}>
                  📍 South Africa, Zimbabwe, and Namibia
                </div>
              </div>

              <div
                style={{
                  padding: '15px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px'
                }}
              >
                <strong>2028 ICC Men's T20 World Cup</strong>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '8px' }}>
                  🗓️ October – November 2028 (expected)
                </div>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '4px' }}>
                  📍 Australia and New Zealand
                </div>
              </div>

              <div
                style={{
                  padding: '15px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px'
                }}
              >
                <strong>2029 ICC World Test Championship Final</strong>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '8px' }}>
                  🗓️ June 2029 (expected)
                </div>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '4px' }}>
                  📍 England
                </div>
              </div>

              <div
                style={{
                  padding: '15px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px'
                }}
              >
                <strong>2029 ICC Champions Trophy</strong>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '8px' }}>
                  🗓️ October 2029 (expected)
                </div>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '4px' }}>
                  📍 India
                </div>
              </div>

              <div
                style={{
                  padding: '15px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px'
                }}
              >
                <strong>2030 ICC Men's T20 World Cup</strong>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '8px' }}>
                  🗓️ June 2030 (expected)
                </div>

                <div style={{ fontSize: '0.8rem', opacity: 0.75, marginTop: '4px' }}>
                  📍 England, Ireland, and Scotland
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="glass-panel"
             style={{ padding: '25px 30px', marginBottom: '30px',
                      background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)',
                      borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ marginBottom: '25px', textAlign: 'center', fontWeight: 600 }}>
            Upcoming Years
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                          gap: '12px', width: '100%' }}>

              {/* Team 1 */}
              <div style={inputContainerStyle} className="input-field-focus">
                {formData.team1
                  ? <img src={flagMap[formData.team1]} alt="" style={flagStyle}
                         onError={(e) => { e.target.style.display = 'none'; }} />
                  : <Award size={18} style={iconStyle} />}
                <select className="custom-input"
                        style={formData.team1 ? selectStyleWithFlag : inputStyle}
                        value={formData.team1} required
                        onChange={(e) => setFormData({ ...formData, team1: e.target.value })}>
                  <option value="" disabled style={opt}>Select Team 1</option>
                  {teamsList.map(t => (
                    <option key={t} value={t} disabled={t === formData.team2} style={opt}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={arrowIconStyle} />
              </div>

              {/* Team 2 */}
              <div style={inputContainerStyle} className="input-field-focus">
                {formData.team2
                  ? <img src={flagMap[formData.team2]} alt="" style={flagStyle}
                         onError={(e) => { e.target.style.display = 'none'; }} />
                  : <Award size={18} style={iconStyle} />}
                <select className="custom-input"
                        style={formData.team2 ? selectStyleWithFlag : inputStyle}
                        value={formData.team2} required
                        onChange={(e) => setFormData({ ...formData, team2: e.target.value })}>
                  <option value="" disabled style={opt}>Select Team 2</option>
                  {teamsList.map(t => (
                    <option key={t} value={t} disabled={t === formData.team1} style={opt}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={arrowIconStyle} />
              </div>

              {/* Country */}
              <div style={inputContainerStyle} className="input-field-focus">
                <MapPin size={18} style={iconStyle} />
                <select style={inputStyle} value={formData.venueCountry} required
                        onChange={(e) => setFormData({ ...formData,
                                                       venueCountry: e.target.value,
                                                       venue: '' })}>
                  <option value="" disabled style={opt}>Select Country</option>
                  {Object.keys(venuesData).map(c => (
                    <option key={c} value={c} style={opt}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={arrowIconStyle} />
              </div>

              {/* Venue */}
              <div style={{ ...inputContainerStyle,
                            opacity: !formData.venueCountry ? 0.6 : 1 }}
                   className="input-field-focus">
                <MapPin size={18} style={iconStyle} />
                <select style={inputStyle} value={formData.venue} required
                        disabled={!formData.venueCountry}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}>
                  <option value="" disabled style={opt}>
                    {!formData.venueCountry ? "Choose Country First" : "Select Venue Name"}
                  </option>
                  {formData.venueCountry && venuesData[formData.venueCountry].map(s => (
                    <option key={s} value={s} style={opt}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={16} style={arrowIconStyle} />
              </div>

              {/* Format */}
              <div style={inputContainerStyle} className="input-field-focus">
                <Layers size={18} style={iconStyle} />
                <select className="custom-input" style={inputStyle} value={formData.format}
                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}>
                  <option value="TEST" style={opt}>TEST</option>
                  <option value="ODI" style={opt}>ODI</option>
                  <option value="T20" style={opt}>T20</option>
                </select>
                <ChevronDown size={16} style={arrowIconStyle} />
              </div>

              {/* Year */}
              <div style={inputContainerStyle} className="input-field-focus">
                <Calendar size={18} style={iconStyle} />
                <select className="custom-input" style={inputStyle} value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}>
                  {YEARS.map(y => <option key={y} value={y} style={opt}>{y}</option>)}
                </select>
                <ChevronDown size={16} style={arrowIconStyle} />
              </div>

              {/* Month */}
              <div style={inputContainerStyle} className="input-field-focus">
                <Clock size={18} style={iconStyle} />
                <select className="custom-input" style={inputStyle} value={formData.month}
                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}>
                  {MONTHS.map(m => <option key={m} value={m} style={opt}>{m}</option>)}
                </select>
                <ChevronDown size={16} style={arrowIconStyle} />
              </div>

              {/* Date */}
              <div style={inputContainerStyle} className="input-field-focus">
                <Calendar size={18} style={iconStyle} />
                <select className="custom-input" style={inputStyle} value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: Number(e.target.value) })}>
                  {DATE_NUMBERS.map(d => <option key={d} value={d} style={opt}>{d}</option>)}
                </select>
                <ChevronDown size={16} style={arrowIconStyle} />
              </div>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'center',
                            marginTop: '5px' }}>
                <button type="submit" disabled={loading} className="submit-btn-hover"
                  style={{ background: 'linear-gradient(135deg, var(--primary,#00f3ff) 0%, #00a8ff 100%)',
                           color: 'black', fontWeight: 'bold', border: 'none',
                           borderRadius: '8px', height: '48px', padding: '0 25px',
                           fontSize: '0.95rem', minWidth: '200px',
                           cursor: loading ? 'not-allowed' : 'pointer',
                           opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Projecting...' : 'Project XI'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {result?.success && (
          <div className="results-wrapper">
            <div className="glass-panel"
                 style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
                          marginBottom: '20px', padding: '20px',
                          borderLeft: '5px solid var(--primary)' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px',
                             color: 'var(--primary)' }}>
                  <MapPin size={20} /> Venue Analysis
                </h3>
                <p><strong>Ground:</strong> {result.data.venue_details.stadium},{' '}
                  {result.data.venue_details.city}</p>
                <p><strong>Conditions:</strong> {result.data.venue_details.pitch_type} surface ·{' '}
                  {result.data.venue_details.conditions}</p>
                <p><strong>RPO / RPW:</strong> {result.data.venue_details.rpo.toFixed(2)} /{' '}
                  {result.data.venue_details.rpw.toFixed(2)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ letterSpacing: '2px', display: 'flex', alignItems: 'center',
                             justifyContent: 'flex-end', gap: '10px' }}>
                  {flagMap[result.data.match_info.team1] &&
                    <img src={flagMap[result.data.match_info.team1]} alt=""
                         style={{ width: 30, height: 20, borderRadius: 3, objectFit: 'cover' }} />}
                  {result.data.match_info.team1}
                  <span style={{ color: 'gray', fontSize: '1.2rem' }}>VS</span>
                  {result.data.match_info.team2}
                  {flagMap[result.data.match_info.team2] &&
                    <img src={flagMap[result.data.match_info.team2]} alt=""
                         style={{ width: 30, height: 20, borderRadius: 3, objectFit: 'cover' }} />}
                </h2>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                  {result.data.match_info.format} · {result.data.match_info.month}{' '}
                  {result.data.match_info.year}
                </p>
              </div>
            </div>

            <div className="glass-panel"
                 style={{ padding: '25px', marginBottom: '20px',
                          backgroundColor: 'rgba(0,243,255,0.05)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Quote size={20} color="var(--primary)" /> Projection Outlook
              </h3>
              <p style={{ lineHeight: '1.7', fontSize: '1.05rem', color: '#e0e0e0' }}>
                {result.data.match_outlook}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px',
                          marginBottom: '30px' }}>
              {[['team1_results', 'team1'], ['team2_results', 'team2']].map(([rk, tk]) => (
                <div key={rk} className="glass-panel" style={{ padding: '20px' }}>
                  <h3 style={{ color: 'var(--primary)', borderBottom: '1px solid #333',
                               paddingBottom: '10px', marginTop: 0 }}>
                    {result.data.match_info[tk]} Strategy
                  </h3>
                  <p><Star size={16} color="gold" /> <strong>Key Player:</strong>{' '}
                    {result.data[rk].key_player}</p>
                  <p><Target size={16} color="#ff4d4d" /> <strong>Primary Role:</strong>{' '}
                    {result.data[rk].key_role}</p>
                  <p><ShieldCheck size={16} color="#4ade80" /> <strong>Strength:</strong>{' '}
                    {result.data[rk].strength}</p>
                  <p><Users size={16} color="var(--primary)" /> <strong>Spin / Pace:</strong>{' '}
                    {result.data[rk].spin_count} / {result.data[rk].pace_count} ·{' '}
                    avg age {result.data[rk].avg_age}</p>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              <TeamColumn title={result.data.match_info.team1} res={result.data.team1_results} />
              <TeamColumn title={result.data.match_info.team2} res={result.data.team2_results} />
            </div>
          </div>
        )}

        {result && !result.success && (
          <div className="glass-panel"
               style={{ padding: '30px', textAlign: 'center',
                        border: '1px solid #ff4d4d', marginTop: '20px' }}>
            <p style={{ color: '#ff4d4d' }}>{result.error || 'Projection failed.'}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UpcomingYears;