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

  useEffect(() => {
    // Load theme from localStorage or use default
    const savedTheme = localStorage.getItem("theme") || "dark";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem("theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    setIsOpen(false);
  };

  const currentThemeData = themes.find((t) => t.id === currentTheme) || themes[1];
  const CurrentIcon = currentThemeData.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-border/50 transition-colors flex items-center gap-2"
        aria-label="Switch theme"
      >
        <CurrentIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-40 bg-surface border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`w-full px-4 py-2 flex items-center gap-2 hover:bg-border/50 transition-colors ${
                    currentTheme === theme.id ? "bg-primary/10 text-primary" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
