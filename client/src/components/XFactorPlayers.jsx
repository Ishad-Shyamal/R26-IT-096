import React, { useState } from 'react';
import { Zap, Crown, Shield, Crosshair, Loader2, AlertCircle } from 'lucide-react';
import RANKINGS_CACHE from './data/rankingsCache';

// Predicted Playing XIs per team per format (from ML-Driven Match Previews module)
const PLAYING_XI = {
  India: {
    t20: ["Ishan Kishan", "Abhishek Sharma", "Suryakumar Yadav", "Tilak Varma", "Hardik Pandya", "Shivam Dube", "Axar Patel", "Varun Chakaravarthy", "Arshdeep Singh", "Jasprit Bumrah", "Ravi Bishnoi"],
    odi: ["Rohit Sharma", "Shubman Gill", "Virat Kohli", "KL Rahul", "Shreyas Iyer", "Hardik Pandya", "Ravindra Jadeja", "Kuldeep Yadav", "Mohammed Siraj", "Jasprit Bumrah", "Axar Patel"],
    test: ["Yashasvi Jaiswal", "Shubman Gill", "Virat Kohli", "KL Rahul", "Ravindra Jadeja", "Washington Sundar", "Axar Patel", "Kuldeep Yadav", "Jasprit Bumrah", "Mohammed Siraj", "R Ashwin"],
  },
  Australia: {
    t20: ["Travis Head", "Mitchell Marsh", "Glenn Maxwell", "Marcus Stoinis", "Tim David", "Josh Inglis", "Pat Cummins", "Mitchell Starc", "Adam Zampa", "Nathan Ellis", "Spencer Johnson"],
    odi: ["Travis Head", "David Warner", "Steve Smith", "Marnus Labuschagne", "Glenn Maxwell", "Marcus Stoinis", "Alex Carey", "Pat Cummins", "Mitchell Starc", "Josh Hazlewood", "Adam Zampa"],
    test: ["Usman Khawaja", "Travis Head", "Marnus Labuschagne", "Steve Smith", "Mitchell Marsh", "Alex Carey", "Pat Cummins", "Mitchell Starc", "Nathan Lyon", "Scott Boland", "Josh Hazlewood"],
  },
  England: {
    t20: ["Phil Salt", "Jos Buttler", "Harry Brook", "Jacob Bethell", "Will Jacks", "Liam Livingstone", "Sam Curran", "Adil Rashid", "Jofra Archer", "Mark Wood", "Reece Topley"],
    odi: ["Phil Salt", "Joe Root", "Harry Brook", "Ben Stokes", "Jos Buttler", "Liam Livingstone", "Sam Curran", "Adil Rashid", "Jofra Archer", "Mark Wood", "Reece Topley"],
    test: ["Ben Duckett", "Zak Crawley", "Joe Root", "Harry Brook", "Ben Stokes", "Jamie Smith", "Gus Atkinson", "Chris Woakes", "Mark Wood", "Shoaib Bashir", "James Anderson"],
  },
  "South Africa": {
    t20: ["Dewald Brevis", "Ryan Rickelton", "Aiden Markram", "Heinrich Klaasen", "David Miller", "Tristan Stubbs", "Marco Jansen", "Kagiso Rabada", "Corbin Bosch", "Anrich Nortje", "Keshav Maharaj"],
    odi: ["Quinton de Kock", "Tony de Zorzi", "Aiden Markram", "Temba Bavuma", "Heinrich Klaasen", "David Miller", "Marco Jansen", "Kagiso Rabada", "Keshav Maharaj", "Anrich Nortje", "Lungi Ngidi"],
    test: ["Tony de Zorzi", "Aiden Markram", "Temba Bavuma", "Tristan Stubbs", "Ryan Rickelton", "Kyle Verreynne", "Marco Jansen", "Kagiso Rabada", "Keshav Maharaj", "Simon Harmer", "Wiaan Mulder"],
  },
  "New Zealand": {
    t20: ["Tim Seifert", "Finn Allen", "Daryl Mitchell", "Glenn Phillips", "Mark Chapman", "Mitchell Santner", "Michael Bracewell", "Ish Sodhi", "Trent Boult", "Tim Southee", "Lockie Ferguson"],
    odi: ["Daryl Mitchell", "Devon Conway", "Kane Williamson", "Rachin Ravindra", "Glenn Phillips", "Tom Latham", "Mitchell Santner", "Michael Bracewell", "Matt Henry", "Trent Boult", "Tim Southee"],
    test: ["Devon Conway", "Kane Williamson", "Rachin Ravindra", "Daryl Mitchell", "Tom Latham", "Tom Blundell", "Glenn Phillips", "Mitchell Santner", "Matt Henry", "Tim Southee", "Kyle Jamieson"],
  },
  Pakistan: {
    t20: ["Sahibzada Farhan", "Babar Azam", "Saim Ayub", "Mohammad Rizwan", "Fakhar Zaman", "Salman Agha", "Mohammad Nawaz", "Shaheen Afridi", "Haris Rauf", "Abrar Ahmed", "Naseem Shah"],
    odi: ["Babar Azam", "Imam-ul-Haq", "Fakhar Zaman", "Mohammad Rizwan", "Saim Ayub", "Salman Agha", "Mohammad Nawaz", "Shaheen Afridi", "Haris Rauf", "Abrar Ahmed", "Naseem Shah"],
    test: ["Babar Azam", "Saud Shakeel", "Imam-ul-Haq", "Mohammad Rizwan", "Saim Ayub", "Salman Agha", "Noman Ali", "Shaheen Afridi", "Abrar Ahmed", "Haris Rauf", "Naseem Shah"],
  },
  "Sri Lanka": {
    t20: ["Pathum Nissanka", "Kusal Mendis", "Charith Asalanka", "Kamil Mishara", "Dasun Shanaka", "Wanindu Hasaranga", "Dunith Wellalage", "Maheesh Theekshana", "Dushmantha Chameera", "Matheesha Pathirana", "Nuwan Thushara"],
    odi: ["Pathum Nissanka", "Kusal Mendis", "Charith Asalanka", "Kamindu Mendis", "Dasun Shanaka", "Dhananjaya de Silva", "Wanindu Hasaranga", "Maheesh Theekshana", "Dunith Wellalage", "Dushmantha Chameera", "Matheesha Pathirana"],
    test: ["Dimuth Karunaratne", "Pathum Nissanka", "Kamindu Mendis", "Dinesh Chandimal", "Dhananjaya de Silva", "Angelo Mathews", "Prabath Jayasuriya", "Ramesh Mendis", "Asitha Fernando", "Vishwa Fernando", "Lahiru Kumara"],
  },
  "West Indies": {
    t20: ["Shai Hope", "Brandon King", "Nicholas Pooran", "Shimron Hetmyer", "Roston Chase", "Romario Shepherd", "Jason Holder", "Matthew Forde", "Alzarri Joseph", "Akeal Hosein", "Obed McCoy"],
    odi: ["Shai Hope", "Brandon King", "Nicholas Pooran", "Shimron Hetmyer", "Roston Chase", "Jason Holder", "Gudakesh Motie", "Alzarri Joseph", "Jayden Seales", "Akeal Hosein", "Shamar Joseph"],
    test: ["Kraigg Brathwaite", "Tagenarine Chanderpaul", "Kirk McKenzie", "Kavem Hodge", "Alick Athanaze", "Jason Holder", "Joshua Da Silva", "Kemar Roach", "Jayden Seales", "Shamar Joseph", "Gudakesh Motie"],
  },
};

const ROLE_ICONS = {
  'Batter': <Crown size={18} />,
  'Bowler': <Crosshair size={18} />,
  'All-Rounder': <Shield size={18} />,
};

const ROLE_COLORS = {
  'Batter': { bg: 'rgba(0, 210, 255, 0.12)', border: 'rgba(0, 210, 255, 0.35)', accent: '#00d2ff' },
  'Bowler': { bg: 'rgba(248, 81, 73, 0.12)', border: 'rgba(248, 81, 73, 0.35)', accent: '#f85149' },
  'All-Rounder': { bg: 'rgba(210, 153, 34, 0.12)', border: 'rgba(210, 153, 34, 0.35)', accent: '#d29922' },
};

const FORMAT_LABELS = { t20: 'T20I', odi: 'ODI', test: 'Test' };

// --- Client-side name matching (mirrors backend logic) ---
const normalize = (name) => name.toLowerCase().replace(/[^a-z ]/g, '').trim();

const nameMatch = (xiName, rankedName) => {
  const n1 = normalize(xiName);
  const n2 = normalize(rankedName);
  if (n1 === n2) return true;
  const parts1 = n1.split(' ');
  const parts2 = n2.split(' ');
  if (parts1.length && parts2.length && parts1[parts1.length - 1] === parts2[parts2.length - 1] && parts1[parts1.length - 1].length > 3) return true;
  if (n1.length > 4 && n2.length > 4 && (n1.includes(n2) || n2.includes(n1))) return true;
  return false;
};

const findXFactor = (playingXI, fmt) => {
  const results = [];
  for (const [roleKey, roleLabel] of [['batting', 'Batter'], ['bowling', 'Bowler'], ['allrounder', 'All-Rounder']]) {
    const rankings = RANKINGS_CACHE[fmt]?.[roleKey] || [];
    let best = null;
    for (let xiIdx = 0; xiIdx < playingXI.length; xiIdx++) {
      for (const [rank, rankedName, country, rating] of rankings) {
        if (nameMatch(playingXI[xiIdx], rankedName)) {
          const candidate = { xiIdx, rank, rating, name: rankedName, country };
          if (!best || rank < best.rank || (rank === best.rank && rating > best.rating) || (rank === best.rank && rating === best.rating && xiIdx < best.xiIdx)) {
            best = candidate;
          }
          break;
        }
      }
    }
    if (best) results.push({ name: best.name, role: roleLabel, rank: best.rank, rating: best.rating, country: best.country });
  }
  return results;
};

const XFactorPlayers = () => {
  const [inputs, setInputs] = useState({ team1: 'India', team2: 'Australia', format: 't20' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchXFactor = () => {
    const { team1, team2, format } = inputs;
    if (team1 === team2) { alert('Teams must be different!'); return; }

    setLoading(true);
    setError(null);
    setResult(null);

    const t1_xi = PLAYING_XI[team1]?.[format] || [];
    const t2_xi = PLAYING_XI[team2]?.[format] || [];

    // Simulate brief delay for UX, then compute locally
    setTimeout(() => {
      try {
        const t1_players = findXFactor(t1_xi, format);
        const t2_players = findXFactor(t2_xi, format);
        setResult({
          team1_xfactor: { team: team1, players: t1_players },
          team2_xfactor: { team: team2, players: t2_players },
          format: format.toUpperCase(),
        });
      } catch (err) {
        setError('Failed to compute X-Factor players.');
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const selectStyle = {
    width: '100%', padding: '10px', background: 'var(--bg-darker)',
    border: '1px solid var(--panel-border)', color: 'var(--text-main)',
    borderRadius: '6px', outline: 'none', fontFamily: 'inherit', fontSize: '0.95rem',
  };

  const renderPlayerCard = (player, index) => {
    const colors = ROLE_COLORS[player.role] || ROLE_COLORS['Batter'];
    return (
      <div key={index} style={{
        background: colors.bg, border: `1px solid ${colors.border}`,
        borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column',
        gap: '10px', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow accent */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: `${colors.accent}22`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: colors.accent, flexShrink: 0,
          }}>
            {ROLE_ICONS[player.role]}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {player.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: colors.accent, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {player.role}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{
            flex: 1, background: 'rgba(0,0,0,0.25)', borderRadius: '8px',
            padding: '8px 10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: colors.accent }}>
              #{player.rank}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ICC Rank
            </div>
          </div>
          <div style={{
            flex: 1, background: 'rgba(0,0,0,0.25)', borderRadius: '8px',
            padding: '8px 10px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
              {player.rating}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Rating
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTeamSection = (teamData, teamColor) => {
    if (!teamData || !teamData.players || teamData.players.length === 0) {
      return <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No ranked players found in Playing XI.</div>;
    }
    return (
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '20px', paddingBottom: '12px',
          borderBottom: `2px solid ${teamColor}33`,
        }}>
          <Zap size={20} style={{ color: teamColor }} />
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>
            {teamData.team}
          </h3>
          <span style={{
            marginLeft: 'auto', fontSize: '0.75rem', color: teamColor, fontWeight: '600',
            background: `${teamColor}15`, padding: '3px 10px', borderRadius: '20px',
            border: `1px solid ${teamColor}30`,
          }}>
            X-FACTOR
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {teamData.players.map((p, i) => renderPlayerCard(p, i))}
        </div>
      </div>
    );
  };

  const teams = ["India", "Australia", "England", "South Africa", "New Zealand", "Pakistan", "Sri Lanka", "West Indies"];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">X-Factor Players</h1>
          <p className="page-subtitle">Identify the highest-ranked impact players from each team's Playing XI.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '28px' }}>
        <div className="stat-header" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--text-main)' }}>Select Match Configuration</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Team 1</label>
            <select value={inputs.team1} onChange={e => setInputs({ ...inputs, team1: e.target.value })} style={selectStyle}>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Team 2</label>
            <select value={inputs.team2} onChange={e => setInputs({ ...inputs, team2: e.target.value })} style={selectStyle}>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Match Format</label>
            <select value={inputs.format} onChange={e => setInputs({ ...inputs, format: e.target.value })} style={selectStyle}>
              <option value="t20">T20 International</option>
              <option value="odi">One Day International (ODI)</option>
              <option value="test">Test Match</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary" onClick={fetchXFactor} disabled={loading}
          style={{ padding: '14px 32px', borderRadius: '8px', fontSize: '1.05rem', width: '100%' }}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing Rankings...
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <Zap size={18} /> Reveal X-Factor Players
            </span>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-panel" style={{ borderColor: 'rgba(248,81,73,0.3)', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)' }}>
            <AlertCircle size={20} /> <span>{error}</span>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="glass-panel" style={{ animation: 'fadeUp 0.5s ease' }}>
          <div className="stat-header" style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={20} style={{ color: 'var(--warning)' }} />
              X-Factor Analysis — {FORMAT_LABELS[inputs.format] || inputs.format.toUpperCase()}
            </h3>

          </div>

          <div style={{ display: 'flex', gap: '32px' }}>
            {renderTeamSection(result.team1_xfactor, '#00d2ff')}

            {/* Divider */}
            <div style={{
              width: '1px', background: 'linear-gradient(180deg, transparent, var(--panel-border), transparent)',
              flexShrink: 0,
            }} />

            {renderTeamSection(result.team2_xfactor, '#f85149')}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 32px' }}>
          <Zap size={64} style={{ opacity: 0.15, marginBottom: '20px', color: 'var(--warning)' }} />
          <div style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Select teams and format, then click "Reveal X-Factor Players"
          </div>

        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default XFactorPlayers;
