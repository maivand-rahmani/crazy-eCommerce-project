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

  const currentThemeData = themes.find((t) => t.id === currentTheme) || themes[1];
  const CurrentIcon = currentThemeData.icon;

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="p-2">
        <CurrentIcon className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-border/50 transition-colors flex items-center gap-2"
        aria-label="Switch theme"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <CurrentIcon />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div 
            className="absolute right-0 top-full mt-2 w-40 bg-surface border border-border rounded-lg shadow-lg z-50 overflow-hidden"
            role="menu"
            aria-label="Theme options"
          >
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`w-full px-4 py-2 flex items-center gap-2 hover:bg-border/50 transition-colors ${
                    currentTheme === theme.id ? "bg-primary/10 text-primary" : ""
                  }`}
                  role="menuitem"
                >
                  <Icon  />
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