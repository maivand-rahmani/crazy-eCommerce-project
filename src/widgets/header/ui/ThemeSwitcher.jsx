"use client";

import { useState } from "react";
import { Moon, Sun, Sparkles, Palette } from "lucide-react";
import { useTheme, THEMES } from "@/shared/ui/theme";

const THEME_META = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  vintage: { icon: Sparkles, label: "Vintage" },
  retro: { icon: Palette, label: "Retro" },
};

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Single source of truth: ThemeProvider owns persistence
  // (localStorage "store-theme" + documentElement.dataset.theme).
  const { theme: currentTheme, setTheme } = useTheme();

  const handleThemeChange = (themeId) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const currentMeta = THEME_META[currentTheme] || THEME_META.dark;
  const CurrentIcon = currentMeta.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:text-text hover:shadow-md"
        aria-label="Switch theme"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <CurrentIcon className="h-4.5 w-4.5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-full z-50 mt-3 w-44 overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-1.5 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl"
            role="menu"
            aria-label="Theme options"
          >
            {THEMES.map((themeId) => {
              const meta = THEME_META[themeId] || THEME_META.dark;
              const Icon = meta.icon;
              return (
                <button
                  key={themeId}
                  onClick={() => handleThemeChange(themeId)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    currentTheme === themeId
                      ? "bg-background text-text shadow-sm"
                      : "text-muted hover:bg-background/80 hover:text-text"
                  }`}
                  role="menuitem"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{meta.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitcher;
