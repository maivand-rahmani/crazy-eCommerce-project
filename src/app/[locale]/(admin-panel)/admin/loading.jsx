import React from "react";

import {
  AdminHeaderSkeleton,
  AdminPanelSkeleton,
  AdminStatsSkeleton,
} from "@/features/admin-common";

export default function Loading() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <AdminHeaderSkeleton />
      <AdminStatsSkeleton />
      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <AdminPanelSkeleton rows={1} />
        <AdminPanelSkeleton rows={3} />
      </div>
      <AdminPanelSkeleton rows={5} />
    </div>
  );
}
