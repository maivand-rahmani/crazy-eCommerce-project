"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button, Select } from "@/shared";

const OrderStatusForm = ({ orderId, currentStatus, action }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Order status updated.");
        router.refresh();
      } catch (error) {
        toast.error(error.message || "Could not update order status.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[24px] border border-border/60 bg-white/32 p-4 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.28)] dark:bg-white/[0.02]">
      <input type="hidden" name="orderId" value={orderId} />
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.18em] text-unactive-text">Fulfillment state</span>
        <Select name="status" defaultValue={currentStatus}>
          <option value="created">Created</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </label>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update status"}
      </Button>
    </form>
  );
};

export default OrderStatusForm;
