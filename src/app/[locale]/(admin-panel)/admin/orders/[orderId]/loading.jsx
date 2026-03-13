import React from "react";

import { AdminDetailSkeleton, AdminHeaderSkeleton } from "@/features/admin-common";

export default function Loading() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <AdminHeaderSkeleton />
      <AdminDetailSkeleton />
    </div>
  );
}
