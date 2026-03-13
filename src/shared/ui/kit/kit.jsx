import React from "react";

import { cn } from "@/shared/utils/cx";

const buttonVariants = {
  default:
    "bg-primary text-primary-text shadow-[0_20px_40px_-20px_rgba(30,64,175,0.65)] hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_26px_50px_-24px_rgba(30,64,175,0.58)]",
  secondary:
    "border border-transparent bg-[var(--admin-panel-muted)] text-text hover:-translate-y-0.5 hover:border-primary/15 hover:bg-[color:var(--admin-highlight-soft)]/45",
  outline:
    "border border-border/80 bg-white/50 text-text hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white dark:bg-transparent dark:hover:bg-surface",
  ghost: "bg-transparent text-text hover:-translate-y-0.5 hover:bg-surface/80",
  danger:
    "bg-[color:var(--admin-danger)] text-white shadow-[0_18px_38px_-22px_rgba(185,28,28,0.75)] hover:-translate-y-0.5 hover:opacity-95",
};

const buttonSizes = {
  sm: "h-9 px-3 text-sm",
  default: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
};

export const Button = ({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      {...props}
    />
  );
};

export const Card = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-[var(--admin-card-radius)] border border-[color:var(--admin-panel-border,var(--border))] bg-[color:var(--admin-panel)]/92 text-text shadow-[var(--admin-shadow-soft)] backdrop-blur-[var(--admin-blur)]",
        className,
      )}
      {...props}
    />
  );
};

export const CardHeader = ({ className, ...props }) => {
  return <div className={cn("flex flex-col gap-2 px-[var(--admin-card-padding)] pt-[var(--admin-card-padding)] pb-6", className)} {...props} />;
};

export const CardTitle = ({ className, ...props }) => {
  return (
    <h2
      className={cn("font-admin-sans text-[1.15rem] font-semibold tracking-[-0.03em] text-text", className)}
      {...props}
    />
  );
};

export const CardDescription = ({ className, ...props }) => {
  return <p className={cn("max-w-2xl text-sm leading-6 text-unactive-text", className)} {...props} />;
};

export const CardContent = ({ className, ...props }) => {
  return <div className={cn("px-[var(--admin-card-padding)] pb-[var(--admin-card-padding)] pt-0", className)} {...props} />;
};

export const CardFooter = ({ className, ...props }) => {
  return <div className={cn("flex items-center px-[var(--admin-card-padding)] pb-[var(--admin-card-padding)] pt-0", className)} {...props} />;
};

export const Input = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-input-text transition duration-200 placeholder:text-input-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]",
        className,
      )}
      {...props}
    />
  );
};

export const Textarea = ({ className, rows = 6, ...props }) => {
  return (
    <textarea
      rows={rows}
      className={cn(
        "flex min-h-[140px] w-full rounded-2xl border border-border bg-input px-3 py-2 text-sm text-input-text transition duration-200 placeholder:text-input-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]",
        className,
      )}
      {...props}
    />
  );
};

export const Select = ({ className, ...props }) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-xl border border-border bg-input px-3 py-2 text-sm text-input-text transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]",
        className,
      )}
      {...props}
    />
  );
};

const badgeVariants = {
  default: "bg-primary/12 text-primary",
  secondary: "bg-[var(--admin-panel-muted)] text-text",
  outline: "border border-border bg-transparent text-unactive-text",
  success: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  warning: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
  danger: "bg-rose-500/12 text-rose-700 dark:text-rose-300",
};

export const Badge = ({ className, variant = "default", ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-[0.02em]",
        "border border-transparent",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
};

export const Table = ({ className, ...props }) => {
  return (
    <div className="overflow-hidden rounded-[24px] border border-border/60 bg-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] dark:bg-white/[0.02]">
      <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-collapse text-sm", className)} {...props} />
      </div>
    </div>
  );
};

export const TableHeader = ({ className, ...props }) => {
  return <thead className={cn("border-b border-border/80 bg-white/50 dark:bg-white/[0.03]", className)} {...props} />;
};

export const TableBody = ({ className, ...props }) => {
  return <tbody className={cn("divide-y divide-border/60", className)} {...props} />;
};

export const TableRow = ({ className, ...props }) => {
  return (
    <tr
      className={cn(
        "transition duration-200 hover:bg-[color:var(--admin-panel-muted)]/72",
        className,
      )}
      {...props}
    />
  );
};

export const TableHead = ({ className, ...props }) => {
  return (
    <th
      className={cn(
        "px-5 py-4 text-left font-admin-code text-[11px] font-semibold uppercase tracking-[0.24em] text-unactive-text",
        className,
      )}
      {...props}
    />
  );
};

export const TableCell = ({ className, ...props }) => {
  return <td className={cn("px-5 py-4 align-top text-text", className)} {...props} />;
};

export const EmptyState = ({ title, description, action, className }) => {
  return (
    <Card className={cn("border-dashed", className)}>
      <CardContent className="flex min-h-[260px] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[var(--admin-panel-muted)] text-primary shadow-[var(--admin-shadow-soft)]">
          <span className="font-admin-code text-lg">::</span>
        </div>
        <div className="space-y-2">
          <h3 className="font-admin-sans text-xl font-semibold tracking-[-0.03em] text-text">{title}</h3>
          {description ? <p className="max-w-lg text-sm leading-6 text-unactive-text">{description}</p> : null}
        </div>
        {action}
      </CardContent>
    </Card>
  );
};

export const SectionTitle = ({ eyebrow, title, description, action }) => {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {eyebrow ? (
          <span className="inline-flex items-center rounded-full border border-primary/18 bg-primary/8 px-3 py-1 font-admin-code text-[11px] font-semibold uppercase tracking-[0.28em] text-primary">
            {eyebrow}
          </span>
        ) : null}
        <div className="space-y-2">
          <h1 className="font-admin-sans text-3xl font-semibold tracking-[-0.05em] text-text lg:text-[2.35rem]">
            {title}
          </h1>
          {description ? <p className="max-w-3xl text-[15px] leading-7 text-unactive-text">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </div>
  );
};

export const StatCard = ({ icon: Icon, label, value, caption, tone = "default" }) => {
  const toneClass = {
    default: "from-white via-white to-[var(--admin-panel-muted)] dark:from-slate-950 dark:via-slate-950 dark:to-slate-900",
    warning: "from-amber-50 via-white to-amber-100 dark:from-slate-950 dark:via-slate-950 dark:to-amber-950/40",
    success: "from-emerald-50 via-white to-emerald-100 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/40",
  };

  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br", toneClass[tone] || toneClass.default)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-5">
          <div className="space-y-4">
            <p className="font-admin-code text-[11px] font-semibold uppercase tracking-[0.22em] text-unactive-text">
              {label}
            </p>
            <div className="space-y-1.5">
              <p className="font-admin-sans text-[2rem] font-semibold tracking-[-0.05em] text-text lg:text-[2.4rem]">
                {value}
              </p>
              {caption ? <p className="text-sm leading-6 text-unactive-text">{caption}</p> : null}
            </div>
          </div>
          {Icon ? (
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] border border-white/40 bg-white/65 text-primary shadow-[var(--admin-shadow-soft)] dark:border-white/8 dark:bg-white/[0.04]">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
