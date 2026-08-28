// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
// import Navbar from './Navbar';

// const API_URL = 'http://localhost:5002';

// const DETAIL_FIELDS = [
//   {
//     label: 'Predicted Next Match Runs',
//     keys: [
//       'predicted_next_match_runs',
//       'Predicted_Next_Match_Runs'
//     ]
//   },
//   {
//     label: 'Predicted Next Match Wickets',
//     keys: [
//       'predicted_next_match_wickets',
//       'Predicted_Next_Match_Wickets'
//     ]
//   },
//   {
//     label: 'Predicted Next Match Wides',
//     keys: [
//       'predicted_next_match_wides',
//       'Predicted_Next_Match_Wides'
//     ]
//   },
//   {
//     label: 'Predicted Next Match Catches',
//     keys: [
//       'predicted_next_match_catches',
//       'Predicted_Next_Match_Catches'
//     ]
//   },
//   {
//     label: 'Predicted Next Match Fours',
//     keys: [
//       'predicted_next_match_fours',
//       'Predicted_Next_Match_Fours'
//     ]
//   },
//   {
//     label: 'Predicted Next Match Sixes',
//     keys: [
//       'predicted_next_match_sixes',
//       'Predicted_Next_Match_Sixes'
//     ]
//   },
//   {
//     label: 'Powerplay Strike Rate',
//     keys: [
//       'powerplay_strike_rate',
//       'Powerplay_Batting_SR'
//     ]
//   },
//   {
//     label: 'Clutch Rate Index Pct',
//     keys: [
//       'clutch_rate_index_pct',
//       'Clutch_Rate',
//       'Clutch_Rate_Index_Pct'
//     ]
//   }
// ];

// const getPredictionValue = (prediction, keys) => {
//   const predictionKeys = Object.keys(prediction);

//   const matchingKey = predictionKeys.find((predictionKey) =>
//     keys.some(
//       (key) => predictionKey.toLowerCase() === key.toLowerCase()
//     )
//   );

//   if (!matchingKey) {
//     return 'N/A';
//   }

//   const value = prediction[matchingKey];

//   return value === null || value === undefined || value === ''
//     ? 'N/A'
//     : value;
// };

// const Prediction = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { country, playerName, matchType } = location.state || {};

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [prediction, setPrediction] = useState(null);

//   useEffect(() => {
//     if (!country || !playerName || !matchType) {
//       navigate('/player');
//       return;
//     }

//     const fetchPrediction = async () => {
//       try {
//         setLoading(true);
//         setError('');

//         const response = await axios.post(`${API_URL}/api/predict`, {
//           country,
//           playerName,
//           category: matchType
//         });

//         if (response.data?.status !== 'success') {
//           throw new Error(
//             response.data?.message || 'Prediction data was not found'
//           );
//         }

//         setPrediction(response.data.prediction);
//       } catch (fetchError) {
//         console.error('Prediction error:', fetchError);

//         setError(
//           fetchError.response?.data?.message ||
//             fetchError.message ||
//             'Unable to load prediction details.'
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPrediction();
//   }, [country, playerName, matchType, navigate]);

//   if (loading) {
//     return (
//       <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
//         <Navbar />

//         <div
//           style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             height: '80vh'
//           }}
//         >
//           <Loader2
//             size={48}
//             color="var(--primary)"
//             className="animate-spin"
//           />

//           <p
//             style={{
//               marginTop: '20px',
//               color: 'var(--text-muted)',
//               fontSize: '1.1rem'
//             }}
//           >
//             Loading prediction details...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !prediction) {
//     return (
//       <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
//         <Navbar />

//         <div
//           style={{
//             maxWidth: '600px',
//             margin: '80px auto',
//             padding: '40px 20px'
//           }}
//         >
//           <div
//             className="glass-panel"
//             style={{
//               padding: '32px',
//               textAlign: 'center',
//               border: '1px solid rgba(233, 64, 87, 0.3)'
//             }}
//           >
//             <AlertCircle
//               size={48}
//               color="#e94057"
//               style={{ marginBottom: '20px' }}
//             />

//             <h2 style={{ color: '#fff', marginBottom: '16px' }}>
//               Prediction Unavailable
//             </h2>

//             <p
//               style={{
//                 color: 'var(--text-muted)',
//                 marginBottom: '28px'
//               }}
//             >
//               {error || 'No prediction details were found.'}
//             </p>

//             <button
//               className="btn btn-primary"
//               onClick={() => navigate('/player')}
//             >
//               Return to Player Selection
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         maxWidth: '1200px',
//         margin: '0 auto',
//         padding: '20px 20px 60px'
//       }}
//     >
//       <Navbar />

//       <div style={{ marginTop: '20px', marginBottom: '24px' }}>
//         <button
//           onClick={() => navigate('/player')}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             marginBottom: '20px',
//             border: 'none',
//             background: 'transparent',
//             color: 'var(--text-muted)',
//             cursor: 'pointer'
//           }}
//         >
//           <ChevronLeft size={18} />
//           Back to Player Selection
//         </button>

//         <h1
//           style={{
//             margin: 0,
//             color: '#fff',
//             fontSize: '2rem',
//             fontWeight: '800'
//           }}
//         >
//           {playerName}
//         </h1>

//         <p
//           style={{
//             color: 'var(--text-muted)',
//             marginTop: '8px'
//           }}
//         >
//           {country} - {matchType}
//         </p>
//       </div>

//       <div
//         className="glass-panel"
//         style={{
//           padding: '28px',
//           borderRadius: '16px'
//         }}
//       >
//         <h2
//           style={{
//             color: '#fff',
//             marginTop: 0,
//             marginBottom: '24px'
//           }}
//         >
//           Predicted Next Match Details
//         </h2>

//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
//             gap: '16px'
//           }}
//         >
//           {DETAIL_FIELDS.map((field) => (
//             <div
//               key={field.label}
//               style={{
//                 padding: '18px',
//                 borderRadius: '10px',
//                 background: 'rgba(255, 255, 255, 0.05)',
//                 border: '1px solid rgba(255, 255, 255, 0.1)'
//               }}
//             >
//               <div
//                 style={{
//                   color: 'var(--text-muted)',
//                   fontSize: '0.82rem',
//                   marginBottom: '10px'
//                 }}
//               >
//                 {field.label}
//               </div>

//               <div
//                 style={{
//                   color: '#fff',
//                   fontSize: '1.25rem',
//                   fontWeight: '700',
//                   overflowWrap: 'anywhere'
//                 }}
//               >
//                 {getPredictionValue(prediction, field.keys)}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <style>{`
//         .animate-spin {
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }

//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Prediction;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  XCircle
} from 'lucide-react';
import Navbar from './Navbar';

const API_URL = 'http://localhost:5002';

const DETAIL_FIELDS = [
  {
    label: 'Predicted Next Match Runs',
    keys: ['predicted_next_match_runs', 'Predicted_Next_Match_Runs']
  },
  {
    label: 'Predicted Next Match Wickets',
    keys: ['predicted_next_match_wickets', 'Predicted_Next_Match_Wickets']
  },
  {
    label: 'Predicted Next Match Wides',
    keys: ['predicted_next_match_wides', 'Predicted_Next_Match_Wides']
  },
  {
    label: 'Predicted Next Match Catches',
    keys: ['predicted_next_match_catches', 'Predicted_Next_Match_Catches']
  },
  {
    label: 'Predicted Next Match Fours',
    keys: ['predicted_next_match_fours', 'Predicted_Next_Match_Fours']
  },
  {
    label: 'Predicted Next Match Sixes',
    keys: ['predicted_next_match_sixes', 'Predicted_Next_Match_Sixes']
  },
  {
    label: 'Powerplay Strike Rate',
    keys: ['powerplay_strike_rate', 'Powerplay_Batting_SR']
  },
  {
    label: 'Clutch Rate Index Pct',
    keys: [
      'clutch_rate_index_pct',
      'Clutch_Rate',
      'Clutch_Rate_Index_Pct'
    ]
  }
];

const getPredictionValue = (prediction, keys) => {
  const predictionKeys = Object.keys(prediction);

  const matchingKey = predictionKeys.find((predictionKey) =>
    keys.some((key) => predictionKey.toLowerCase() === key.toLowerCase())
  );

  if (!matchingKey) {
    return 'N/A';
  }

  const value = prediction[matchingKey];

  return value === null || value === undefined || value === ''
    ? 'N/A'
    : value;
};

const formatValidationValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    String(value).toLowerCase().startsWith('n/a')
  ) {
    return 'N/A';
  }

  return value;
};

const getValidationStatus = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase();

  if (normalizedValue === 'yes') {
    return {
      label: 'Close',
      color: '#00e676',
      icon: <CheckCircle2 size={16} />
    };
  }

  if (normalizedValue === 'no') {
    return {
      label: 'Not Close',
      color: '#e94057',
      icon: <XCircle size={16} />
    };
  }

  return {
    label: 'N/A',
    color: 'var(--text-muted)',
    icon: null
  };
};

const Prediction = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { country, playerName, matchType } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);

  const [validationLoading, setValidationLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [validationResults, setValidationResults] = useState([]);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (!country || !playerName || !matchType) {
      navigate('/player');
      return;
    }

    const fetchPrediction = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await axios.post(`${API_URL}/api/predict`, {
          country,
          playerName,
          category: matchType
        });

        if (response.data?.status !== 'success') {
          throw new Error(
            response.data?.message || 'Prediction data was not found'
          );
        }

        setPrediction(response.data.prediction);
      } catch (fetchError) {
        console.error('Prediction error:', fetchError);

        setError(
          fetchError.response?.data?.message ||
            fetchError.message ||
            'Unable to load prediction details.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [country, playerName, matchType, navigate]);

  const handleValidation = async () => {
    try {
      setValidationLoading(true);
      setValidationError('');
      setShowValidation(true);

      const response = await axios.get(`${API_URL}/api/validation`, {
        params: {
          country,
          playerName,
          category: matchType
        }
      });

      if (response.data?.status !== 'success') {
        throw new Error(
          response.data?.message || 'Validation data was not found'
        );
      }

      setValidationResults(response.data.validation || []);
    } catch (validationRequestError) {
      console.error('Validation error:', validationRequestError);

      setValidationResults([]);
      setValidationError(
        validationRequestError.response?.data?.message ||
          validationRequestError.message ||
          'Unable to load validation results.'
      );
    } finally {
      setValidationLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <Navbar />

        <div className="loading-container">
          <Loader2
            size={48}
            color="var(--primary)"
            className="animate-spin"
          />

          <p>Loading prediction details...</p>
        </div>
      </div>
    );
  }

  if (error || !prediction) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <Navbar />

        <div className="error-wrapper">
          <div className="glass-panel error-panel">
            <AlertCircle size={48} color="#e94057" />

            <h2>Prediction Unavailable</h2>

            <p>{error || 'No prediction details were found.'}</p>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/player')}
            >
              Return to Player Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prediction-page">
      <Navbar />

      <div className="prediction-header">
        <button
          className="back-button"
          onClick={() => navigate('/player')}
        >
          <ChevronLeft size={18} />
          Back to Player Selection
        </button>

        <h1>{playerName}</h1>

        <p>
          {country} - {matchType}
        </p>
      </div>

      <div className="glass-panel prediction-panel">
        <h2>Predicted Next Match Details</h2>

        <div className="details-grid">
          {DETAIL_FIELDS.map((field) => (
            <div className="detail-item" key={field.label}>
              <div className="detail-label">{field.label}</div>

              <div className="detail-value">
                {getPredictionValue(prediction, field.keys)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel validation-panel">
        <div className="validation-header">
          <div>
            <h2>
              <BarChart3 size={22} color="var(--primary)" />
              Validation Comparison
            </h2>

            <p>
              Comparison with the latest actual match from the validation CSV
            </p>
          </div>

          <button
            className="btn btn-primary validation-button"
            onClick={handleValidation}
            disabled={validationLoading}
          >
            {validationLoading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Loading Validation...
              </>
            ) : (
              <>
                <BarChart3 size={17} />
                Validation
              </>
            )}
          </button>
        </div>

        {showValidation && (
          <div className="validation-content">
            {validationLoading && (
              <div className="validation-loading">
                <Loader2 size={20} className="animate-spin" />
                Loading comparison data...
              </div>
            )}

            {!validationLoading && validationError && (
              <div className="validation-error">
                <AlertCircle size={20} />
                {validationError}
              </div>
            )}

            {!validationLoading &&
              !validationError &&
              validationResults.map((result, resultIndex) => (
                <ValidationRecord
                  key={`${result.Player}-${result.Format}-${resultIndex}`}
                  result={result}
                />
              ))}
          </div>
        )}
      </div>

      <style>{`
        .prediction-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 20px 60px;
        }

        .prediction-header {
          margin-top: 20px;
          margin-bottom: 24px;
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
        }

        .prediction-header h1 {
          margin: 0;
          color: #fff;
          font-size: 2rem;
          font-weight: 800;
        }

        .prediction-header p {
          color: var(--text-muted);
          margin-top: 8px;
        }

        .prediction-panel,
        .validation-panel {
          padding: 28px;
          border-radius: 16px;
        }

        .validation-panel {
          margin-top: 24px;
        }

        .prediction-panel h2,
        .validation-panel h2 {
          color: #fff;
          margin-top: 0;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .detail-item,
        .summary-item {
          padding: 18px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .detail-label,
        .summary-label {
          color: var(--text-muted);
          font-size: 0.82rem;
          margin-bottom: 10px;
        }

        .detail-value {
          color: #fff;
          font-size: 1.25rem;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .validation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .validation-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .validation-header p {
          color: var(--text-muted);
          margin: 0;
        }

        .validation-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
        }

        .validation-content {
          margin-top: 24px;
        }

        .validation-loading,
        .validation-error {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
        }

        .validation-error {
          padding: 16px;
          color: #ff8a9b;
          background: rgba(233, 64, 87, 0.1);
          border: 1px solid rgba(233, 64, 87, 0.3);
          border-radius: 10px;
        }

        .validation-record {
          margin-bottom: 24px;
        }

        .validation-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .summary-value {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #fff;
          font-size: 1rem;
          font-weight: 700;
        }

        .table-wrapper {
          overflow-x: auto;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .validation-table {
          width: 100%;
          min-width: 680px;
          border-collapse: collapse;
          color: #fff;
        }

        .validation-table th,
        .validation-table td {
          padding: 14px;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .validation-table th {
          color: var(--text-muted);
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 80vh;
        }

        .loading-container p {
          margin-top: 20px;
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .error-wrapper {
          max-width: 600px;
          margin: 80px auto;
          padding: 40px 20px;
        }

        .error-panel {
          padding: 32px;
          text-align: center;
          border: 1px solid rgba(233, 64, 87, 0.3);
        }

        .error-panel h2 {
          color: #fff;
          margin: 16px 0;
        }

        .error-panel p {
          color: var(--text-muted);
          margin-bottom: 28px;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 600px) {
          .prediction-page {
            padding: 12px 12px 40px;
          }

          .prediction-panel,
          .validation-panel {
            padding: 18px;
          }

          .prediction-header h1 {
            font-size: 1.6rem;
          }

          .validation-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

const ValidationRecord = ({ result }) => {
  const runsStatus = getValidationStatus(result['Runs_Close_(+/-10)']);
  const wicketsStatus = getValidationStatus(
    result['Wickets_Close_(+/-1)']
  );

  const metrics = [
    {
      label: 'Runs',
      predicted: result.Predicted_Runs,
      actual: result.Actual_Runs,
      status: result['Runs_Close_(+/-10)']
    },
    {
      label: 'Fours',
      predicted: result.Predicted_Fours,
      actual: result.Actual_Fours
    },
    {
      label: 'Sixes',
      predicted: result.Predicted_Sixes,
      actual: result.Actual_Sixes
    },
    {
      label: 'Wickets',
      predicted: result.Predicted_Wickets,
      actual: result.Actual_Wickets,
      status: result['Wickets_Close_(+/-1)']
    },
    {
      label: 'Wides',
      predicted: result.Predicted_Wides,
      actual: result.Actual_Wides
    },
    {
      label: 'Catches',
      predicted: result.Predicted_Catches,
      actual: result.Actual_Catches
    }
  ];

  return (
    <div className="validation-record">
      <div className="validation-summary">
        <div className="summary-item">
          <div className="summary-label">Latest Match</div>
          <strong className="summary-value">
            {formatValidationValue(result.Latest_Match_Date)}
          </strong>
        </div>

        <div className="summary-item">
          <div className="summary-label">Runs Accuracy</div>
          <strong
            className="summary-value"
            style={{ color: runsStatus.color }}
          >
            {runsStatus.icon}
            {runsStatus.label}
          </strong>
        </div>

        <div className="summary-item">
          <div className="summary-label">Wickets Accuracy</div>
          <strong
            className="summary-value"
            style={{ color: wicketsStatus.color }}
          >
            {wicketsStatus.icon}
            {wicketsStatus.label}
          </strong>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="validation-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Predicted</th>
              <th>Actual</th>
              <th>Comparison</th>
            </tr>
          </thead>

          <tbody>
            {metrics.map((metric) => {
              const status = getValidationStatus(metric.status);

              return (
                <tr key={metric.label}>
                  <td>{metric.label}</td>
                  <td>{formatValidationValue(metric.predicted)}</td>
                  <td>{formatValidationValue(metric.actual)}</td>
                  <td style={{ color: status.color }}>
                    {metric.status ? status.label : 'Compared'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Prediction;