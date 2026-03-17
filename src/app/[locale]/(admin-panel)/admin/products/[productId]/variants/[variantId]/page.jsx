import React from "react";

import { EmptyState, SectionTitle } from "@/shared";
import { getAdminVariantDetail, updateVariantAction, VariantEditorForm } from "@/features/admin-products";

export const metadata = {
  title: "Variant Detail | Admin",
  robots: "noindex, nofollow",
};

export default async function VariantDetailPage({ params }) {
  const { productId, variantId } = await params;
  const variant = await getAdminVariantDetail(productId, variantId);

  if (!variant) {
    return <EmptyState title="Variant not found" description="This variant may have been archived or moved." />;
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="SKU detail"
        title={variant.variant_name || "Variant editor"}
        description={`Manage inventory, media, and spec payload for ${variant.products?.name || "this product"}.`}
      />
      <VariantEditorForm
        mode="edit"
        productId={variant.product_id}
        variant={variant}
        updateAction={updateVariantAction}
      />
    </div>
  );
}
