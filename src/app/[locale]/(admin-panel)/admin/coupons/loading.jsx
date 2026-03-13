import React from "react";

import { AdminHeaderSkeleton, AdminPanelSkeleton } from "@/features/admin-common";

export default function Loading() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <AdminHeaderSkeleton />
      <AdminPanelSkeleton rows={2} />
      <AdminPanelSkeleton rows={6} />
    </div>
  );
}
