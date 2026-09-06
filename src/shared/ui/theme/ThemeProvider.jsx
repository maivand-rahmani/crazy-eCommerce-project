"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const THEMES = ["light", "dark", "vintage", "retro"];
export const THEME_STORAGE_KEY = "store-theme";
export const DEFAULT_THEME = "dark";

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  themes: THEMES,
});

export function ThemeProvider({ children, defaultTheme = DEFAULT_THEME }) {
  const [theme, setThemeState] = useState(defaultTheme);

  // Restore persisted choice (layout renders data-theme="dark" first to avoid FOUC).
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && THEMES.includes(stored)) setThemeState(stored);
    } catch {
      // private mode etc. — keep default
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore persistence failures
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    if (THEMES.includes(next)) setThemeState(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
