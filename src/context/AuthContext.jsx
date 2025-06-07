import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from "../services/authService";

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

  return (
    <AuthContext.Provider
      value={{ user, loading, authError, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
