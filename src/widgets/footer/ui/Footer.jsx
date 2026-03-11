"use client";
import React from "react";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="z-[-1] bg-footer-bg text-footer-text py-16 relative overflow-hidden">
      {/* Неоновый абстрактный эффект */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-footer-accent opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
        
        {/* Логотип и слоган */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text text-footer-accent bg-gradient-to-r from-footer-accent to-footer-accent">{t("logo")}</h1>
          <p className="text-footer-text max-w-xs">{t("tagline")}</p>
        </div>

        {/* Навигация */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-footer-accent text-footer mb-2">{t("nav.title")}</h2>
          <a href="#" className="hover-text-footer-accent transition-colors">{t("nav.home")}</a>
          <a href="#" className="hover-text-footer-accent transition-colors">{t("nav.products")}</a>
          <a href="#" className="hover-text-footer-accent transition-colors">{t("nav.contacts")}</a>
          <a href="#" className="hover-text-footer-accent transition-colors">{t("nav.about")}</a>
        </div>

        {/* Социальные сети */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-footer-accent mb-2">{t("social.title")}</h2>
          <div className="flex gap-4 mt-2">
          </div>
        </div>
      </div>

      {/* Копирайт */}
      <div className="text-center text-footer mt-12 border-t border-border pt-6 text-sm">
        {t("copyright")}
      </div>
    </footer>
  );
};

export default Footer;
