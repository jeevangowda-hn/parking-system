import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAuthService } from '../services/mockAuthService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    async function loadSession() {
      try {
        const currentUser = await mockAuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Failed to restore session', err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  const login = async (email, password) => {
    const { user: loggedInUser } = await mockAuthService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (name, email, password) => {
    const { user: registeredUser } = await mockAuthService.register(name, email, password);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    await mockAuthService.logout();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (!user) return null;
    const updated = await mockAuthService.updateProfile(user.id, updates);
    setUser(updated);
    return updated;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

