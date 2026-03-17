"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Select, Textarea } from "@/shared";

const CouponEditorForm = ({ mode, coupon, createAction, updateAction }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const submit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createAction(formData);
          toast.success("Coupon created.");
          router.replace("/admin/coupons");
        } else {
          await updateAction(formData);
          toast.success("Coupon updated.");
          router.refresh();
        }
      } catch (error) {
        toast.error(error.message || "Could not save coupon.");
      }
    });
  };

  return (
    <form onSubmit={submit} className="space-y-7">
      {coupon ? <input type="hidden" name="couponId" value={coupon.id} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Create coupon" : "Edit coupon"}</CardTitle>
          <CardDescription>
            Configure discount logic, usage controls, and expiration for promotions.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 rounded-[26px] border border-border/60 bg-white/30 p-5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.28)] dark:bg-white/[0.02] lg:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Code</span>
            <Input name="couponCode" required defaultValue={coupon?.coupon_code || ""} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Type</span>
            <Select name="type" defaultValue={coupon?.type || "fixed_amount"}>
              <option value="fixed_amount">Fixed amount</option>
              <option value="percentage">Percentage</option>
            </Select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Discount value</span>
            <Input
              name="value"
              required
              type="number"
              min="0"
              defaultValue={coupon?.type === "percentage" ? coupon?.discount_percent || 0 : coupon?.discount_amount || 0}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Usage limit</span>
            <Input name="usageLimit" type="number" min="1" defaultValue={coupon?.max_usage || ""} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">Expiration date</span>
            <Input
              name="expiresAt"
              type="datetime-local"
              defaultValue={coupon?.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : ""}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-text">One-time use</span>
            <Select name="isOneTime" defaultValue={coupon?.is_one_time ? "true" : "false"}>
              <option value="true">One-time</option>
              <option value="false">Multi-use</option>
            </Select>
          </label>
          <label className="flex flex-col gap-2 lg:col-span-2">
            <span className="text-sm font-medium text-text">Description</span>
            <Textarea name="description" rows={4} defaultValue={coupon?.description || ""} />
          </label>
          <div className="rounded-[22px] border border-border/60 bg-[var(--admin-panel-muted)]/64 p-4 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.18em] text-unactive-text">Promotion note</p>
            <p className="mt-2 text-sm leading-6 text-text">
              Percentage discounts use `discount_percent`, fixed amounts use `discount_amount`, and both remain in the same coupon record for reporting compatibility.
            </p>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : mode === "create" ? "Create coupon" : "Save coupon"}
        </Button>
      </div>
    </form>
  );
};

export default CouponEditorForm;
