import React from "react";

import { Sidebar } from "@/widgets/(admin)/sidebar";

const AdminShell = ({ user, children }) => {
  return (
    <div className="min-h-screen bg-bg font-admin-sans text-text">
      <div className="mx-auto flex min-h-screen max-w-[var(--admin-shell-max)] flex-col gap-[var(--admin-gap)] px-5 py-5 md:flex-row lg:px-8 lg:py-8">
        <Sidebar role={user?.role} />
        <div className="flex min-h-[calc(100vh-40px)] flex-1 flex-col gap-[var(--admin-gap)] rounded-[20px] border border-border/65 bg-card p-6 shadow-[var(--admin-shadow)] lg:p-8">
          <main className="flex flex-1 flex-col gap-[var(--admin-gap)]">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminShell;
