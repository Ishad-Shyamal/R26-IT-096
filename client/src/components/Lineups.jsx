import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, CheckCircle, Circle } from 'lucide-react';

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

const Lineups = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const passed   = location.state || {};

  const team1      = passed.team1    || '';
  const team2      = passed.team2    || '';
  const format     = passed.format   || 'T20';
  const probable1  = passed.probableTeam1 || [];
  const probable2  = passed.probableTeam2 || [];
  const fromMode   = passed.fromMode || 'preview';

  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (team1 && team2) {
      fetchLineups(team1, team2, format);
    } else {
      setError('No teams selected. Please go back and run a Match Preview first.');
    }
  }, []);

  const fetchLineups = async (t1, t2, fmt) => {
    setLoading(true); setResult(null); setError('');
    try {
      const res  = await fetch(
        `http://127.0.0.1:8000/lineups/get?team1=${encodeURIComponent(t1)}&team2=${encodeURIComponent(t2)}&format=${fmt}`
      );
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Could not reach backend. Make sure FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
      navigate('/match-previews', {
        state: {
          restoreMode:   fromMode,
          team1,
          team2,
          format,
          venue:         passed.venue        || '',
          venueCountry:  passed.venueCountry || '',
          match_date:    passed.match_date   || '',
          result:        passed.result       || null,
          probableTeam1: probable1,
          probableTeam2: probable2,
        }
      });
    };

  const LineupColumn = ({ teamName, players, opponent, probable }) => {
    const count      = players ? players.length : 0;
    const isComplete = count === 11;

    const probableNames = probable.map(p =>
      (p.player_name || p.name || '').toLowerCase().trim()
    );

    const matchCount = players
      ? players.filter(p => {
          const name = (typeof p === 'string' ? p : (p.name || '')).toLowerCase().trim();
          return probableNames.some(pn => pn.includes(name) || name.includes(pn));
        }).length
      : 0;

    return (
      <div style={{ flex: 1, minWidth: '300px' }}>
        {/* Team header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:'16px', padding:'14px 18px',
          background:'rgba(0,243,255,0.05)', borderRadius:'12px',
          border:'1px solid rgba(0,243,255,0.15)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            {flagMap[teamName] && (
              <img src={flagMap[teamName]} alt="" style={{ width:'32px', height:'20px', borderRadius:'3px', objectFit:'cover', border:'1px solid rgba(255,255,255,0.15)' }} onError={e=>e.target.style.display='none'} />
            )}
            <div>
              <h3 style={{ margin:0, fontSize:'1.05rem', color:'white', fontWeight:700 }}>{teamName}</h3>
              <span style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.45)' }}>Last XI vs {opponent}</span>
            </div>
          </div>
          {/* X/11 badge */}
          <div style={{
            display:'flex', alignItems:'center', gap:'6px',
            padding:'5px 13px', borderRadius:'20px',
            background: isComplete ? 'rgba(52,211,153,0.15)' : 'rgba(251,191,36,0.12)',
            border:`1px solid ${isComplete ? 'rgba(52,211,153,0.4)' : 'rgba(251,191,36,0.35)'}`,
          }}>
            <Users size={13} color={isComplete ? '#34d399' : '#fbbf24'} />
            <span style={{ fontSize:'0.95rem', fontWeight:800, color: isComplete ? '#34d399' : '#fbbf24' }}>
              {count}/11
            </span>
          </div>
        </div>

        {/* Probable XI overlap counter */}
        {probable.length > 0 && (
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            marginBottom:'14px', padding:'10px 16px',
            background:'rgba(99,102,241,0.08)', borderRadius:'10px',
            border:'1px solid rgba(99,102,241,0.25)',
          }}>
            <span style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.6)' }}>
              In Probable XI
            </span>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{
                height:'6px', borderRadius:'3px', overflow:'hidden',
                width:'80px', background:'rgba(255,255,255,0.1)',
              }}>
                <div style={{
                  height:'100%', borderRadius:'3px',
                  width:`${(matchCount / 11) * 100}%`,
                  background: matchCount >= 8 ? '#34d399' : matchCount >= 5 ? '#fbbf24' : '#f87171',
                  transition:'width 0.4s ease',
                }} />
              </div>
              <span style={{
                fontSize:'1rem', fontWeight:800,
                color: matchCount >= 8 ? '#34d399' : matchCount >= 5 ? '#fbbf24' : '#f87171',
              }}>
                {matchCount}/11
              </span>
            </div>
          </div>
        )}

        {/* Player rows */}
        <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
          {players && players.length > 0 ? players.map((p, idx) => {
            const name = (typeof p === 'string' ? p : (p.name || '')).toLowerCase().trim();
            const inProbable = probableNames.length > 0 &&
              probableNames.some(pn => pn.includes(name) || name.includes(pn));

            return (
              <div key={idx}
                style={{
                  display:'flex', alignItems:'center', gap:'11px',
                  padding:'10px 14px',
                  background: inProbable ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.03)',
                  border:`1px solid ${inProbable ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius:'9px', transition:'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = inProbable ? 'rgba(34,197,94,0.12)' : 'rgba(0,243,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = inProbable ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.03)'}
              >
                <span style={{
                  minWidth:'24px', height:'24px', display:'flex', alignItems:'center',
                  justifyContent:'center', borderRadius:'50%',
                  background:'rgba(0,243,255,0.1)', color:'var(--primary,#00f3ff)',
                  fontSize:'0.72rem', fontWeight:700, flexShrink:0,
                }}>{idx + 1}</span>

                <span style={{ flex:1, color: inProbable ? '#86efac' : '#f1f5f9', fontSize:'0.92rem', fontWeight: inProbable ? 600 : 500 }}>
                  {typeof p === 'string' ? p : (p.name || p.player_name)}
                </span>

                {inProbable
                  ? <CheckCircle size={14} color="#22c55e" style={{ flexShrink:0 }} />
                  : <Circle size={14} color="rgba(255,255,255,0.2)" style={{ flexShrink:0 }} />
                }
              </div>
            );
          }) : (
            <div style={{
              padding:'35px 20px', textAlign:'center',
              color:'rgba(255,255,255,0.3)', fontSize:'0.88rem',
              border:'1px dashed rgba(255,255,255,0.08)', borderRadius:'12px',
            }}>
              No lineup data found for {teamName} vs {opponent}
            </div>
          )}

          {count > 0 && count < 11 && Array.from({ length: 11 - count }).map((_, i) => (
            <div key={`tbc-${i}`} style={{
              display:'flex', alignItems:'center', gap:'11px',
              padding:'10px 14px', opacity:0.35,
              background:'rgba(255,255,255,0.01)', border:'1px dashed rgba(255,255,255,0.06)',
              borderRadius:'9px',
            }}>
              <span style={{
                minWidth:'24px', height:'24px', display:'flex', alignItems:'center',
                justifyContent:'center', borderRadius:'50%',
                background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.3)', fontSize:'0.72rem',
              }}>{count + i + 1}</span>
              <span style={{ color:'rgba(255,255,255,0.2)', fontSize:'0.85rem', fontStyle:'italic' }}>TBC</span>
              <Circle size={13} color="rgba(255,255,255,0.12)" style={{ marginLeft:'auto', flexShrink:0 }} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding:'20px', maxWidth:'1400px', margin:'0 auto', color:'white' }}>

      {/* Back button */}
      <div style={{ marginBottom:'25px' }}>
        <button
          onClick={handleBack}
          style={{
            display:'flex', alignItems:'center', gap:'8px',
            padding:'10px 18px', fontSize:'0.88rem', fontWeight:'500',
            color:'#d1d5db', background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px',
            cursor:'pointer', backdropFilter:'blur(8px)', transition:'all 0.2s ease-in-out',
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor='rgba(0,243,255,0.4)'; e.currentTarget.style.color='#fff'; }}
          onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#d1d5db'; }}
        >
          <ArrowLeft size={16} /> Back to Match Previews
        </button>
      </div>

      {/* Header */}
      <div className="glass-panel" style={{
        padding:'20px 30px', marginBottom:'25px',
        background:'rgba(255,255,255,0.03)', backdropFilter:'blur(12px)',
        borderRadius:'16px', border:'1px solid rgba(255,255,255,0.08)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          {flagMap[team1] && <img src={flagMap[team1]} alt="" style={{ width:'32px', height:'20px', borderRadius:'3px', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />}
          <h2 style={{ margin:0, fontSize:'1.1rem', fontWeight:700 }}>{team1}</h2>
          <span style={{ color:'rgba(255,255,255,0.4)', fontWeight:600 }}>vs</span>
          <h2 style={{ margin:0, fontSize:'1.1rem', fontWeight:700 }}>{team2}</h2>
          {flagMap[team2] && <img src={flagMap[team2]} alt="" style={{ width:'32px', height:'20px', borderRadius:'3px', objectFit:'cover' }} onError={e=>e.target.style.display='none'} />}
        </div>
        <span style={{
          padding:'4px 14px', borderRadius:'20px',
          background:'rgba(0,243,255,0.08)', border:'1px solid rgba(0,243,255,0.2)',
          color:'var(--primary,#00f3ff)', fontWeight:700, fontSize:'0.82rem', letterSpacing:'1px',
        }}>
          {format} — LAST KNOWN XI
        </span>
      </div>

      {/* No teams guard */}
      {!team1 && !team2 && (
        <div className="glass-panel" style={{ padding:'40px', textAlign:'center', borderRadius:'12px' }}>
          <p style={{ color:'rgba(255,255,255,0.4)', margin:0 }}>
            No match selected. Go back and run a Match Preview first.
          </p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign:'center', padding:'50px', opacity:0.6 }}>
          <p>Fetching lineups...</p>
        </div>
      )}

      {error && !loading && (
        <div className="glass-panel" style={{ padding:'20px', textAlign:'center', border:'1px solid #f87171', borderRadius:'12px', marginBottom:'20px' }}>
          <p style={{ color:'#f87171', margin:0 }}>{error}</p>
        </div>
      )}

      {result && !result.error && !loading && (
        <div style={{ display:'flex', gap:'24px', flexWrap:'wrap' }}>
          <LineupColumn teamName={team1} players={result.team1_lineup} opponent={team2} probable={probable1} />
          <LineupColumn teamName={team2} players={result.team2_lineup} opponent={team1} probable={probable2} />
        </div>
      )}

      {result && result.error && !loading && (
        <div className="glass-panel" style={{ padding:'30px', textAlign:'center', border:'1px solid #f87171', borderRadius:'12px' }}>
          <p style={{ color:'#f87171', margin:0 }}>{result.error}</p>
        </div>
      )}
    </div>
  );
};

export default Lineups;