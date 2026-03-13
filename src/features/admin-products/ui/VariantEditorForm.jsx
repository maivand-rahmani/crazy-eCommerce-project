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
} from "@/shared";

const VariantEditorForm = ({ mode, productId, variant, createAction, updateAction }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optionRows, setOptionRows] = useState(() => {
    const options = variant?.variant_options?.map((item) => ({
      id: `${item.id}`,
      key: item.key,
      value: item.value || "",
    }));

    return options?.length ? options : [{ id: crypto.randomUUID(), key: "", value: "" }];
  });
  const [specRows, setSpecRows] = useState(() => {
    const specs = variant?.variant_specs?.map((item) => ({
      id: `${item.id}`,
      key: item.key,
      value: item.value || "",
    }));

    return specs?.length ? specs : [{ id: crypto.randomUUID(), key: "", value: "" }];
  });
  const [retainedImageIds, setRetainedImageIds] = useState(
    variant?.product_images?.map((image) => image.id) || [],
  );
  const [newFiles, setNewFiles] = useState([]);

  const action = mode === "create" ? createAction : updateAction;

  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.delete("newImages");
    newFiles.forEach((file) => formData.append("newImages", file));
    formData.set("productId", `${productId}`);
    formData.set("options", JSON.stringify(optionRows));
    formData.set("specs", JSON.stringify(specRows));
    formData.set("retainedImageIds", JSON.stringify(retainedImageIds));

    startTransition(async () => {
      try {
        await action(formData);
        toast.success(mode === "create" ? "Variant created." : "Variant updated.");
        router.refresh();
        if (mode === "create") {
          router.replace(`/admin/products/${productId}`);
        }
      } catch (error) {
        toast.error(error.message || "Could not save variant.");
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-7">
      {variant ? <input type="hidden" name="variantId" value={variant.id} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Add variant" : "Edit variant"}</CardTitle>
          <CardDescription>
            Manage purchasable options, pricing, stock, variant specs, and media.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-5 rounded-[26px] border border-border/60 bg-white/30 p-5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.28)] dark:bg-white/[0.02] lg:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Variant name</span>
              <Input name="variantName" required defaultValue={variant?.variant_name || ""} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Status</span>
              <Select name="status" defaultValue={variant?.status || "draft"}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </Select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Price (cents)</span>
              <Input name="priceCents" required type="number" min="0" defaultValue={variant?.price_cents || 0} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-text">Stock quantity</span>
              <Input
                name="stockQuantity"
                required
                type="number"
                min="0"
                defaultValue={variant?.stock_quantity || 0}
              />
            </label>
            <div className="rounded-[22px] border border-border/60 bg-[var(--admin-panel-muted)]/64 p-4 lg:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-unactive-text">SKU note</p>
              <p className="mt-2 text-sm leading-6 text-text">
                Each variant stores its own stock, pricing, specs, and gallery, so merchandising can stay clean even with many options.
              </p>
            </div>
          </div>
          <KeyValueRowsEditor
            label="Variant options"
            value={optionRows}
            onChange={setOptionRows}
            keyPlaceholder="Option name"
            valuePlaceholder="Option value"
          />
          <KeyValueRowsEditor
            label="Variant specifications"
            value={specRows}
            onChange={setSpecRows}
            keyPlaceholder="Spec name"
            valuePlaceholder="Spec value"
          />
          <ImageFieldManager
            title="Variant gallery"
            existingImages={variant?.product_images || []}
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
          {isPending ? "Saving..." : mode === "create" ? "Create variant" : "Save variant"}
        </Button>
      </div>
    </form>
  );
};

export default VariantEditorForm;
