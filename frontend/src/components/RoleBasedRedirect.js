import { Navigate } from 'react-router-dom';
import { useDemoAuth } from './DemoAuthenticator';

const RoleBasedRedirect = ({ children }) => {
  const { isAdmin, isSales } = useDemoAuth();
  
  // Admin and Sales users should go directly to admin dashboard
  // They don't need Home, Records, Profile pages
  if (isAdmin || isSales) {
    return <Navigate to="/admin" replace />;
  }
  
  // Members see the normal pages
  return children;
};

export default RoleBasedRedirect;