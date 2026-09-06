import React from "react";

import { EmptyState, SectionTitle } from "@/shared";
import { createVariantAction, getAdminProductDetail, VariantEditorForm } from "@/features/admin-products";

export const metadata = {
  title: "Create Variant | Admin",
  robots: "noindex, nofollow",
};

export default async function NewVariantPage({ params }) {
  const { productId } = await params;
  const product = await getAdminProductDetail(productId);

  if (!product) {
    return <EmptyState title="Product not found" description="Select an active product before adding a variant." />;
  }

  return (
    <div className="flex flex-col gap-[var(--admin-gap)]">
      <SectionTitle
        title={`New variant for ${product.name}`}
      />
      <VariantEditorForm
        mode="create"
        productId={product.id}
        createAction={createVariantAction}
      />
    </div>
  );
}
