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
    <div className="space-y-8 lg:space-y-10">
      <SectionTitle
        title="New product"
      />
      <ProductEditorForm mode="create" categories={categories} createAction={createProductAction} />
    </div>
  );
}
