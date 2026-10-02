import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ShieldCheck } from 'lucide-react';

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

const ValidationYears = () => {
  const navigate = useNavigate();
  const passed = useLocation().state || {};

  const team1  = passed.team1  || '';
  const team2  = passed.team2  || '';
  const format = passed.format || '';
  const year   = passed.year   || '';
  const month  = passed.month  || '';
  const result = passed.result || null;

  const TrendBadge = ({ pct }) => {
    if (pct === null || pct === undefined) {
      return (
        <span style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: 700,
        }}>
          <Minus size={13} /> No baseline
        </span>
      );
    }
    const up = pct >= 0;
    return (
      <span style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        color: up ? '#34d399' : '#f87171', fontSize: '0.85rem', fontWeight: 800,
      }}>
        {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {up ? '+' : ''}{pct.toFixed(3)}
      </span>
    );
  };

  const TeamColumn = ({ teamName, opponent, res }) => (
    <div style={{ flex: 1, minWidth: '320px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px', padding: '14px 18px',
        background: 'rgba(52,211,153,0.06)', borderRadius: '12px',
        border: '1px solid rgba(52,211,153,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {flagMap[teamName] && (
            <img src={flagMap[teamName]} alt="" style={{
              width: '32px', height: '20px', borderRadius: '3px', objectFit: 'cover',
              border: '1px solid rgba(255,255,255,0.15)'
            }} onError={e => e.target.style.display = 'none'} />
          )}
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'white', fontWeight: 700 }}>
              {teamName}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
              Projected XI vs {opponent} — {month} {year}
            </span>
          </div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          padding: '5px 13px', borderRadius: '20px',
          background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)',
        }}>
          <ShieldCheck size={13} color="#34d399" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399' }}>
            Validated
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {res?.players?.map((p, idx) => (
          <div key={idx} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px',
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '10px',
          }}>
            <span style={{
              minWidth: '26px', height: '26px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', borderRadius: '50%',
              background: 'rgba(52,211,153,0.15)', color: '#34d399',
              fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
            }}>{p.batting_position}</span>

            <div style={{ flex: 1 }}>
              <div style={{ color: '#86efac', fontSize: '0.95rem', fontWeight: 700 }}>
                {p.player_name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                {p.role}
              </div>
            </div>

            <TrendBadge pct={p.trend_pct} />
          </div>
        ))}
        {!res?.players?.length && (
          <div style={{
            padding: '30px', textAlign: 'center', color: 'rgba(255,255,255,0.3)',
            border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px',
          }}>
            No projected XI to validate.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto', color: 'white' }}>
      <div style={{ marginBottom: '25px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', fontSize: '0.88rem', fontWeight: '500',
            color: '#d1d5db', background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} /> Back to Upcoming Years
        </button>
      </div>

      <div className="glass-panel" style={{
        padding: '20px 30px', marginBottom: '25px',
        background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)',
        borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {flagMap[team1] && <img src={flagMap[team1]} alt="" style={{ width: '32px', height: '20px', borderRadius: '3px', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{team1}</h2>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>vs</span>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{team2}</h2>
          {flagMap[team2] && <img src={flagMap[team2]} alt="" style={{ width: '32px', height: '20px', borderRadius: '3px', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />}
        </div>
        <span style={{
          padding: '4px 14px', borderRadius: '20px',
          background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
          color: '#34d399', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '1px',
        }}>
          {format} — {month} {year} PROJECTION VALIDATION
        </span>
      </div>

      {!result?.success ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '12px' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            No projection to validate. Go back and run "Project XI" first.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <TeamColumn teamName={team1} opponent={team2} res={result.data.team1_results} />
          <TeamColumn teamName={team2} opponent={team1} res={result.data.team2_results} />
        </div>
      )}
    </div>
  );
};

export default ValidationYears;