import React from "react";

import { CouponEditorForm, createCouponAction } from "@/features/admin-coupons";
import { SectionTitle } from "@/shared";

export const metadata = {
  title: "Create Coupon | Admin",
  robots: "noindex, nofollow",
};

export default function NewCouponPage() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <SectionTitle
        title="New coupon"
      />
      <CouponEditorForm mode="create" createAction={createCouponAction} />
    </div>
  );
}
