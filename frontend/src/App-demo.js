import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout-original';
import Home from './pages/Home-demo';
import Records from './pages/Records-demo';
import Profile from './pages/Profile-demo';
import AdminDashboard from './pages/AdminDashboard-demo';
import DemoAuthenticator from './components/DemoAuthenticator';
import { LanguageProvider } from './contexts/LanguageContext';
import { SharedDataProvider } from './contexts/SharedDataContext-demo';

// Demo Routes Component
const DemoRoutes = () => {
  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={
        <Layout>
          <Home />
        </Layout>
      } />
      <Route path="/records" element={
        <Layout>
          <Records />
        </Layout>
      } />
      <Route path="/profile" element={
        <Layout>
          <Profile />
        </Layout>
      } />
      <Route path="/admin" element={
        <Layout>
          <AdminDashboard />
        </Layout>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Demo App with full functionality
function App() {
  return (
    <LanguageProvider>
      <SharedDataProvider>
        <Router>
          <DemoAuthenticator>
            <DemoRoutes />
          </DemoAuthenticator>
        </Router>
      </SharedDataProvider>
    </LanguageProvider>
  );
}

export default App;