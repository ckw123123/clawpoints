import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return {
    user: null,
    loading: false,
    signOut: () => {},
    isAdmin: false,
    isSales: false,
    userRole: 'member',
    canManageUsers: false,
    canManageMembers: false
  };
};

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};
