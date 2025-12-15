import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      if (authService.isAuthenticated()) {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      }
    } catch (err) {
      console.error('Error loading user:', err);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, motDePasse) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login(email, motDePasse);
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      return await authService.register(userData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
  }, []);

  const updateUser = useCallback(async (userData) => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const updatedUser = await userService.updateUser(currentUser.id, userData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
