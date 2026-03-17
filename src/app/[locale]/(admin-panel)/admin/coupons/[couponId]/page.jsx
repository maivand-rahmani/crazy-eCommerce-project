import React from "react";

import {
  CouponEditorForm,
  extendCouponExpirationAction,
  getAdminCouponDetail,
  softDeleteCouponAction,
  updateCouponAction,
} from "@/features/admin-coupons";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, Input, SectionTitle } from "@/shared";
import { formatDateTime } from "@/shared/lib";

export const metadata = {
  title: "Coupon Detail | Admin",
  robots: "noindex, nofollow",
};

export default async function CouponDetailPage({ params }) {
  const { couponId } = await params;
  const coupon = await getAdminCouponDetail(couponId);

  if (!coupon || coupon.deleted_at) {
    return <EmptyState title="Coupon not found" description="This coupon may have been retired from active use." />;
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <SectionTitle
        eyebrow="Promotion detail"
        title={coupon.coupon_code}
        description={`Used ${coupon.times_used || 0} times${coupon.expires_at ? `, expires ${formatDateTime(coupon.expires_at)}` : " with no expiration set yet"}.`}
      />

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.85fr] 2xl:gap-7">
        <CouponEditorForm mode="edit" coupon={coupon} updateAction={updateCouponAction} />

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Extend expiration</CardTitle>
              <CardDescription>Update the coupon lifetime without touching the rest of the rule set.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={extendCouponExpirationAction} className="space-y-3">
                <input type="hidden" name="couponId" value={coupon.id} />
                <Input
                  name="expiresAt"
                  type="datetime-local"
                  defaultValue={coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : ""}
                />
                <Button type="submit">Extend expiration</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delete coupon</CardTitle>
              <CardDescription>Soft delete preserves order history and reporting references.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={softDeleteCouponAction}>
                <input type="hidden" name="couponId" value={coupon.id} />
                <Button type="submit" variant="danger">
                  Soft delete coupon
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
