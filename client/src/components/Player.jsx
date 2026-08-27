// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Users, Globe, Target, Brain, Activity } from 'lucide-react';
// import Navbar from './Navbar';

// const Player = () => {
//   const navigate = useNavigate();
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [selectedPlayer, setSelectedPlayer] = useState('');
//   const [selectedMatchType, setSelectedMatchType] = useState('');

//   const matchTypes = ['T20I', 'ODI', 'Test'];

//   // Cricket countries data
//   const [countries, setCountries] = useState([]);
// const [countriesLoading, setCountriesLoading] = useState(true);

// useEffect(() => {
//   const fetchCountries = async () => {
//     try {
//       const response = await fetch('http://localhost:5002/api/countries');
//       const data = await response.json();
//       setCountries(data);
//     } catch (error) {
//       console.error('Failed to load countries:', error);
//     } finally {
//       setCountriesLoading(false);
//     }
//   };

//   fetchCountries();
// }, []);

//   // Players data mapped by country code
//   const playersByCountry = {
//     India: [
      
//     ],
//     Australia: [
      
//     ],
//     England: [
      
//     ],
//     Pakistan: [
      
//     ],
//     'South Africa': [
      
//     ],
//     'New Zealand': [
      
//     ],
//     'West Indies': [
      
//     ],
//     'Sri Lanka': [
      
//     ],
//     'Bangladesh': [
      
//     ],
//     Ireland: [
      
//     ],
//     Netherlands: [

//     ],
//     Zimbabwe: [

//     ]
//   };

//   const availablePlayers = selectedCountry ? playersByCountry[selectedCountry] || [] : [];

//   const handleSubmit = (e) => {
//   e.preventDefault();

//   if (selectedCountry && selectedPlayer && selectedMatchType) {
//     navigate('/prediction', {
//       state: {
//         country: selectedCountry,
//         playerName: selectedPlayer,
//         matchType: selectedMatchType,
//       },
//     });
//   }
// };

//   return (
//     <div style={{ maxWidth: '100%' }}>
//       <Navbar />
      
//       <div style={{ marginTop: '40px', marginBottom: '32px' }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
//           <div className="brand-icon" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
//             <Users size={18} />
//           </div>
//           <h1 className="page-title" style={{ margin: 0 }}>Player Analysis</h1>
//         </div>
//         <p className="page-subtitle">Deep dive into player statistics and predictive performance metrics.</p>
//       </div>

//       <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
//         <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '48px', position: 'relative', overflow: 'hidden' }}>
//           {/* Decorative elements */}
//           <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--primary-glow)', filter: 'blur(40px)', opacity: 0.5 }}></div>
          
//           <div style={{ textAlign: 'center', marginBottom: '40px' }}>
//             <span className="ml-tag" style={{ justifyContent: 'center', marginBottom: '16px' }}>
//               <Brain size={14} /> AI Engine Active
//             </span>
//             <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '12px' }}>Intelligence Input</h2>
//             <p style={{ color: 'var(--text-muted)' }}>Configure the parameters for the neural network analysis.</p>
//           </div>

//           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
//             <div className="form-group">
//               <label style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <Globe size={18} color="var(--primary)" /> Select Country
//               </label>
//               <div className="input-wrapper" style={{ paddingLeft: 0 }}>
//                 <select
//                   value={selectedCountry}
//                   onChange={(e) => {
//                     setSelectedCountry(e.target.value);
//                     setSelectedPlayer('');
//                   }}
//                   style={{
//                     width: '100%',
//                     padding: '14px 16px',
//                     borderRadius: '12px',
//                     border: '1px solid var(--panel-border)',
//                     background: 'rgba(0, 0, 0, 0.2)',
//                     color: 'var(--text-main)',
//                     fontSize: '1rem',
//                     fontFamily: 'inherit',
//                     outline: 'none',
//                     cursor: 'pointer',
//                     appearance: 'none',
//                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//                     backgroundRepeat: 'no-repeat',
//                     backgroundPosition: 'right 16px center',
//                     backgroundSize: '18px'
//                   }}
//                 >
//                   value={selectedCountry}
//                   onChange={(e) => {
//                    setSelectedCountry(e.target.value);
//                   setSelectedPlayer('');
//                    }}

//                   <option value="">
//                     {countriesLoading ? 'Loading countries...' : 'Choose a national team...'}
//                   </option>

//                   {countries.map((country) => (
//                     <option key={country} value={country}>
//                       {country}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="form-group">
//               <label style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <Target size={18} color="var(--primary)" /> Player Name
//               </label>
//               <div className="input-wrapper" style={{ paddingLeft: 0 }}>
//                 <select
//                   value={selectedPlayer}
//                   onChange={(e) => setSelectedPlayer(e.target.value)}
//                   disabled={!selectedCountry}
//                   style={{
//                     width: '100%',
//                     padding: '14px 16px',
//                     borderRadius: '12px',
//                     border: '1px solid var(--panel-border)',
//                     background: selectedCountry ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
//                     color: selectedCountry ? 'var(--text-main)' : 'var(--text-muted)',
//                     fontSize: '1rem',
//                     fontFamily: 'inherit',
//                     outline: 'none',
//                     cursor: selectedCountry ? 'pointer' : 'not-allowed',
//                     opacity: selectedCountry ? 1 : 0.6,
//                     appearance: 'none',
//                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//                     backgroundRepeat: 'no-repeat',
//                     backgroundPosition: 'right 16px center',
//                     backgroundSize: '18px'
//                   }}
//                 >
//                   <option value="">{selectedCountry ? 'Choose a player...' : 'Select country first...'}</option>
//                   {availablePlayers.map((player) => (
//                     <option key={player.id} value={player.name}>{player.name}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="form-group">
//               <label style={{ color: 'var(--text-main)', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <Activity size={18} color="var(--primary)" /> Match Type
//               </label>
//               <div className="input-wrapper" style={{ paddingLeft: 0 }}>
//                 <select
//                   value={selectedMatchType}
//                   onChange={(e) => setSelectedMatchType(e.target.value)}
//                   disabled={!selectedPlayer}
//                   style={{
//                     width: '100%',
//                     padding: '14px 16px',
//                     borderRadius: '12px',
//                     border: '1px solid var(--panel-border)',
//                     background: selectedPlayer ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
//                     color: selectedPlayer ? 'var(--text-main)' : 'var(--text-muted)',
//                     fontSize: '1rem',
//                     fontFamily: 'inherit',
//                     outline: 'none',
//                     cursor: selectedPlayer ? 'pointer' : 'not-allowed',
//                     opacity: selectedPlayer ? 1 : 0.6,
//                     appearance: 'none',
//                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238b949e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
//                     backgroundRepeat: 'no-repeat',
//                     backgroundPosition: 'right 16px center',
//                     backgroundSize: '18px'
//                   }}
//                 >
//                   <option value="">{selectedPlayer ? 'Choose format...' : 'Select player first...'}</option>
//                   {matchTypes.map((type) => (
//                     <option key={type} value={type}>{type}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={!selectedCountry || !selectedPlayer || !selectedMatchType}
//               className="btn btn-primary"
//               style={{
//                 width: '100%',
//                 padding: '16px',
//                 fontSize: '1.1rem',
//                 justifyContent: 'center',
//                 marginTop: '12px',
//                 borderRadius: '12px',
//                 opacity: (!selectedCountry || !selectedPlayer || !selectedMatchType) ? 0.5 : 1
//               }}
//             >
//               Start Analysis Engine
//             </button>
//           </form>

//           {selectedCountry && selectedPlayer && (
//             <div style={{
//               marginTop: '32px',
//               padding: '20px',
//               borderRadius: '16px',
//               background: 'rgba(0, 210, 255, 0.05)',
//               border: '1px solid rgba(0, 210, 255, 0.1)',
//               animation: 'fadeInUp 0.4s ease-out'
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                 <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-dark)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
//                   {selectedPlayer.split(' ').map(n => n[0]).join('')}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Selected Target</div>
//                   <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)' }}>
//                     {selectedPlayer} <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.9rem' }}>• {countries.find(c => c.code === selectedCountry)?.name} ({selectedMatchType})</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       <style>{`
//         @keyframes fadeInUp {
//           from { opacity: 0; transform: translateY(10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         select option {
//           background-color: #0a0c10;
//           color: #f0f6fc;
//           padding: 12px;
//         }

//         .form-group:focus-within label {
//           color: var(--primary);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Player;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Globe, Target, Brain, Activity } from 'lucide-react';
import Navbar from './Navbar';

const API_URL = 'http://localhost:5002';
const MATCH_TYPES = ['T20I', 'ODI', 'Test'];

const Player = () => {
  const navigate = useNavigate();

  const [countries, setCountries] = useState([]);
  const [players, setPlayers] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedMatchType, setSelectedMatchType] = useState('');

  const [countriesLoading, setCountriesLoading] = useState(true);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setCountriesLoading(true);

        const response = await fetch(`${API_URL}/api/countries`);

        if (!response.ok) {
          throw new Error('Failed to load countries');
        }

        const data = await response.json();

        setCountries(
          data
            .map((country) =>
              typeof country === 'string' ? country : country.name
            )
            .filter(Boolean)
        );
      } catch (fetchError) {
        console.error('Failed to load countries:', fetchError);
        setError('Unable to load countries.');
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // This is where the player-fetching snippet belongs.
  useEffect(() => {
    if (!selectedCountry) {
      setPlayers([]);
      return;
    }

    const fetchPlayers = async () => {
      try {
        setPlayersLoading(true);
        setError('');

        const response = await fetch(
          `${API_URL}/api/players?country=${encodeURIComponent(
            selectedCountry
          )}`
        );

        if (!response.ok) {
          throw new Error('Failed to load players');
        }

        const playerNames = await response.json();

        setPlayers(
          playerNames
            .map((player) =>
              typeof player === 'string' ? player : player.name
            )
            .filter(Boolean)
        );
      } catch (fetchError) {
        console.error('Failed to load players:', fetchError);
        setPlayers([]);
        setError(`Unable to load players for ${selectedCountry}.`);
      } finally {
        setPlayersLoading(false);
      }
    };

    fetchPlayers();
  }, [selectedCountry]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
    setSelectedPlayer('');
    setSelectedMatchType('');
  };

  const handlePlayerChange = (event) => {
    setSelectedPlayer(event.target.value);
    setSelectedMatchType('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!selectedCountry || !selectedPlayer || !selectedMatchType) {
      return;
    }

    navigate('/prediction', {
      state: {
        country: selectedCountry,
        playerName: selectedPlayer,
        matchType: selectedMatchType,
      },
    });
  };

  const selectStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid var(--panel-border)',
    background: 'rgba(0, 0, 0, 0.2)',
    color: 'var(--text-main)',
    fontSize: '1rem',
    fontFamily: 'inherit',
    outline: 'none',
  };

  const canChooseMatchType = Boolean(selectedPlayer);
  const canSubmit = Boolean(
    selectedCountry && selectedPlayer && selectedMatchType
  );

  return (
    <div style={{ maxWidth: '100%' }}>
      <Navbar />

      <div style={{ marginTop: '40px', marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
          }}
        >
          <div
            className="brand-icon"
            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
          >
            <Users size={18} />
          </div>

          <h1 className="page-title" style={{ margin: 0 }}>
            Player Analysis
          </h1>
        </div>

        <p className="page-subtitle">
          Deep dive into player statistics and predictive performance metrics.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'var(--primary-glow)',
              filter: 'blur(40px)',
              opacity: 0.5,
            }}
          />

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span
              className="ml-tag"
              style={{ justifyContent: 'center', marginBottom: '16px' }}
            >
              <Brain size={14} /> AI Engine Active
            </span>

            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                color: 'var(--text-main)',
                marginBottom: '12px',
              }}
            >
              Intelligence Input
            </h2>

            <p style={{ color: 'var(--text-muted)' }}>
              Configure the parameters for the neural network analysis.
            </p>
          </div>

          {error && (
            <p style={{ color: '#e94057', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
          >
            <div className="form-group">
              <label
                style={{
                  color: 'var(--text-main)',
                  fontWeight: '600',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Globe size={18} color="var(--primary)" />
                Select Country
              </label>

              <select
                value={selectedCountry}
                onChange={handleCountryChange}
                disabled={countriesLoading}
                style={{
                  ...selectStyle,
                  opacity: countriesLoading ? 0.6 : 1,
                }}
              >
                <option value="">
                  {countriesLoading
                    ? 'Loading countries...'
                    : 'Choose a national team...'}
                </option>

                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label
                style={{
                  color: 'var(--text-main)',
                  fontWeight: '600',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Target size={18} color="var(--primary)" />
                Player Name
              </label>

              <select
                value={selectedPlayer}
                onChange={handlePlayerChange}
                disabled={!selectedCountry || playersLoading}
                style={{
                  ...selectStyle,
                  opacity:
                    !selectedCountry || playersLoading ? 0.6 : 1,
                  cursor:
                    !selectedCountry || playersLoading
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                <option value="">
                  {!selectedCountry
                    ? 'Select country first...'
                    : playersLoading
                      ? 'Loading players...'
                      : players.length === 0
                        ? 'No players found...'
                        : 'Choose a player...'}
                </option>

                {players.map((player) => (
                  <option key={player} value={player}>
                    {player}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label
                style={{
                  color: 'var(--text-main)',
                  fontWeight: '600',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Activity size={18} color="var(--primary)" />
                Match Type
              </label>

              <select
                value={selectedMatchType}
                onChange={(event) =>
                  setSelectedMatchType(event.target.value)
                }
                disabled={!canChooseMatchType}
                style={{
                  ...selectStyle,
                  opacity: canChooseMatchType ? 1 : 0.6,
                  cursor: canChooseMatchType ? 'pointer' : 'not-allowed',
                }}
              >
                <option value="">
                  {canChooseMatchType
                    ? 'Choose format...'
                    : 'Select player first...'}
                </option>

                {MATCH_TYPES.map((matchType) => (
                  <option key={matchType} value={matchType}>
                    {matchType}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '1.1rem',
                justifyContent: 'center',
                marginTop: '12px',
                borderRadius: '12px',
                opacity: canSubmit ? 1 : 0.5,
              }}
            >
              Start Analysis Engine
            </button>
          </form>

          {selectedCountry && selectedPlayer && (
            <div
              style={{
                marginTop: '32px',
                padding: '20px',
                borderRadius: '16px',
                background: 'rgba(0, 210, 255, 0.05)',
                border: '1px solid rgba(0, 210, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--bg-dark)',
                    border: '2px solid var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'var(--primary)',
                  }}
                >
                  {selectedPlayer
                    .split(' ')
                    .map((name) => name[0])
                    .join('')}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      marginBottom: '2px',
                    }}
                  >
                    Selected Target
                  </div>

                  <div
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: 'var(--text-main)',
                    }}
                  >
                    {selectedPlayer}{' '}
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        fontWeight: '400',
                        fontSize: '0.9rem',
                      }}
                    >
                      • {selectedCountry} ({selectedMatchType})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
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