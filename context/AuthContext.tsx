"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  token: string;
}

const AuthContext = createContext<{
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.role)
            parsed.role = String(parsed.role).toUpperCase();
          setUser(parsed);
        } catch {}
      }
      setIsHydrated(true);
    };
    hydrate();
  }, []);

  const login = (data: User) => {
    const normalized = {
      ...data,
      name: data.name,
      email: data.email,
      role: data.role?.toUpperCase(),
    };
    localStorage.setItem("user", JSON.stringify(normalized));
    setUser(normalized);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!isHydrated) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
