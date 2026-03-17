"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/shared";

const UserStateForm = ({ userId, isBlocked, action, label }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await action(formData);
        toast.success(label || "User state updated.");
        router.refresh();
      } catch (error) {
        toast.error(error.message || "Could not update user.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="isBlocked" value={isBlocked ? "false" : "true"} />
      <Button type="submit" variant={isBlocked ? "secondary" : "danger"} disabled={isPending}>
        {isPending ? "Saving..." : isBlocked ? "Unblock user" : "Block user"}
      </Button>
    </form>
  );
};

export default UserStateForm;
