import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // Refresh user on app load
  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await api.post("/auth/refresh");

        setAccessToken(res.data.accessToken);
        setRole(res.data.role || null);
      } catch (err) {
        setAccessToken(null);
        setRole(null);
      } finally {
        setLoading(false);
        setAuthReady(true);
      }
    };

    refresh();
  }, []);

  // LOGIN
  const login = async (id, password) => {
    const res = await api.post("/auth/login", { id, password });

    setAccessToken(res.data.accessToken);
    setRole(res.data.role);
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setAccessToken(null);
      setRole(null);
      setAuthReady(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        role,
        loading,
        authReady,
        login,
        logout,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
