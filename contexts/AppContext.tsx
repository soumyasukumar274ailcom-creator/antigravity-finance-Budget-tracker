"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCurrency, getTheme, saveCurrency, saveTheme } from "@/lib/storage";

interface AppContextValue {
  currency: string;
  setCurrency: (code: string) => void;
  isGhostMode: boolean;
  toggleGhostMode: () => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextValue>({
  currency: "USD",
  setCurrency: () => {},
  isGhostMode: false,
  toggleGhostMode: () => {},
  theme: "dark",
  toggleTheme: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState("USD");
  const [isGhostMode, setGhostMode] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setCurrencyState(getCurrency());
    const savedTheme = getTheme();
    setThemeState(savedTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(savedTheme);
  }, []);

  const setCurrency = useCallback((code: string) => {
    saveCurrency(code);
    setCurrencyState(code);
  }, []);

  const toggleGhostMode = useCallback(() => {
    setGhostMode((v) => !v);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    saveTheme(next);
    setThemeState(next);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
  }, [theme]);

  return (
    <AppContext.Provider value={{ currency, setCurrency, isGhostMode, toggleGhostMode, theme, toggleTheme }}>
      <div className={isGhostMode ? "ghost-active" : ""}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
