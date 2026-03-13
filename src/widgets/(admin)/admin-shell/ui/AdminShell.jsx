import React from "react";
import { Bell, LayoutGrid, ShieldCheck } from "lucide-react";

import { Card } from "@/shared";
import { Sidebar } from "@/widgets/(admin)/sidebar";

const AdminShell = ({ user, children }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_24%),linear-gradient(180deg,var(--admin-bg),color-mix(in_srgb,var(--admin-bg)_76%,black_24%))] font-admin-sans text-text">
      <div className="mx-auto flex min-h-screen max-w-[var(--admin-shell-max)] gap-[var(--admin-shell-gap)] px-5 py-5 lg:px-8 lg:py-8">
        <Sidebar />
        <div className="flex min-h-[calc(100vh-40px)] flex-1 flex-col gap-[var(--admin-content-gap)] rounded-[var(--admin-card-radius-lg)] border border-[color:var(--admin-shell-border)] bg-[color:var(--admin-shell-surface)] p-6 shadow-[var(--admin-shadow-strong)] backdrop-blur-[28px] lg:p-9">
          <header className="relative overflow-hidden rounded-[30px] border border-[color:var(--admin-hero-border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.42))] px-6 py-6 shadow-[var(--admin-shadow-soft)] backdrop-blur-[24px] dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.72),rgba(15,23,42,0.5))] lg:px-8 lg:py-8">
            <div className="pointer-events-none absolute inset-y-0 right-[-40px] hidden w-[320px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.22),transparent_68%)] blur-3xl lg:block" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/18 bg-white/75 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary shadow-sm dark:bg-slate-950/65">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin control plane
              </div>
              <div>
                <p className="font-admin-code text-[11px] uppercase tracking-[0.24em] text-unactive-text">
                  Cyber commerce ops
                </p>
                <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-text lg:text-[2.8rem]">
                  Store administration dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-unactive-text lg:text-[15px]">
                  Inventory, fulfillment, and customer operations live in one calmer workspace with clearer spacing and stronger hierarchy.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px] lg:max-w-[460px]">
              <Card className="flex items-center gap-4 rounded-[24px] border-white/55 bg-white/72 px-4 py-4 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] dark:border-white/8 dark:bg-slate-950/58">
                <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-unactive-text">Operator</p>
                  <p className="mt-1 text-sm font-medium text-text">{user?.email || "admin@cyber"}</p>
                </div>
              </Card>
              <Card className="flex items-center gap-4 rounded-[24px] border-white/55 bg-white/72 px-4 py-4 shadow-[0_16px_40px_-28px_rgba(15,23,42,0.45)] dark:border-white/8 dark:bg-slate-950/58">
                <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[color:var(--admin-highlight-soft)]/30 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-unactive-text">Workspace</p>
                  <p className="mt-1 text-sm font-medium text-text">Desktop-only console</p>
                </div>
              </Card>
            </div>
            </div>
          </header>
          <main className="flex-1 space-y-[var(--admin-content-gap)]">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminShell;
