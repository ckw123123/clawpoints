import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext-demo';
import Home from '../pages/Home';

const HomeRedirect = () => {
  const { isAdmin, isSales } = useAuth();
  
  // Redirect Admin and Sales users to admin dashboard
  if (isAdmin || isSales) {
    return <Navigate to="/admin" replace />;
  }
  
  // Show regular home page for members
  return <Home />;
};

export default HomeRedirect;