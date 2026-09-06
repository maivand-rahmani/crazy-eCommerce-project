import React from "react";

import {
  AdminHeaderSkeleton,
  AdminPanelSkeleton,
  AdminStatsSkeleton,
} from "@/features/admin-common";

export default function Loading() {
  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <AdminHeaderSkeleton />
      <AdminStatsSkeleton />
      <div className="grid gap-[var(--admin-gap)] xl:grid-cols-[1.45fr_1fr]">
        <AdminPanelSkeleton rows={1} />
        <AdminPanelSkeleton rows={3} />
      </div>
      <AdminPanelSkeleton rows={5} />
    </div>
  );
}
