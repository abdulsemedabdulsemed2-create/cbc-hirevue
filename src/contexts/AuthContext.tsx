import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  user: { username: string; role: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string; role: string } | null>(() => {
    const saved = sessionStorage.getItem("hirevue_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username: string, password: string) => {
    if (username === "admin" && password === "admin123") {
      const u = { username: "admin", role: "admin" };
      setUser(u);
      sessionStorage.setItem("hirevue_user", JSON.stringify(u));
      return true;
    }
    // Allow any username with password "password" as regular user
    if (password === "password" || password === "admin123") {
      const u = { username, role: username === "admin" ? "admin" : "user" };
      setUser(u);
      sessionStorage.setItem("hirevue_user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("hirevue_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
