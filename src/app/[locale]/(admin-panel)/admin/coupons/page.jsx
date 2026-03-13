import React from "react";

import { getCouponTypeLabel, isCouponExpired } from "@/entities/coupon";
import { FilterSubmitButton, Pagination } from "@/features/admin-common";
import { getAdminCoupons, softDeleteCouponAction } from "@/features/admin-coupons";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, Input, SectionTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared";
import { formatDateTime } from "@/shared/lib";
import { Link } from "@/shared/i18n";

export const metadata = {
  title: "Admin Coupons | Cyber",
  robots: "noindex, nofollow",
};

export default async function CouponsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const couponsResult = await getAdminCoupons(resolvedSearchParams);

  return (
    <div className="space-y-8 lg:space-y-10">
      <SectionTitle
        eyebrow="Promotions"
        title="Coupons"
        description="Create discounts, extend expirations, and retire promotions without losing reporting context."
        action={<Link href="/admin/coupons/new" className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-text transition duration-200 hover:bg-primary/90">Create coupon</Link>}
      />

      <form className="space-y-4">
        <Card>
          <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.2fr_auto] lg:items-end">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Coupon code</span>
              <Input defaultValue={couponsResult.filters.query} name="query" placeholder="Search by coupon code" />
            </label>
            <FilterSubmitButton />
          </CardContent>
        </Card>
      </form>

      {couponsResult.coupons.length === 0 ? (
        <EmptyState
          title="No coupons found"
          description="Create your first coupon or search with a different code fragment."
          action={<Link href="/admin/coupons/new" className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-text transition duration-200 hover:bg-primary/90">Create coupon</Link>}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Coupon registry</CardTitle>
            <CardDescription>
              Showing {couponsResult.pagination.total} active or historical coupon records.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Scope</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {couponsResult.coupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div>
                        <Link href={`/admin/coupons/${coupon.id}`} className="font-admin-code text-primary hover:underline">
                          {coupon.coupon_code}
                        </Link>
                        <p className="text-sm text-unactive-text">{coupon.description || "No description"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getCouponTypeLabel(coupon.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      {coupon.times_used || 0}
                      {coupon.max_usage ? ` / ${coupon.max_usage}` : " / unlimited"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isCouponExpired(coupon) ? "danger" : "success"}>
                        {coupon.expires_at ? formatDateTime(coupon.expires_at) : "No expiry"}
                      </Badge>
                    </TableCell>
                    <TableCell>{coupon.is_one_time ? "One-time" : "Multi-use"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/coupons/${coupon.id}`} className="text-sm font-medium text-primary hover:underline">
                          Edit
                        </Link>
                        <form action={softDeleteCouponAction}>
                          <input type="hidden" name="couponId" value={coupon.id} />
                          <button className="text-sm font-medium text-rose-500 hover:underline" type="submit">
                            Delete
                          </button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination pathname="/admin/coupons" searchParams={resolvedSearchParams} pagination={couponsResult.pagination} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
