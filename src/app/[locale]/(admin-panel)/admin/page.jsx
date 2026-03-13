import React from "react";
import { AlertTriangle, Package, ShoppingCart, Users } from "lucide-react";

import { getOrderStatusVariant } from "@/entities/order";
import { getStockSummary } from "@/entities/product";
import { getAdminDashboardData } from "@/features/admin-dashboard/model";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, SectionTitle, StatCard, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared";
import { formatCurrency, formatDateTime } from "@/shared/lib";
import { Link } from "@/shared/i18n";
import { AdminSalesChart } from "@/widgets/(admin)/admin-dashboard";

export const metadata = {
  title: "Admin Dashboard | Store Management",
  description: "Store administration panel. Manage products, orders, customers, and analytics from one centralized dashboard.",
  robots: "noindex, nofollow",
};

export default async function Page() {
  const dashboard = await getAdminDashboardData();

  return (
    <div className="space-y-8 lg:space-y-10">
      <SectionTitle
        eyebrow="Operations overview"
        title="Admin dashboard"
        description="Track order flow, revenue momentum, and catalog pressure points from a single production-ready control plane."
      />

      <div className="grid gap-5 xl:grid-cols-4 2xl:gap-6">
        <StatCard
          icon={ShoppingCart}
          label="Total orders"
          value={dashboard.summary.totalOrders}
          caption={`Revenue last ${30} days: ${dashboard.summary.recentRevenueLabel}`}
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={dashboard.summary.totalUsers}
          caption="Excludes soft-deleted accounts"
        />
        <StatCard
          icon={Package}
          label="Products"
          value={dashboard.summary.totalProducts}
          caption="Active, draft, and archived records"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low stock"
          value={dashboard.summary.lowStockProducts}
          caption="Variants at or below the low-stock threshold"
          tone="warning"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.98fr] 2xl:gap-7">
        <Card>
          <CardHeader>
            <CardTitle>Sales over time</CardTitle>
            <CardDescription>
              Daily paid and fulfilled order totals over the last {30} days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <AdminSalesChart data={dashboard.salesSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-end justify-between gap-4">
            <div>
              <CardTitle>Low stock products</CardTitle>
              <CardDescription>Prioritize purchasing or merchandising recovery.</CardDescription>
            </div>
            <Link href="/admin/products" className="text-sm font-medium text-primary hover:underline">
              Open inventory
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.lowStockVariants.map((variant) => {
              const stockInfo = getStockSummary(variant.stockQuantity);
              return (
                <div key={variant.id} className="rounded-[24px] border border-border/65 bg-[var(--admin-panel-muted)]/72 px-5 py-4 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-30px_rgba(15,23,42,0.42)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-text">{variant.productName}</p>
                      <p className="mt-1 text-sm text-unactive-text">{variant.variantName}</p>
                    </div>
                    <Badge variant={stockInfo.variant}>{stockInfo.label}</Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-unactive-text">
                    <span>{variant.stockQuantity} units left</span>
                    <Link
                      href={`/admin/products/${variant.productId}/variants/${variant.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      Edit variant
                    </Link>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-end justify-between gap-4">
          <div>
            <CardTitle>Latest orders</CardTitle>
            <CardDescription>Monitor the newest transactions and update statuses fast.</CardDescription>
          </div>
          <Link href="/admin/orders" className="text-sm font-medium text-primary hover:underline">
            View all orders
          </Link>
        </CardHeader>
          <CardContent className="space-y-5">
            <Table>
            <TableHeader>
              <tr>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Placed</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {dashboard.latestOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/admin/orders/${order.id}`} className="font-admin-code text-primary hover:underline">
                      {order.id.slice(0, 8)}
                    </Link>
                  </TableCell>
                  <TableCell>{order.userName}</TableCell>
                  <TableCell>
                    <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>{order.itemsCount}</TableCell>
                  <TableCell>{formatCurrency(order.totalCents)}</TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
