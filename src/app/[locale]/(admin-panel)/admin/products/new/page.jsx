import React from "react";

import { SectionTitle } from "@/shared";
import { getAdminProductFilters, ProductEditorForm, createProductAction } from "@/features/admin-products";

export const metadata = {
  title: "Create Product | Admin",
  robots: "noindex, nofollow",
};

export default async function NewProductPage() {
  const { categories } = await getAdminProductFilters();

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Catalog creation"
        title="New product"
        description="Start with the core record, then add purchasable variants from the product detail view."
      />
      <ProductEditorForm mode="create" categories={categories} createAction={createProductAction} />
    </div>
  );
}
