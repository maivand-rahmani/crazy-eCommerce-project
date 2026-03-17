"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ImageFieldManager, KeyValueRowsEditor } from "@/features/admin-common";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Textarea,
} from "@/shared";

const ProductEditorForm = ({
  mode,
  categories,
  product,
  createAction,
  updateAction,
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [specRows, setSpecRows] = useState(() => {
    const specs = product?.product_specs?.map((spec) => ({
      id: `${spec.id}`,
      key: spec.key,
      value: spec.value || "",
    }));
    return specs?.length ? specs : [{ id: crypto.randomUUID(), key: "", value: "" }];
  });
  const [retainedImageIds, setRetainedImageIds] = useState(
    product?.product_images?.map((image) => image.id) || [],
  );
  const [newFiles, setNewFiles] = useState([]);

  const action = mode === "create" ? createAction : updateAction;

  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.delete("newImages");
    newFiles.forEach((file) => formData.append("newImages", file));
    formData.set("specs", JSON.stringify(specRows));
    formData.set("retainedImageIds", JSON.stringify(retainedImageIds));

    startTransition(async () => {
      try {
        await action(formData);
        toast.success(mode === "create" ? "Product created." : "Product updated.");
        router.refresh();
        if (mode === "create") {
          router.replace("/admin/products");
        }
      } catch (error) {
        toast.error(error.message || "Could not save product.");
      }
    });
  };

  const title = mode === "create" ? "Create product" : "Edit product";
  const description =
    mode === "create"
      ? "Create the base product record before adding variants and operational data."
      : "Update catalog metadata, specs, imagery, and merchandising status.";

  return (
    <form onSubmit={submit} className="space-y-7">
      {product ? <input type="hidden" name="productId" value={product.id} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-7 lg:grid-cols-[1.35fr_0.85fr]">
            <div className="space-y-5 rounded-[26px] border border-border/60 bg-white/30 p-5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.28)] dark:bg-white/[0.02]">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text">Product name</span>
                <Input name="name" required defaultValue={product?.name || ""} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text">Description</span>
                <Textarea name="description" defaultValue={product?.description || ""} />
              </label>
            </div>
            <div className="space-y-5 rounded-[26px] border border-border/60 bg-white/30 p-5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.28)] dark:bg-white/[0.02]">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text">Category</span>
                <Select name="categoryId" defaultValue={product?.category_id ? `${product.category_id}` : ""}>
                  <option value="">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-text">Status</span>
                <Select name="status" defaultValue={product?.status || "draft"}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </Select>
              </label>
              <div className="rounded-[22px] border border-border/60 bg-[var(--admin-panel-muted)]/64 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-unactive-text">Workflow</p>
                <p className="mt-2 text-sm leading-6 text-text">
                  Save the base product first, then attach sellable variants, pricing, stock, and variant-specific media.
                </p>
              </div>
            </div>
          </div>
          <KeyValueRowsEditor
            label="Product specifications"
            value={specRows}
            onChange={setSpecRows}
            keyPlaceholder="Spec name"
            valuePlaceholder="Spec value"
          />
          <ImageFieldManager
            title="Product gallery"
            existingImages={product?.product_images || []}
            retainedImageIds={retainedImageIds}
            onRetainedImageIdsChange={setRetainedImageIds}
            newFiles={newFiles}
            onNewFilesChange={setNewFiles}
          />
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : mode === "create" ? "Create product" : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

export default ProductEditorForm;
