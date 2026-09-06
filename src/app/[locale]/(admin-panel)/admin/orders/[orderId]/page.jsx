import Image from "next/image";
import React from "react";

import { getOrderStatusVariant, getReturnStatusVariant } from "@/entities/order";
import {
  getAdminOrderDetail,
  OrderStatusForm,
  ReturnProcessingForm,
  updateOrderReturnAction,
  updateOrderStatusAction,
} from "@/features/admin-orders";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, SectionTitle } from "@/shared";
import { formatCurrency, formatDateTime } from "@/shared/lib";
import { getProductImageUrl } from "@/shared/lib/images";

export const metadata = {
  title: "Order Detail | Admin",
  robots: "noindex, nofollow",
};

export default async function OrderDetailPage({ params }) {
  const { orderId } = await params;
  const order = await getAdminOrderDetail(orderId);

  if (!order) {
    return <EmptyState title="Order not found" description="The requested order may no longer exist." />;
  }

  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <SectionTitle
        title={`Order ${order.id.slice(0, 8)}`}
      />

      <div className="grid gap-[var(--admin-gap)] xl:grid-cols-[1.4fr_0.95fr]">
        <div className="flex flex-col gap-[var(--admin-gap)]">
          <Card>
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[20px] border border-border/65 bg-[var(--admin-panel-muted)]/72 p-5 shadow-[var(--admin-shadow)]">
                <p className="text-sm font-medium text-text">Status</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
                  <Badge variant={getReturnStatusVariant(order.return_status)}>{order.return_status}</Badge>
                </div>
              </div>
              <div className="rounded-[20px] border border-border/65 bg-[var(--admin-panel-muted)]/72 p-5 shadow-[var(--admin-shadow)]">
                <p className="text-sm font-medium text-text">Financials</p>
                <p className="mt-3 text-2xl font-semibold text-text">{formatCurrency(order.total_cents)}</p>
                {order.coupons ? (
                  <p className="text-sm text-unactive-text">Coupon: {order.coupons.coupon_code}</p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex flex-col gap-5 rounded-[20px] border border-border/65 bg-white/36 p-5 shadow-[var(--admin-shadow)] md:flex-row md:items-center md:justify-between dark:bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-border bg-[var(--admin-panel-muted)]">
                      <Image
                        fill
                        src={getProductImageUrl(item.product_variants.products?.product_images?.[0]?.url)}
                        alt={item.product_variants.products?.name || "Product image"}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-text">{item.product_variants.products?.name}</p>
                      <p className="text-sm text-unactive-text">{item.product_variants.variant_name || "Default variant"}</p>
                      <p className="text-sm text-unactive-text">Qty {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-sm text-unactive-text md:text-right">
                    <p>Unit price: {formatCurrency(item.unit_price_cents)}</p>
                    <p className="font-medium text-text">
                      Total: {formatCurrency(item.unit_price_cents * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-[var(--admin-gap)]">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-unactive-text">
              <div className="rounded-[20px] border border-border/65 bg-[var(--admin-panel-muted)]/68 p-4 shadow-[0_18px_38px_-32px_rgba(15,23,42,0.32)]">
                <p>
                  <span className="font-medium text-text">Name:</span> {order.user?.name || "-"}
                </p>
                <p className="mt-2">
                  <span className="font-medium text-text">Email:</span> {order.user?.email}
                </p>
                <p className="mt-2">
                  <span className="font-medium text-text">Role:</span> {order.user?.role}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-unactive-text">
              {typeof order.address === "object" && order.address ? (
                <div className="rounded-[20px] border border-border/65 bg-[var(--admin-panel-muted)]/68 p-4 shadow-[0_18px_38px_-32px_rgba(15,23,42,0.32)]">
                  <p>{order.address.street}</p>
                  <p className="mt-2">
                    {order.address.city}, {order.address.state} {order.address.zip}
                  </p>
                  <p className="mt-2">{order.address.country}</p>
                  <p className="mt-2">{order.address.phone}</p>
                </div>
              ) : (
                <p>No shipping data recorded.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusForm
                orderId={order.id}
                currentStatus={order.status}
                action={updateOrderStatusAction}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process return</CardTitle>
            </CardHeader>
            <CardContent>
              <ReturnProcessingForm
                orderId={order.id}
                currentStatus={order.return_status}
                currentReason={order.return_reason}
                action={updateOrderReturnAction}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
