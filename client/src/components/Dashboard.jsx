import React from 'react';
import { TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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


      </div>
    </div>
  );
};

export default Dashboard;
