"use client";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tLabels = useTranslations("contactLabels");

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="w-full bg-gray-100 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t("subtitle")}</p>
      </section>

      {/* Form + Info */}
      <section className="max-w-6xl mx-auto py-20 px-6 md:px-10 grid md:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">{t("form.title")}</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("form.name")}
              </label>
              <input
                type="text"
                placeholder={t("form.placeholder.name")}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("form.email")}
              </label>
              <input
                type="email"
                placeholder={t("form.placeholder.email")}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("form.message")}
              </label>
              <textarea
                placeholder={t("form.placeholder.message")}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-black focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition"
            >
              {t("form.button")}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">{t("info.title")}</h2>
            <ul className="space-y-3 text-gray-700">
              <li>
                <strong>{tLabels("address")}:</strong> {t("info.address")}
              </li>
              <li>
                <strong>{tLabels("email")}:</strong> {t("info.email")}
              </li>
              <li>
                <strong>{tLabels("phone")}:</strong> {t("info.phone")}
              </li>
            </ul>
          </div>
          <div className="w-full h-[300px] bg-gray-200 rounded-2xl flex items-center justify-center">
            <span className="text-gray-400">{t("mapPlaceholder")}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
