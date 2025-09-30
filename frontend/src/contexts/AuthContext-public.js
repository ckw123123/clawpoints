import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo users for public testing
const DEMO_USERS = {
  admin: {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@clawpoints.com',
    name: 'Demo Admin',
    role: 'admin',
    points: 0,
    phone: '+852 9876 5432'
  },
  sales: {
    id: 'sales-1',
    username: 'sales',
    email: 'sales@clawpoints.com',
    name: 'Demo Sales',
    role: 'sales',
    points: 0,
    phone: '+852 9876 5433'
  },
  member: {
    id: 'member-1',
    username: 'member',
    email: 'member@clawpoints.com',
    name: 'Demo Member',
    role: 'member',
    points: 1250,
    phone: '+852 9876 5434'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('demo-auth-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('demo-auth-user');
      }
    }
  }, []);

  const signIn = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check demo credentials
      const demoUser = DEMO_USERS[username.toLowerCase()];
      const validPasswords = ['demo123', 'admin123', 'sales123', 'member123', password];
      
      if (demoUser && validPasswords.includes(password)) {
        setUser(demoUser);
        localStorage.setItem('demo-auth-user', JSON.stringify(demoUser));
        setLoading(false);
        return demoUser;
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In demo mode, just show success message
      setLoading(false);
      return { 
        message: 'Demo: Account created successfully! In production, you would receive an email confirmation.',
        needsConfirmation: true,
        username: userData.username
      };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const confirmSignUp = async (username, code) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In demo mode, accept any 6-digit code
      if (code.length === 6) {
        setLoading(false);
        return { message: 'Demo: Account confirmed! You can now sign in.' };
      } else {
        throw new Error('Please enter a 6-digit confirmation code');
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('demo-auth-user');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const getToken = async () => {
    // Return demo token
    return user ? 'demo-jwt-token-' + user.id : null;
  };

  const updateUserAttributes = async (attributes) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local user state
      const updatedUser = { ...user };
      attributes.forEach(attr => {
        if (attr.Name === 'email') updatedUser.email = attr.Value;
        if (attr.Name === 'name') updatedUser.name = attr.Value;
        if (attr.Name === 'phone_number') updatedUser.phone = attr.Value;
        if (attr.Name === 'custom:points') updatedUser.points = parseInt(attr.Value);
      });
      
      setUser(updatedUser);
      localStorage.setItem('demo-auth-user', JSON.stringify(updatedUser));
      setLoading(false);
      
      return { message: 'Demo: Profile updated successfully!' };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoading(false);
      return { message: 'Demo: Password changed successfully!' };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Role-based access control
  const isAdmin = user?.role === 'admin';
  const isSales = user?.role === 'sales';
  const isMember = user?.role === 'member';
  const canManageUsers = isAdmin;
  const canManageMembers = isAdmin || isSales;
  const canViewReports = isAdmin || isSales;

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    getToken,
    updateUserAttributes,
    changePassword,
    
    // Role checks
    isAdmin,
    isSales,
    isMember,
    canManageUsers,
    canManageMembers,
    canViewReports,
    
    // User role for display
    userRole: user?.role || 'guest',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};