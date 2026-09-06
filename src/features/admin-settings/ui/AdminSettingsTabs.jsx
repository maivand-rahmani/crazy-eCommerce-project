"use client";
import React, { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/shared";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { updateAdminSettingsAction } from "../model/actions";

const TABS = [
  { id: "general", labelKey: "tabs.general" },
  { id: "commerce", labelKey: "tabs.commerce" },
  { id: "advanced", labelKey: "tabs.advanced" },
];

const TAB_GROUPS = {
  general: [
    {
      sectionKey: "store",
      fields: [
        { key: "store.name", type: "text" },
        { key: "store.tagline", type: "text" },
      ],
    },
    {
      sectionKey: "contact",
      fields: [
        { key: "contact.email", type: "email" },
        { key: "contact.phone", type: "text" },
        { key: "contact.address", type: "text" },
      ],
    },
    {
      sectionKey: "currency",
      fields: [{ key: "currency.code", type: "text" }],
    },
  ],
  commerce: [
    {
      sectionKey: "commerce",
      fields: [
        { key: "commerce.shippingCents", type: "number" },
        { key: "commerce.taxRate", type: "number" },
      ],
    },
  ],
  advanced: [
    {
      sectionKey: "admin",
      fields: [
        { key: "admin.pageSize", type: "number" },
        { key: "admin.lowStockThreshold", type: "number" },
        { key: "admin.salesWindowDays", type: "number" },
      ],
    },
  ],
};

/** Setting keys whose values must be sent as numbers. */
const NUMERIC_KEYS = new Set([
  "commerce.shippingCents",
  "commerce.taxRate",
  "admin.pageSize",
  "admin.lowStockThreshold",
  "admin.salesWindowDays",
]);

function fieldPath(key, part) {
  const [group, name] = key.split(".");
  return `fields.${group}.${name}.${part}`;
}

function SectionCard({ section, values, setValues }) {
  const t = useTranslations("adminSettings");
  const [saving, setSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      for (const field of section.fields) {
        const raw = values[field.key] ?? "";
        formData.set(field.key, NUMERIC_KEYS.has(field.key) ? String(Number(raw) || 0) : String(raw));
      }
      const result = await updateAdminSettingsAction(formData);
      if (result?.ok) {
        toast.success(t("saveSuccess"));
      } else {
        toast.error(result?.error || t("saveError"));
      }
    } catch {
      toast.error(t("saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(`sections.${section.sectionKey}`)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={save} className="flex flex-col gap-[var(--admin-gap)]">
          <div className="flex flex-col gap-5">
            {section.fields.map((field) => (
              <label key={field.key} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text">{t(fieldPath(field.key, "label"))}</span>
                <Input
                  type={field.type}
                  value={values[field.key] ?? ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                />
                <span className="text-sm text-unactive-text">{t(fieldPath(field.key, "description"))}</span>
              </label>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="h-10 rounded-xl px-5">
              {saving ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminSettingsTabs({ initialSettings }) {
  const t = useTranslations("adminSettings");
  const [activeTab, setActiveTab] = useState("general");
  const [values, setValues] = useState(initialSettings);

  const sections = TAB_GROUPS[activeTab] || [];

  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <div
        role="tablist"
        aria-label={t("title")}
        className="flex gap-2 overflow-x-auto rounded-2xl border border-border/65 bg-card p-2 shadow-[var(--admin-shadow)]"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-sm font-medium transition duration-200 ${
              activeTab === tab.id ? "bg-primary/10 text-primary" : "text-text hover:bg-primary/5"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-[var(--admin-gap)]">
        {sections.map((section) => (
          <SectionCard key={section.sectionKey} section={section} values={values} setValues={setValues} />
        ))}
      </div>
    </div>
  );
}
