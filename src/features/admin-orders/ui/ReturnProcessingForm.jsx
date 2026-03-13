"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button, Select, Textarea } from "@/shared";

const ReturnProcessingForm = ({ orderId, currentStatus, currentReason, action }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await action(formData);
        toast.success("Return request updated.");
        router.refresh();
      } catch (error) {
        toast.error(error.message || "Could not update return request.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[24px] border border-border/60 bg-white/32 p-4 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.28)] dark:bg-white/[0.02]">
      <input type="hidden" name="orderId" value={orderId} />
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.18em] text-unactive-text">Return workflow</span>
        <Select name="returnStatus" defaultValue={currentStatus}>
          <option value="none">No return</option>
          <option value="requested">Requested</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="processed">Processed</option>
        </Select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.18em] text-unactive-text">Reason / Notes</span>
        <Textarea name="returnReason" defaultValue={currentReason || ""} rows={4} />
      </label>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Save return"}
      </Button>
    </form>
  );
};

export default ReturnProcessingForm;
