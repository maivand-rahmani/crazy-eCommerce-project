import React from "react";

import { getOrderStatusVariant, getReturnStatusVariant } from "@/entities/order";
import { Pagination } from "@/features/admin-common";
import { getAdminOrders } from "@/features/admin-orders";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, Input, SectionTitle, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared";
import { formatCurrency, formatDateTime } from "@/shared/lib";
import { Link } from "@/shared/i18n";
import { FilterSubmitButton } from "@/features/admin-common";

export const metadata = {
  title: "Admin Orders | Cyber",
  robots: "noindex, nofollow",
};

export default async function OrdersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const ordersResult = await getAdminOrders(resolvedSearchParams);

  return (
    <div className="space-y-8 lg:space-y-10">
      <SectionTitle
        eyebrow="Fulfillment control"
        title="Orders"
        description="Search live orders, monitor return activity, and drill down into line-item detail."
      />

      <form className="space-y-4">
        <Card>
          <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_0.7fr_0.9fr_0.8fr_0.8fr] lg:items-end">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Order ID</span>
              <Input defaultValue={ordersResult.filters.query} name="query" placeholder="Search by order id" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Status</span>
              <Select defaultValue={ordersResult.filters.status || ""} name="status">
                <option value="">Any status</option>
                <option value="created">Created</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Customer</span>
              <Input defaultValue={ordersResult.filters.user} name="user" placeholder="Search by email or name" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">From</span>
              <Input defaultValue={ordersResult.filters.dateFrom} name="dateFrom" type="date" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">To</span>
              <Input defaultValue={ordersResult.filters.dateTo} name="dateTo" type="date" />
            </label>
            <FilterSubmitButton />
          </CardContent>
        </Card>
      </form>

      {ordersResult.orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Adjust your filters or wait for new customer activity to arrive."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Orders table</CardTitle>
            <CardDescription>
              Showing {ordersResult.pagination.total} total orders across the selected filters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Return</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Placed</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {ordersResult.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`} className="font-admin-code text-primary hover:underline">
                        {order.id.slice(0, 8)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text">{order.customerName}</p>
                        <p className="text-sm text-unactive-text">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getReturnStatusVariant(order.returnStatus)}>{order.returnStatus}</Badge>
                    </TableCell>
                    <TableCell>{order.itemsCount}</TableCell>
                    <TableCell>{formatCurrency(order.totalCents)}</TableCell>
                    <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination pathname="/admin/orders" searchParams={resolvedSearchParams} pagination={ordersResult.pagination} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
