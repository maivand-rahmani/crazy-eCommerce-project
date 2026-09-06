import React from "react";

import { AdminHeaderSkeleton, AdminPanelSkeleton } from "@/features/admin-common";

export default function Loading() {
  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <AdminHeaderSkeleton />
      <AdminPanelSkeleton rows={2} />
      <AdminPanelSkeleton rows={6} />
    </div>
  );
}
