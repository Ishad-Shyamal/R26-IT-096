import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Contact from './components/Contact';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';
import Player from './components/Player';
import Prediction from './components/Prediction';

// A layout component for pages that need the sidebar
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
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={
          <MainLayout>
            <Settings />
          </MainLayout>
        } />
        <Route path="/player" element={
          <MainLayout>
            <Player />
          </MainLayout>
        } />
        <Route path="/prediction" element={
          <MainLayout>
            <Prediction />
          </MainLayout>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
