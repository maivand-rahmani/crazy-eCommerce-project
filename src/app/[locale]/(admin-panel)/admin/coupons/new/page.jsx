import React from "react";

import { CouponEditorForm, createCouponAction } from "@/features/admin-coupons";
import { SectionTitle } from "@/shared";

export const metadata = {
  title: "Create Coupon | Admin",
  robots: "noindex, nofollow",
};

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Promotion design"
        title="New coupon"
        description="Create fixed amount or percentage discounts with operational controls." 
      />
      <CouponEditorForm mode="create" createAction={createCouponAction} />
    </div>
  );
}
