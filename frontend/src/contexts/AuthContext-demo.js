import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo version with mock data
export const AuthProvider = ({ children, user, signOut }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSales, setIsSales] = useState(false);
  const [userRole, setUserRole] = useState('member');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Determine user role based on username
      let role = 'member';
      let adminStatus = false;
      let salesStatus = false;
      
      if (user.username === 'demoadmin') {
        role = 'admin';
        adminStatus = true;
      } else if (user.username === 'demosales') {
        role = 'sales';
        salesStatus = true;
      }

      // Mock user profile data
      const mockProfile = {
        id: user.userId,
        username: user.username,
        name: user.attributes.name,
        email: user.attributes.email,
        points: role === 'member' ? 1250 : 5000,
        gender: 'male',
        birthday: '1990-01-01',
        phone: '+1234567890',
        role: role
      };

      setUserProfile(mockProfile);
      setIsAdmin(adminStatus);
      setIsSales(salesStatus);
      setUserRole(role);
    }
    setLoading(false);
  }, [user]);

  const value = {
    user,
    userProfile,
    isAdmin,
    isSales,
    userRole,
    signOut,
    loading,
    setUserProfile,
    // Convenience getters
    isStaff: isAdmin || isSales, // Admin or Sales
    canManageUsers: isAdmin, // Only Admin can manage users
    canManageMembers: isAdmin || isSales, // Both can manage members
    canManagePrizes: isAdmin || isSales, // Both can manage prizes
    canManageItems: isAdmin || isSales // Both can manage items
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};