import 'react';
import { TrendingUp, AlertCircle, Shield, Play, Brain } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { match: 'M1', runs: 45, strikeRate: 130 },
  { match: 'M2', runs: 82, strikeRate: 155 },
  { match: 'M3', runs: 31, strikeRate: 120 },
  { match: 'M4', runs: 105, strikeRate: 180 },
  { match: 'M5', runs: 67, strikeRate: 145 },
  { match: 'M6', runs: 94, strikeRate: 165 },
];



const Dashboard = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="page-title">Command Center</h1>
          <p className="page-subtitle">Welcome back! Here's the latest cricket intelligence.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Win Predictor - Top left */}
        <div className="glass-panel col-span-4">
          <div className="stat-header" style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--text-main)' }}>Win Predictor</h3>
            <span className="ml-tag">ML Model</span>
          </div>
          
          <div className="prediction-circle">
            <div className="prediction-inner">
              <span className="prediction-value">65%</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Win Probability</span>
            </div>
          </div>
        </div>

        {/* Player Analyzer - Top right */}
        <div className="glass-panel col-span-8">
          <div className="stat-header" style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-main)' }}>Player Performance Analyzer</h3>
            <span className="stat-change positive">
              <TrendingUp size={14} /> +12% Form
            </span>
          </div>
          
          <div className="player-header" style={{ marginBottom: '16px' }}>
            <img src="https://images.unsplash.com/photo-1540324155970-1c3aa4e444dc?auto=format&fit=crop&q=80&w=100&h=100" alt="Player" className="player-avatar" />
            <div className="player-info">
              <h2>Travis Head</h2>
              <div className="player-role">Top Order Batter</div>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <span className="news-tag">Aggressive</span>
                <span className="news-tag">Pace Hitter</span>
              </div>
            </div>
          </div>
          
          <div style={{ height: '200px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="match" stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-darker)', border: '1px solid var(--panel-border)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Area type="monotone" dataKey="runs" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRuns)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ML Match Previews - Bottom left */}
        <div className="glass-panel col-span-6">
          <div className="stat-header" style={{ marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-main)' }}>ML Match Preview and Review</h3>
            <span className="ml-tag"><Brain size={14} style={{marginRight: '4px'}}/> Deep Analysis</span>
          </div>
          
          <div className="team-vs">
            <div className="team-logo" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>IND</div>
            <div className="vs-badge">VS</div>
            <div className="team-logo" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}>AUS</div>
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '12px', color: 'var(--text-muted)' }}>Key Matchups Generated</h4>
            <div className="news-item">
              <div className="brand-icon" style={{ width: '32px', height: '32px' }}><Shield size={16} /></div>
              <div>
                <div style={{ fontWeight: '600' }}>Pace Attack vs Top Order</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Model predicts 3 wickets in powerplay based on pitch moisture index.</div>
              </div>
            </div>
            <div className="news-item">
              <div className="brand-icon" style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--danger), #ff8a00)' }}><AlertCircle size={16} /></div>
              <div>
                <div style={{ fontWeight: '600' }}>Spin Vulnerability</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AUS middle order shows 42% drop in strike rate against wrist spin.</div>
              </div>
            </div>
          </div>
        </div>

        {/* News Curator - Bottom right */}
        <div className="glass-panel col-span-6">
          <div className="stat-header" style={{ marginBottom: '24px' }}>
            <h3 style={{ color: 'var(--text-main)' }}>Personalized News Curator</h3>
            <span style={{ color: 'var(--primary)', fontSize: '0.9rem', cursor: 'pointer' }}>View All</span>
          </div>
          
          <div className="news-item">
            <img src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=80&h=80" alt="News" className="news-image" />
            <div className="news-content">
              <div className="news-title">Final Squad Announced for World Cup</div>
              <div className="news-meta">
                <span>2 hours ago</span>
                <span className="news-tag">Tournament</span>
              </div>
            </div>
          </div>
          
          <div className="news-item">
            <img src="https://images.unsplash.com/photo-1589806051566-074cdfc33f57?auto=format&fit=crop&q=80&w=80&h=80" alt="News" className="news-image" />
            <div className="news-content">
              <div className="news-title">Star Bowler Recovers from Injury Faster than Expected</div>
              <div className="news-meta">
                <span>5 hours ago</span>
                <span className="news-tag">Injuries</span>
              </div>
            </div>
          </div>
          
          <div className="news-item">
            <div className="news-image" style={{ background: 'linear-gradient(135deg, #1f2937, #111827)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play color="var(--primary)" />
            </div>
            <div className="news-content">
              <div className="news-title">Highlights: Thrilling Last Over Finish</div>
              <div className="news-meta">
                <span>1 day ago</span>
                <span className="news-tag" style={{ background: 'rgba(248, 81, 73, 0.1)', color: 'var(--danger)' }}>Video</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;