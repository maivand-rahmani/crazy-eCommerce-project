"use client";
import React from "react";
import { Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { Link } from "@/shared/i18n";
import { isAdmin } from "@/shared/lib/auth/roles";

/**
 * Small pencil button linking a public page to its admin counterpart.
 * Renders nothing for non-admins (and nothing until a session resolves).
 */
const AdminQuickLink = ({ href, label = "Edit in admin" }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (!isAdmin(session?.user)) {
    return null;
  }

  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/60 bg-card/70 text-muted opacity-60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:text-text hover:opacity-100 hover:shadow-md"
    >
      <Pencil className="h-3.5 w-3.5" />
    </Link>
  );
};

export default AdminQuickLink;
