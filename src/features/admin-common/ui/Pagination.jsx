import React from "react";

import { Link } from "@/shared/i18n";
import { cn } from "@/shared/utils/cx";

const buildPageHref = (pathname, searchParams, page) => {
  const params = new URLSearchParams();

  Object.entries(searchParams || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
      return;
    }
    params.set(key, value);
  });

  params.set("page", `${page}`);
  return `${pathname}?${params.toString()}`;
};

const Pagination = ({ pathname, searchParams, pagination }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const pages = [];
  const start = Math.max(1, pagination.page - 2);
  const end = Math.min(pagination.totalPages, pagination.page + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-border/70 pt-5 text-sm text-unactive-text lg:flex-row lg:items-center lg:justify-between">
      <p>
        Showing page <span className="font-semibold text-text">{pagination.page}</span> of{" "}
        <span className="font-semibold text-text">{pagination.totalPages}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildPageHref(pathname, searchParams, Math.max(1, pagination.page - 1))}
          className={cn(
            "inline-flex h-9 items-center rounded-xl border px-3 transition duration-200",
            pagination.hasPreviousPage
              ? "border-border bg-surface text-text hover:bg-[var(--admin-panel-muted)]"
              : "pointer-events-none border-border/50 bg-surface/50 text-unactive-text",
          )}
        >
          Previous
        </Link>
        {pages.map((page) => (
          <Link
            key={page}
            href={buildPageHref(pathname, searchParams, page)}
            className={cn(
              "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 transition duration-200",
              page === pagination.page
                ? "border-primary bg-primary text-primary-text"
                : "border-border bg-surface text-text hover:bg-[var(--admin-panel-muted)]",
            )}
          >
            {page}
          </Link>
        ))}
        <Link
          href={buildPageHref(
            pathname,
            searchParams,
            Math.min(pagination.totalPages, pagination.page + 1),
          )}
          className={cn(
            "inline-flex h-9 items-center rounded-xl border px-3 transition duration-200",
            pagination.hasNextPage
              ? "border-border bg-surface text-text hover:bg-[var(--admin-panel-muted)]"
              : "pointer-events-none border-border/50 bg-surface/50 text-unactive-text",
          )}
        >
          Next
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
