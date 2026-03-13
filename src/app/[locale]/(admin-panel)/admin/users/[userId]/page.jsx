import React from "react";

import { getUserStateVariant } from "@/entities/user";
import {
  getAdminUserDetail,
  softDeleteUserAction,
  updateUserBlockAction,
  updateUserRoleAction,
  UserRoleForm,
  UserStateForm,
} from "@/features/admin-users";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, SectionTitle } from "@/shared";
import { formatCurrency, formatDateTime } from "@/shared/lib";

export const metadata = {
  title: "User Detail | Admin",
  robots: "noindex, nofollow",
};

export default async function UserDetailPage({ params }) {
  const { userId } = await params;
  const user = await getAdminUserDetail(userId);

  if (!user) {
    return <EmptyState title="User not found" description="The account may have been removed from the system." />;
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <SectionTitle
        eyebrow="Customer profile"
        title={user.name || user.email}
        description="Review addresses, order activity, account role, and access controls for this user."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.95fr] 2xl:gap-7">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile info</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-border/70 bg-[var(--admin-panel-muted)]/72 p-5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.35)]">
                <p className="text-sm font-medium text-text">Account state</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                  <Badge variant={getUserStateVariant(user)}>
                    {user.deletedAt ? "Deleted" : user.isBlocked ? "Blocked" : "Active"}
                  </Badge>
                </div>
              </div>
              <div className="rounded-[24px] border border-border/70 bg-[var(--admin-panel-muted)]/72 p-5 text-sm text-unactive-text shadow-[0_18px_38px_-30px_rgba(15,23,42,0.35)]">
                <p>
                  <span className="font-medium text-text">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium text-text">Orders:</span> {user.ordersCount}
                </p>
                <p>
                  <span className="font-medium text-text">Created:</span> {formatDateTime(user.createdAt)}
                </p>
                <p>
                  <span className="font-medium text-text">Updated:</span> {formatDateTime(user.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Addresses</CardTitle>
              <CardDescription>Stored in the current JSON address book field.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.addresses?.length > 0 ? (
                user.addresses.map((address) => (
                  <div key={address.id} className="rounded-[24px] border border-border/65 bg-white/36 p-5 text-sm text-unactive-text shadow-[0_18px_38px_-30px_rgba(15,23,42,0.32)] dark:bg-white/[0.02]">
                    <p className="font-medium text-text">{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p>{address.country}</p>
                    <p>{address.phone}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-unactive-text">No addresses on file.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order history</CardTitle>
              <CardDescription>Recent purchases tied to this account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.orders.length > 0 ? (
                user.orders.map((order) => (
                  <div key={order.id} className="rounded-[24px] border border-border/65 bg-white/36 p-5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.32)] dark:bg-white/[0.02]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-admin-code text-sm text-primary">{order.id.slice(0, 10)}</p>
                        <p className="text-sm text-unactive-text">{formatDateTime(order.created_at)}</p>
                      </div>
                      <div className="text-right text-sm text-unactive-text">
                        <p className="font-medium text-text">{formatCurrency(order.total_cents)}</p>
                        <p>{order.order_items.length} line items</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-unactive-text">No orders found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role management</CardTitle>
            </CardHeader>
            <CardContent>
              <UserRoleForm userId={user.id} currentRole={user.role} action={updateUserRoleAction} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access control</CardTitle>
            </CardHeader>
            <CardContent>
              <UserStateForm userId={user.id} isBlocked={user.isBlocked} action={updateUserBlockAction} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Soft delete</CardTitle>
              <CardDescription>
                Preserve critical business history while disabling future access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={softDeleteUserAction}>
                <input type="hidden" name="userId" value={user.id} />
                <Button type="submit" variant="danger">
                  Soft delete user
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
