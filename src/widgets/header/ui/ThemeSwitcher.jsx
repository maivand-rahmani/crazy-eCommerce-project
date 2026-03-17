"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Sparkles, Palette } from "lucide-react";

const themes = [
  { id: "light", icon: Sun, label: "Light" },
  { id: "dark", icon: Moon, label: "Dark" },
  { id: "vintage", icon: Sparkles, label: "Vintage" },
  { id: "retro", icon: Palette, label: "Retro" },
];

const ThemeSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load theme from localStorage or use default
    const savedTheme = localStorage.getItem("theme") || "dark";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setMounted(true);
  }, []);

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem("theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    setIsOpen(false);
  };

  const currentThemeData =
    themes.find((t) => t.id === currentTheme) || themes[1];
  const CurrentIcon = currentThemeData.icon;

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted shadow-sm">
        <CurrentIcon className="h-4.5 w-4.5" />
      </div>
    );
  }

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
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    currentTheme === theme.id
                      ? "bg-background text-text shadow-sm"
                      : "text-muted hover:bg-background/80 hover:text-text"
                  }`}
                  role="menuitem"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{theme.label}</span>
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
