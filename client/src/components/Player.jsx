import React, { useState } from 'react';
import { Users, Globe, Target, Brain, Activity } from 'lucide-react';
import Navbar from './Navbar';

const Player = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedMatchType, setSelectedMatchType] = useState('');

  const matchTypes = ['T20I', 'ODI', 'Test'];

  // Cricket countries data
  const countries = [
    { id: 1, name: 'India', code: 'IND' },
    { id: 2, name: 'Australia', code: 'AUS' },
    { id: 3, name: 'England', code: 'ENG' },
    { id: 4, name: 'Pakistan', code: 'PAK' },
    { id: 5, name: 'South Africa', code: 'RSA' },
    { id: 6, name: 'New Zealand', code: 'NZL' },
    { id: 7, name: 'West Indies', code: 'WI' },
    { id: 8, name: 'Sri Lanka', code: 'SL' },
    { id: 9, name: 'Bangladesh', code: 'BD' },
    { id: 10, name: 'Afghanistan', code: 'AFG' },
  ];

  // Players data mapped by country code
  const playersByCountry = {
    IND: [
      { id: 1, name: 'V Kohli' },
      { id: 2, name: 'Abhishek Sharma' },
      { id: 3, name: 'Mohammed Shami' },
      { id: 4, name: 'Mohammed Siraj' },
      { id: 5, name: 'HH Pandya' },
      { id: 6, name: 'RA Jadeja' },
      { id: 7, name: 'Ravi Bishnoi' },
      { id: 8, name: 'S Dube' },
      { id: 9, name: 'SV Samson' },
      { id: 10, name: 'Kuldeep Yadav' },
    ],
    AUS: [
      { id: 11, name: 'TM Head' },
      { id: 12, name: 'AM Hardie' },
      { id: 13, name: 'MS Wade' },
      { id: 14, name: 'DA Warner' },
      { id: 15, name: 'GJ Maxwell' },
      { id: 16, name: 'MA Starc' },
      { id: 17, name: 'TH David' },
      { id: 18, name: 'JR Philippe' },
      { id: 19, name: 'M Labuschagne' },
      { id: 20, name: 'MT Renshaw' },
    ],
    ENG: [
      { id: 21, name: 'JE Root' },
      { id: 22, name: 'Ben Stokes' },
      { id: 23, name: 'HC Brook' },
      { id: 24, name: 'JC Archer' },
      { id: 25, name: 'JC Buttler' },
      { id: 26, name: 'JG Bethell' },
      { id: 27, name: 'JL Smith' },
      { id: 28, name: 'PD Salt' },
      { id: 29, name: 'Rehan Ahmed' },
      { id: 30, name: 'JM Cox' },
    ],
    PAK: [
      { id: 31, name: 'Babar Azam' },
      { id: 32, name: 'Shaheen Shah Afridi' },
      { id: 33, name: 'Fakhar Zaman' },
      { id: 34, name: 'Babar Azam' },
      { id: 35, name: 'Faisal Akram' },
      { id: 36, name: 'Hasan Nawaz' },
      { id: 37, name: 'Mohammad Nawaz' },
      { id: 38, name: 'Faisal Akram' },
      { id: 39, name: 'Mohammad Rizwan' },
      { id: 40, name: 'Usman Khan' },
    ],
    RSA: [
      { id: 41, name: 'Q de Kock' },
      { id: 42, name: 'RR Hendricks' },
      { id: 43, name: 'T Bavuma' },
      { id: 44, name: 'AK Markram' },
      { id: 45, name: 'DA Miller' },
      { id: 46, name: 'C Bosch' },
      { id: 47, name: 'K Rabada' },
      { id: 48, name: 'KA Maharaj' },
      { id: 49, name: 'D Brevis' },
      { id: 50, name: 'N Peter' },
    ],
    NZL: [
      { id: 51, name: 'A Ashok' },
      { id: 52, name: 'BJ Jacobs' },
      { id: 53, name: 'DJ Mitchell' },
      { id: 54, name: 'JA Clarkson' },
      { id: 55, name: 'GD Phillips' },
      { id: 56, name: 'MJ Henry' },
      { id: 57, name: 'TB Robinson' },
      { id: 58, name: 'TG Southee' },
      { id: 59, name: 'DP Conway' },
      { id: 60, name: 'NG Smith' },
    ],
    WI: [
      { id: 61, name: 'N Pooran' },
      { id: 62, name: 'SD Hope' },
      { id: 63, name: 'AS Joseph' },
      { id: 64, name: 'JO Holder' },
      { id: 65, name: 'SO Hetmyer' },
      { id: 66, name: 'AS Joseph' },
      { id: 67, name: 'E Lewis' },
      { id: 68, name: 'J Charles' },
      { id: 69, name: 'S Joseph' },
      { id: 70, name: 'R Shepherd' },
    ],
    SL: [
      { id: 71, name: 'KIC Asalanka' },
      { id: 72, name: 'P Nissanka' },
      { id: 73, name: 'M Theekshana' },
      { id: 74, name: 'Lahiru Kumara' },
      { id: 75, name: 'MDKJ Perera' },
      { id: 76, name: 'DN Wellalage' },
      { id: 77, name: 'M Theekshana' },
      { id: 78, name: 'JDF Vandersay' },
      { id: 79, name: 'K Mishara' },
      { id: 80, name: 'PW Hasaranga' },
    ],
    BD: [
      { id: 81, name: 'Litton Das' },
      { id: 82, name: 'Mahmudullah' },
      { id: 83, name: 'Mustafizur Rahman' },
      { id: 84, name: 'Mahedi Hasan' },
      { id: 85, name: 'Afif Hossain' },
      { id: 86, name: 'Mushfiqur Rahim' },
      { id: 87, name: 'Taskin Ahmed' },
      { id: 88, name: 'Jaker Ali' },
      { id: 89, name: 'Saif Hassan' },
      { id: 90, name: 'Towhid Hridoy' },
    ],
    AFG: [
      { id: 91, name: 'Mohammad Nabi' },
      { id: 92, name: 'Ziaur Rahman' },
      { id: 93, name: 'Rashid Khan' },
      { id: 94, name: 'Rahmat Shah' },
      { id: 95, name: 'Abdul Malik' },
      { id: 96, name: 'Hashmatullah Shahidi' },
      { id: 97, name: 'Rahmanullah Gurbaz' },
      { id: 98, name: 'Sediqullah Atal' },
      { id: 99, name: 'Gulbadin Naib' },
      { id: 100, name: 'Ibrahim Zadran' },
    ],
  };

  const availablePlayers = selectedCountry ? playersByCountry[selectedCountry] || [] : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCountry && selectedPlayer && selectedMatchType) {
      console.log('Player selected:', {
        country: countries.find(c => c.code === selectedCountry)?.name,
        player: selectedPlayer,
        matchType: selectedMatchType,
      });
    }
  };

  return (
    <div style={{ maxWidth: '100%' }}>
      <Navbar />
      
      <div style={{ marginTop: '40px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div className="brand-icon" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
            <Users size={18} />
          </div>
          <h1 className="page-title" style={{ margin: 0 }}>Player Analysis</h1>
        </div>
        <p className="page-subtitle">Deep dive into player statistics and predictive performance metrics.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '48px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative elements */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--primary-glow)', filter: 'blur(40px)', opacity: 0.5 }}></div>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="ml-tag" style={{ justifyContent: 'center', marginBottom: '16px' }}>
              <Brain size={14} /> AI Engine Active
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>Intelligence Input</h2>
            <p style={{ color: 'var(--text-muted)' }}>Configure the parameters for the neural network analysis.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div className="form-group">
              <label style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={18} color="var(--primary)" /> Select Country
              </label>
              <div className="input-wrapper" style={{ paddingLeft: 0 }}>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedPlayer('');
                  }}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--panel-border)',
                    background: 'rgba(0, 0, 0, 0.2)',
                    color: 'var(--text-main)',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '18px'
                  }}
                >
                  <option value="">Choose a national team...</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.code}>{country.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="var(--primary)" /> Player Name
              </label>
              <div className="input-wrapper" style={{ paddingLeft: 0 }}>
                <select
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  disabled={!selectedCountry}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--panel-border)',
                    background: selectedCountry ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    color: selectedCountry ? 'var(--text-main)' : 'var(--text-muted)',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    cursor: selectedCountry ? 'pointer' : 'not-allowed',
                    opacity: selectedCountry ? 1 : 0.6,
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '18px'
                  }}
                >
                  <option value="">{selectedCountry ? 'Choose a player...' : 'Select country first...'}</option>
                  {availablePlayers.map((player) => (
                    <option key={player.id} value={player.name}>{player.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--primary)" /> Match Type
              </label>
              <div className="input-wrapper" style={{ paddingLeft: 0 }}>
                <select
                  value={selectedMatchType}
                  onChange={(e) => setSelectedMatchType(e.target.value)}
                  disabled={!selectedPlayer}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--panel-border)',
                    background: selectedPlayer ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                    color: selectedPlayer ? 'var(--text-main)' : 'var(--text-muted)',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    cursor: selectedPlayer ? 'pointer' : 'not-allowed',
                    opacity: selectedPlayer ? 1 : 0.6,
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 16px center',
                    backgroundSize: '18px'
                  }}
                >
                  <option value="">{selectedPlayer ? 'Choose format...' : 'Select player first...'}</option>
                  {matchTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedCountry || !selectedPlayer || !selectedMatchType}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1.1rem',
                justifyContent: 'center',
                marginTop: '12px',
                borderRadius: '12px',
                opacity: (!selectedCountry || !selectedPlayer || !selectedMatchType) ? 0.5 : 1
              }}
            >
              Start Analysis Engine
            </button>
          </form>

          {selectedCountry && selectedPlayer && (
            <div style={{
              marginTop: '32px',
              padding: '20px',
              borderRadius: '16px',
              background: 'rgba(0, 210, 255, 0.05)',
              border: '1px solid rgba(0, 210, 255, 0.1)',
              animation: 'fadeInUp 0.4s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-dark)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {selectedPlayer.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Selected Target</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {selectedPlayer} <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.9rem' }}>• {countries.find(c => c.code === selectedCountry)?.name} ({selectedMatchType})</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        select option {
          background-color: #0a0c10;
          color: #f0f6fc;
          padding: 12px;
        }

        .form-group:focus-within label {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default Player;
