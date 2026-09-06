"use client";
import React, { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/shared";
import { useTranslations } from "next-intl";
import { updateAdminSettingAction } from "../model/actions";

const TABS = [
  { id: "general", labelKey: "tabs.general" },
  { id: "localization", labelKey: "tabs.localization" },
  { id: "commerce", labelKey: "tabs.commerce" },
  { id: "catalog", labelKey: "tabs.catalog" },
  { id: "media", labelKey: "tabs.media" },
  { id: "seo", labelKey: "tabs.seo" },
  { id: "advanced", labelKey: "tabs.advanced" },
];

const FIELD_GROUPS = {
  general: [
    { key: "store.name", type: "text" },
    { key: "store.tagline", type: "text" },
    { key: "contact.email", type: "email" },
    { key: "contact.phone", type: "text" },
    { key: "contact.address", type: "text" },
  ],
  localization: [
    { key: "currency.code", type: "text" },
  ],
  commerce: [
    { key: "commerce.shippingCents", type: "number" },
    { key: "commerce.taxRate", type: "number" },
  ],
  catalog: [
    { key: "catalog.pageSize", type: "number" },
  ],
  media: [
    { key: "media.s3PublicUrl", type: "text" },
    { key: "media.s3Bucket", type: "text" },
  ],
  seo: [
    { key: "seo.defaultTitle", type: "text" },
    { key: "seo.defaultDescription", type: "text" },
  ],
  advanced: [
    { key: "admin.pageSize", type: "number" },
    { key: "admin.lowStockThreshold", type: "number" },
    { key: "admin.salesWindowDays", type: "number" },
  ],
};

export default function AdminSettingsTabs({ initialSettings }) {
  const t = useTranslations("adminSettings");
  const [activeTab, setActiveTab] = useState("general");
  const [values, setValues] = useState(initialSettings);
  const [saving, setSaving] = useState(null);
  const [message, setMessage] = useState(null);

  const fields = FIELD_GROUPS[activeTab] || [];

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (key) => {
    setSaving(key);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.set("key", key);
      const val = values[key];
      formData.set("value", typeof val === "string" ? val : JSON.stringify(val));
      await updateAdminSettingAction(formData);
      setMessage({ type: "success", text: t("saveSuccess") });
    } catch (e) {
      setMessage({ type: "error", text: e.message || t("saveError") });
    } finally {
      setSaving(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-border/65 bg-card p-2 shadow-[var(--admin-shadow)]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-medium transition duration-200 ${activeTab === tab.id ? "bg-primary/10 text-primary" : "text-text hover:bg-primary/5"}`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      {message ? (
        <div className={`rounded-2xl border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {message.text}
        </div>
      ) : null}

      <div className="grid gap-[var(--admin-gap)]">
        {fields.map((field) => (
          <Card key={field.key}>
            <CardHeader>
              <CardTitle>{t(`fields.${field.key}.label`, { fallback: field.key })}</CardTitle>
              <p className="text-sm text-unactive-text">{t(`fields.${field.key}.description`, { fallback: "" })}</p>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(field.key);
                }}
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
              >
                <label className="flex flex-1 flex-col gap-2">
                  <span className="text-sm font-medium text-text">{t(`fields.${field.key}.label`, { fallback: field.key })}</span>
                  <Input
                    type={field.type}
                    value={values[field.key] ?? ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={String(values[field.key] ?? "")}
                  />
                </label>
                <Button type="submit" disabled={saving === field.key}>
                  {saving === field.key ? t("saving") : t("save")}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
