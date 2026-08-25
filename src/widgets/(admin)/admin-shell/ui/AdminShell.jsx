import React from "react";

import { Sidebar } from "@/widgets/(admin)/sidebar";

const AdminShell = ({ user, children }) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_24%),linear-gradient(180deg,var(--admin-bg),color-mix(in_srgb,var(--admin-bg)_76%,black_24%))] font-admin-sans text-text">
      <div className="mx-auto flex min-h-screen max-w-[var(--admin-shell-max)] gap-[var(--admin-shell-gap)] px-5 py-5 lg:px-8 lg:py-8">
        <Sidebar />
        <div className="flex min-h-[calc(100vh-40px)] flex-1 flex-col gap-[var(--admin-content-gap)] rounded-[var(--admin-card-radius-lg)] border border-[color:var(--admin-shell-border)] bg-[color:var(--admin-shell-surface)] p-6 shadow-[var(--admin-shadow-strong)] backdrop-blur-[28px] lg:p-8">
          <main className="flex-1 space-y-[var(--admin-content-gap)]">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminShell;
