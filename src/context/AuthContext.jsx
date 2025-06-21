import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from "../services/authService";
import { completeGoogleRegistration, logoutGoogleUser } from "../services/googleAuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Fetch current user on mount
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Login handler
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setAuthError(null);
    try {
      await apiLogin(credentials);
      const user = await getCurrentUser();
      setUser(user);
      setAuthError(null);
      return user;
    } catch (err) {
      setAuthError(err.message || "Login failed");
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Register handler (optional, for completeness)
  const register = useCallback(async (data) => {
    setLoading(true);
    setAuthError(null);
    try {
      await apiRegister(data);
      const user = await getCurrentUser();
      setUser(user);
      setAuthError(null);
      return user;
    } catch (err) {
      setAuthError(err.message || "Registration failed");
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Google Registration handler
  const completeGoogleSignUp = useCallback(async (registrationData) => {
    setLoading(true);
    setAuthError(null);
    try {
      await completeGoogleRegistration(registrationData);
      const user = await getCurrentUser();
      setUser(user);
      setAuthError(null);
      return user;
    } catch (err) {
      setAuthError(err.message || "Google registration failed");
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Google authentication success (for existing users)
  const handleGoogleAuthSuccess = useCallback(async (userData) => {
    setLoading(true);
    try {
      // Ensure we always have a token in localStorage
      const token = localStorage.getItem('authToken');
      if (!token) {
        // Create a temporary token if needed
        const tempToken = 'google_auth_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('authToken', tempToken);
      }

      // Make sure user is properly set in state AND sessionStorage for persistence
      setUser(userData);
      sessionStorage.setItem('currentUser', JSON.stringify(userData));

      // Force a getCurrentUser call to fully initialize auth state
      await getCurrentUser();
      
      return userData;
    } catch (err) {
      console.error('Google auth error:', err);
      setAuthError(err.message || "Failed to process Google authentication");
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        loading, 
        authError, 
        login, 
        logout, 
        register, 
        completeGoogleSignUp, 
        handleGoogleAuthSuccess 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // If no provider is found, return a benign fallback to avoid runtime errors
    console.warn('useAuth must be used within an AuthProvider. Falling back to default context.');
    return {
      user: null,
      loading: false,
      authError: null,
      login: async () => {},
      logout: async () => {},
      register: async () => {},
      completeGoogleSignUp: async () => {},
      handleGoogleAuthSuccess: async () => {},
    };
  }
  return context;
};
