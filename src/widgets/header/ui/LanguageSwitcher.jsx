"use client";

import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { useRouter, usePathname } from "@/shared/i18n";

const languages = [
  { id: "en", label: "English", flag: "🇺🇸" },
  { id: "ru", label: "Русский", flag: "🇷🇺" },
  { id: "fa", label: "فارسی", flag: "🇮🇷" },
];

const LanguageSwitcher = ({ variant = "dropdown" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("en");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Get current locale from pathname
    const pathParts = pathname.split("/");
    const locale = pathParts[1];
    if (languages.some((lang) => lang.id === locale)) {
      setCurrentLocale(locale);
    }
    setMounted(true);
  }, [pathname]);

  const handleLanguageChange = (locale) => {
    // Replace the locale in the pathname
    const pathParts = pathname.split("/");
    pathParts[1] = locale;
    const newPath = pathParts.join("/");
    
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLang = languages.find((l) => l.id === currentLocale) || languages[0];

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="p-2">
        <Globe className="w-5 h-5" />
      </div>
    );
  }

  if (variant === "inline") {
    // Inline version for auth page footer
    return (
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4" />
        <select
          value={currentLocale}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-transparent border-none text-sm focus:outline-none cursor-pointer"
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id} className="bg-surface">
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Dropdown version for header
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-border/50 transition-colors flex items-center gap-2"
        aria-label="Switch language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe />
        <span className="text-xs">{currentLang.flag}</span>
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
            aria-label="Language options"
          >
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageChange(lang.id)}
                className={`w-full px-4 py-2 flex items-center gap-2 hover:bg-border/50 transition-colors ${
                  currentLocale === lang.id ? "bg-primary/10 text-primary" : ""
                }`}
                role="menuitem"
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="text-sm">{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
