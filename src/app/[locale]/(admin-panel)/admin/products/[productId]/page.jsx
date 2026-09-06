import React from "react";
import { Plus } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, EmptyState, SectionTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared";
import { formatCurrency, formatDateTime } from "@/shared/lib";
import { Link } from "@/shared/i18n";
import { getProductStatusVariant, getStockSummary } from "@/entities/product";
import {
  getAdminProductDetail,
  getAdminProductFilters,
  ProductEditorForm,
  softDeleteVariantAction,
  updateProductAction,
} from "@/features/admin-products";

export const metadata = {
  title: "Product Detail | Admin",
  robots: "noindex, nofollow",
};

export default async function ProductDetailPage({ params }) {
  const { productId } = await params;
  const [product, { categories }] = await Promise.all([
    getAdminProductDetail(productId),
    getAdminProductFilters(),
  ]);

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product may have been archived or removed from active management."
      />
    );
  }

  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <SectionTitle
        title={product.name}
        action={<Link href={`/admin/products/${product.id}/variants/new`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-text transition duration-200 hover:bg-primary/90"><Plus className="h-4 w-4" />Add variant</Link>}
      />

      <div className="grid gap-[var(--admin-gap)] xl:grid-cols-[1.35fr_0.9fr]">
        <ProductEditorForm
          mode="edit"
          categories={categories}
          product={product}
          updateAction={updateProductAction}
        />

        <Card>
          <CardHeader>
            <CardTitle>Stock overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-[20px] border border-border/65 bg-[var(--admin-panel-muted)]/72 p-5 shadow-[var(--admin-shadow)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-text">Category</p>
                <Badge variant="secondary">{product.categories?.name || "Uncategorized"}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-text">Status</p>
                <Badge variant={getProductStatusVariant(product.status)}>{product.status}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-text">Total variants</p>
                <span className="text-sm text-unactive-text">{product.product_variants.length}</span>
              </div>
            </div>
            <div className="space-y-4">
              {product.product_variants.length > 0 ? (
                product.product_variants.map((variant) => {
                  const stockInfo = getStockSummary(variant.stock_quantity);
                  return (
                    <div key={variant.id} className="rounded-[20px] border border-border/65 bg-white/36 p-5 shadow-[var(--admin-shadow)] dark:bg-white/[0.02]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-text">{variant.variant_name || "Default variant"}</p>
                          <p className="mt-1 text-sm text-unactive-text">
                            {formatCurrency(variant.price_cents)} - Updated {formatDateTime(variant.updated_at)}
                          </p>
                        </div>
                        <Badge variant={stockInfo.variant}>{variant.stock_quantity} units</Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyState
                  title="No variants yet"
                  description="Create at least one purchasable variant to make the product sellable."
                  action={<Link href={`/admin/products/${product.id}/variants/new`} className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-text transition duration-200 hover:bg-primary/90">Create variant</Link>}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Variants</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-[var(--admin-gap)]">
          {product.product_variants.length > 0 ? (
            <Table>
              <TableHeader>
                <tr>
                  <TableHead>Variant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Actions</TableHead>
                </tr>
              </TableHeader>
              <TableBody>
                {product.product_variants.map((variant) => {
                  const stockInfo = getStockSummary(variant.stock_quantity);
                  const optionLabel = variant.variant_options
                    .map((item) => `${item.key}: ${item.value}`)
                    .join(" / ");

                  return (
                    <TableRow key={variant.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-text">{variant.variant_name || "Default variant"}</p>
                          <p className="text-sm text-unactive-text">
                            {variant.variant_specs.length} specs, {variant.product_images.length} images
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getProductStatusVariant(variant.status)}>{variant.status}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(variant.price_cents)}</TableCell>
                      <TableCell>
                        <Badge variant={stockInfo.variant}>{variant.stock_quantity}</Badge>
                      </TableCell>
                      <TableCell>{optionLabel || "No options"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/products/${product.id}/variants/${variant.id}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Edit
                          </Link>
                          <form action={softDeleteVariantAction}>
                            <input type="hidden" name="productId" value={product.id} />
                            <input type="hidden" name="variantId" value={variant.id} />
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
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
