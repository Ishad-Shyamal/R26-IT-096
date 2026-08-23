import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Contact from './components/Contact';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';
import MatchPreviewReview from './components/MatchPreviewReview';
import Lineups from './components/Lineups';

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
      <Routes>
        <Route path="/home" element={<Home />} /> {/* <-- ADD THIS ROUTE HERE */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        } />
        
        <Route path="/about" element={
          <MainLayout>
            <About />
          </MainLayout>
        } />

        <Route path="/match-previews" element={
          <MainLayout>
            <MatchPreviewReview />
          </MainLayout>
        } />
        
        <Route path="/lineups" element={
          <MainLayout>
            <Lineups />
          </MainLayout>
        } />

        <Route path="/contact" element={
          <MainLayout>
            <Contact />
          </MainLayout>
        } />

        <Route path="/settings" element={
          <MainLayout>
            <Settings />
          </MainLayout>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;