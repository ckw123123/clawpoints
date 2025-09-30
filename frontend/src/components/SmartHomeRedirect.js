import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext-public';
import Home from '../pages/Home';

const SmartHomeRedirect = () => {
  const { user, isAdmin, isSales } = useAuth();

  // Redirect Admin and Sales to Admin Dashboard
  if (isAdmin || isSales) {
    return <Navigate to="/admin" replace />;
  }

  // Show Home page for Members
  return <Home />;
};

export default SmartHomeRedirect;