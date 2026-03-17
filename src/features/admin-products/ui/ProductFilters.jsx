import React from "react";

import { FilterSubmitButton } from "@/features/admin-common";
import { Card, CardContent, Input, Select } from "@/shared";
import { Link } from "@/shared/i18n";

const ProductFilters = ({ filters, categories }) => {
  return (
    <form className="space-y-4">
      <Card>
        <CardContent className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto] lg:items-end">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Search</span>
            <Input defaultValue={filters.query} name="query" placeholder="Search by product name" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Status</span>
            <Select defaultValue={filters.status || ""} name="status">
              <option value="">All statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </Select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Category</span>
            <Select defaultValue={filters.category || ""} name="category">
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Stock</span>
            <Select defaultValue={filters.stock || ""} name="stock">
              <option value="">Any stock</option>
              <option value="available">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </Select>
          </label>
          <div className="flex items-center gap-3 lg:justify-end">
            <FilterSubmitButton />
            <Link
              href="/admin/products"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-transparent px-4 text-sm font-medium text-text transition duration-200 hover:bg-surface"
            >
              Reset
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default ProductFilters;
