import React from'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';
import WinPredictor from './components/WinPredictor';
import Player from './components/Player';
import Prediction from './components/Prediction';
import MatchPreviewReview from './components/MatchPreviewReview';
import Lineups from './components/Lineups';

import NewsCurator from './components/NewsCurator';

// Layout Component
const MainLayout = ({ children }) => (
  <div className="app-container">
    <Sidebar />

    <main className="main-content">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />
        
        {/* Main App Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />

        <Route path="/player" element={
          <MainLayout>
            <Player />
          </MainLayout>
        } />
        <Route path="/matchpreviewreview" element={
          <MainLayout>
            <MatchPreviewReview />
          </MainLayout>
        } />
        {/* Add this inside your <Routes> */}
        <Route path="/lineups" element={
          <MainLayout>
            <Lineups />
          </MainLayout>
        } />
        <Route path="/prediction" element={
          <MainLayout>
            <Prediction />
          </MainLayout>
        } />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/settings" element={
          <MainLayout>
            <Settings />
          </MainLayout>
        } />

        <Route path="/predictor" element={
          <MainLayout>
            <WinPredictor />
          </MainLayout>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
