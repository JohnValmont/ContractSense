"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  email: string | null;
  token: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  email: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage on load
    const storedToken = localStorage.getItem("contractsense_token");
    const storedEmail = localStorage.getItem("contractsense_email");
    if (storedToken && storedEmail) {
      setToken(storedToken);
      setEmail(storedEmail);
    }
  }, []);

  const login = (newEmail: string, newToken: string) => {
    setEmail(newEmail);
    setToken(newToken);
    localStorage.setItem("contractsense_token", newToken);
    localStorage.setItem("contractsense_email", newEmail);
  };

  const logout = () => {
    setEmail(null);
    setToken(null);
    localStorage.removeItem("contractsense_token");
    localStorage.removeItem("contractsense_email");
  };

  return (
    <AuthContext.Provider value={{ email, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
