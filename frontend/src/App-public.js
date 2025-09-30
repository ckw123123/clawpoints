import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Records from './pages/Records';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard-public';
import Login from './pages/Login-public';
import SignUp from './pages/SignUp-public';
import { AuthProvider, useAuth } from './contexts/AuthContext-public';
import { SettingsProvider } from './contexts/SettingsContext-demo';
import { LanguageProvider } from './contexts/LanguageContext';
import { SharedDataProvider } from './contexts/SharedDataContext-public';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <Navigate to="/" replace /> : children;
};

// Demo Banner Component
const DemoBanner = () => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 text-center text-sm">
    <div className="flex items-center justify-center space-x-2">
      <span>🚀</span>
      <span><strong>Public Demo</strong> - Full production features with simulated backend</span>
      <span>•</span>
      <span>Try: admin/demo123, sales/demo123, member/demo123</span>
    </div>
  </div>
);

// App Routes Component
const AppRoutes = () => {
  return (
    <>
      <DemoBanner />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        } />
        
        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/records" element={
          <ProtectedRoute>
            <Layout>
              <Records />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// Public Demo App
function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SharedDataProvider>
          <SettingsProvider>
            <Router>
              <AppRoutes />
            </Router>
          </SettingsProvider>
        </SharedDataProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;