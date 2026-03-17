import Image from "next/image";
import React from "react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, SectionTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared";
import { formatCurrency, formatDateTime } from "@/shared/lib";
import { Link } from "@/shared/i18n";
import { getProductStatusVariant, getStockSummary } from "@/entities/product";
import { Pagination } from "@/features/admin-common";
import {
  getAdminProductFilters,
  getAdminProducts,
  ProductFilters,
  softDeleteProductAction,
} from "@/features/admin-products";

export const metadata = {
  title: "Admin Products | Cyber",
  description: "Search, filter, create, and manage products and inventory in the admin panel.",
  robots: "noindex, nofollow",
};

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const [{ categories }, productsResult] = await Promise.all([
    getAdminProductFilters(),
    getAdminProducts(resolvedSearchParams),
  ]);

  return (
    <div className="space-y-8 lg:space-y-10">
      <SectionTitle
        eyebrow="Catalog controls"
        title="Products"
        description="Manage product records, monitor stock posture, and jump directly into variant-level editing."
        action={<Link href="/admin/products/new" className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-text transition duration-200 hover:bg-primary/90">Create product</Link>}
      />

      <ProductFilters filters={productsResult.filters} categories={categories} />

      {productsResult.products.length === 0 ? (
        <EmptyState
          title="No products match these filters"
          description="Try another search term, change the inventory filter, or create a new product record."
          action={<Link href="/admin/products/new" className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-text transition duration-200 hover:bg-primary/90">Create product</Link>}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Product table</CardTitle>
            <CardDescription>
              Showing {productsResult.pagination.total} catalog records across status, category, and stock filters.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Variants</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Starting price</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {productsResult.products.map((product) => {
                  const stockInfo = getStockSummary(product.totalStock);

                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-border bg-[var(--admin-panel-muted)]">
                            <Image fill src={product.imageUrl} alt={product.name} className="object-cover" />
                          </div>
                          <div>
                            <p className="font-medium text-text">{product.name}</p>
                            <p className="line-clamp-1 max-w-[280px] text-sm text-unactive-text">
                              {product.description || "No description provided."}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getProductStatusVariant(product.status)}>{product.status}</Badge>
                      </TableCell>
                      <TableCell>{product.categoryName}</TableCell>
                      <TableCell>{product.variantsCount}</TableCell>
                      <TableCell>
                        <Badge variant={stockInfo.variant}>{product.totalStock} units</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(product.minPrice)}</TableCell>
                      <TableCell>{formatDateTime(product.updatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/admin/products/${product.id}`} className="text-sm font-medium text-primary hover:underline">
                            Open
                          </Link>
                          <form action={softDeleteProductAction}>
                            <input type="hidden" name="productId" value={product.id} />
                            <button className="text-sm font-medium text-rose-500 hover:underline" type="submit">
                              Archive
                            </button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Pagination pathname="/admin/products" searchParams={resolvedSearchParams} pagination={productsResult.pagination} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
