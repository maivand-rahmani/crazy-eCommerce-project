import React from "react";

import { AdminDetailSkeleton, AdminHeaderSkeleton } from "@/features/admin-common";

export default function Loading() {
  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <AdminHeaderSkeleton />
      <AdminDetailSkeleton />
    </div>
  );
}
