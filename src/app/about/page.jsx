"use client";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("about");

  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="w-full bg-gray-100 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{t("subtitle")}</p>
      </section>

      {/* Our Mission */}
      <section className="max-w-6xl mx-auto py-20 px-6 md:px-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-semibold mb-6">{t("mission.title")}</h2>
          <p className="text-gray-600 leading-relaxed mb-4">{t("mission.p1")}</p>
          <p className="text-gray-600 leading-relaxed">{t("mission.p2")}</p>
        </div>
        <div className="w-full h-[300px] bg-gray-200 rounded-2xl flex items-center justify-center">
          <span className="text-gray-400">[ Mission Image ]</span>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold">{t("whyChooseUs.title")}</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            {t("whyChooseUs.subtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-8 bg-white shadow rounded-2xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">
              {t("whyChooseUs.cards.authentic.title")}
            </h3>
            <p className="text-gray-600">
              {t("whyChooseUs.cards.authentic.desc")}
            </p>
          </div>
          <div className="p-8 bg-white shadow rounded-2xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">
              {t("whyChooseUs.cards.fast.title")}
            </h3>
            <p className="text-gray-600">
              {t("whyChooseUs.cards.fast.desc")}
            </p>
          </div>
          <div className="p-8 bg-white shadow rounded-2xl hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">
              {t("whyChooseUs.cards.support.title")}
            </h3>
            <p className="text-gray-600">
              {t("whyChooseUs.cards.support.desc")}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
