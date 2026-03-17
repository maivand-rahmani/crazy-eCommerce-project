import React from "react";

import { getUserStateVariant } from "@/entities/user";
import { FilterSubmitButton, Pagination } from "@/features/admin-common";
import { getAdminUsers } from "@/features/admin-users";
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, Input, SectionTitle, Select, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared";
import { formatDateTime } from "@/shared/lib";
import { Link } from "@/shared/i18n";

export const metadata = {
  title: "Admin Users | Cyber",
  robots: "noindex, nofollow",
};

export default async function UsersPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const usersResult = await getAdminUsers(resolvedSearchParams);

  return (
    <div className="space-y-8 lg:space-y-10">
      <SectionTitle
        eyebrow="Identity operations"
        title="Users"
        description="Search by email, inspect order history, and control account state without leaving the admin workspace."
      />

      <form className="space-y-4">
        <Card>
          <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.3fr_0.8fr_0.8fr] lg:items-end">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Email</span>
              <Input defaultValue={usersResult.filters.query} name="query" placeholder="Search by email" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Role</span>
              <Select defaultValue={usersResult.filters.role || ""} name="role">
                <option value="">Any role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">State</span>
              <Select defaultValue={usersResult.filters.blocked || ""} name="blocked">
                <option value="">Any state</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </Select>
            </label>
            <FilterSubmitButton />
          </CardContent>
        </Card>
      </form>

      {usersResult.users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different email or adjust role and state filters." />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Users table</CardTitle>
            <CardDescription>
              Showing {usersResult.pagination.total} customer and admin accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Created</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {usersResult.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <Link href={`/admin/users/${user.id}`} className="font-medium text-primary hover:underline">
                          {user.name || user.email}
                        </Link>
                        <p className="text-sm text-unactive-text">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getUserStateVariant(user)}>
                        {user.deletedAt ? "Deleted" : user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.ordersCount}</TableCell>
                    <TableCell>{formatDateTime(user.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination pathname="/admin/users" searchParams={resolvedSearchParams} pagination={usersResult.pagination} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
