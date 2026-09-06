import { getTranslations } from "next-intl/server";
import { getSettings } from "@/features/admin-settings/model/settings";

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const tLabels = await getTranslations({ locale, namespace: "contactLabels" });
  let settings = {};
  try {
    settings = await getSettings();
  } catch {}

  const contactAddress = settings["contact.address"] ?? t("info.address");
  const contactEmail = settings["contact.email"] ?? t("info.email");
  const contactPhone = settings["contact.phone"] ?? t("info.phone");

  return (
    <main className="bg-bg text-text">
      <section className="w-full bg-surface py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
        <p className="text-unactive-text max-w-2xl mx-auto">{t("subtitle")}</p>
      </section>
      <section className="max-w-6xl mx-auto py-20 px-6 md:px-10 grid md:grid-cols-2 gap-12">
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
                className="w-full border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none bg-input text-input-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("form.email")}
              </label>
              <input
                type="email"
                placeholder={t("form.placeholder.email")}
                className="w-full border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none bg-input text-input-text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("form.message")}
              </label>
              <textarea
                placeholder={t("form.placeholder.message")}
                className="w-full border border-border rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-primary focus:outline-none bg-input text-input-text"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-button text-button-text font-medium py-3 rounded-lg hover:opacity-80 transition"
            >
              {t("form.button")}
            </button>
          </form>
        </div>
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">{t("info.title")}</h2>
            <ul className="space-y-3 text-text">
              <li>
                <strong>{tLabels("address")}:</strong> {contactAddress}
              </li>
              <li>
                <strong>{tLabels("email")}:</strong> {contactEmail}
              </li>
              <li>
                <strong>{tLabels("phone")}:</strong> {contactPhone}
              </li>
            </ul>
          </div>
          <div className="w-full h-[300px] bg-surface rounded-2xl flex items-center justify-center border border-border">
            <span className="text-unactive-text">{t("mapPlaceholder")}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
