import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";

interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  balance?: number;
  frozenBalance?: number;
  totalSales?: number;
  totalPurchases?: number;
  rating?: number;
  reviewCount?: number;
  isAdmin?: boolean;
  isVerified?: boolean;
  sellerLevel?: string;
  telegramId?: string;
  refCode?: string;
  createdAt?: number;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isTelegramMiniApp: boolean;
  isTelegramLoading: boolean;
  setTelegramLoading: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function detectTelegramMiniApp(): boolean {
  try {
    const tg = (window as any).Telegram?.WebApp;
    return !!(tg?.initData && tg.initData.length > 0);
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("mm_token"));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("mm_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // TG SDK уже загружен до React (script в index.html) — проверяем сразу
  const [isTelegramMiniApp] = useState(detectTelegramMiniApp);

  // Показываем спиннер если это TG Mini App — пока авто-вход не завершится
  const [isTelegramLoading, setIsTelegramLoading] = useState(detectTelegramMiniApp);

  const setAuth = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("mm_token", newToken);
    localStorage.setItem("mm_user", JSON.stringify(newUser));
  }, []);

  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
    localStorage.setItem("mm_user", JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("mm_token");
    localStorage.removeItem("mm_user");
  }, []);

  useEffect(() => {
    setAuthTokenGetter(() => localStorage.getItem("mm_token"));
  }, []);

  return (
    <AuthContext.Provider value={{
      token,
      user,
      setAuth,
      updateUser,
      logout,
      isAuthenticated: !!token,
      isTelegramMiniApp,
      isTelegramLoading,
      setTelegramLoading: setIsTelegramLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
