/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);

  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem("auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.user && parsed?.token) {
          setLoading(false);
          return { user: parsed.user, token: parsed.token };
        }
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.removeItem("auth");
    }
    setLoading(false);
    return { user: null, token: "" };
  });

  const logout = () => {
    setAuth({ user: null, token: "" });
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}