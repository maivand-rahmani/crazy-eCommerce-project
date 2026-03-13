"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button, Select } from "@/shared";

const UserRoleForm = ({ userId, currentRole, action }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await action(formData);
        toast.success("User role updated.");
        router.refresh();
      } catch (error) {
        toast.error(error.message || "Could not update user role.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      <Select name="role" defaultValue={currentRole}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </Select>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : "Update role"}
      </Button>
    </form>
  );
};

export default UserRoleForm;
