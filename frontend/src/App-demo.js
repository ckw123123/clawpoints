import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout-restored';
import Home from './pages/Home-demo';
import Records from './pages/Records-demo';
import Profile from './pages/Profile-demo';
import AdminDashboard from './pages/AdminDashboard-demo';
import DemoAuthenticator from './components/DemoAuthenticator';
import RoleBasedRedirect from './components/RoleBasedRedirect';
import { LanguageProvider } from './contexts/LanguageContext';
import { SharedDataProvider } from './contexts/SharedDataContext-demo';

// Demo Routes Component with role-based routing
const DemoRoutes = () => {
  return (
    <Routes>
      {/* Main Routes - Only for Members */}
      <Route path="/" element={
        <RoleBasedRedirect>
          <Layout>
            <Home />
          </Layout>
        </RoleBasedRedirect>
      } />
      <Route path="/records" element={
        <RoleBasedRedirect>
          <Layout>
            <Records />
          </Layout>
        </RoleBasedRedirect>
      } />
      <Route path="/profile" element={
        <RoleBasedRedirect>
          <Layout>
            <Profile />
          </Layout>
        </RoleBasedRedirect>
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