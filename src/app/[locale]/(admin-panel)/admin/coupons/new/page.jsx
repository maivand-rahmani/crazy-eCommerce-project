import React from "react";

import { CouponEditorForm, createCouponAction } from "@/features/admin-coupons";
import { SectionTitle } from "@/shared";

export const metadata = {
  title: "Create Coupon | Admin",
  robots: "noindex, nofollow",
};

export default function NewCouponPage() {
  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <SectionTitle
        title="New coupon"
      />
      <CouponEditorForm mode="create" createAction={createCouponAction} />
    </div>
  );
}
