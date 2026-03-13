import React from "react";

import { Card, CardContent, CardHeader } from "@/shared";

const shimmer = "animate-pulse rounded-[18px] bg-[linear-gradient(90deg,rgba(255,255,255,0.14),rgba(255,255,255,0.34),rgba(255,255,255,0.14))] bg-[length:200%_100%] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.04),rgba(255,255,255,0.08),rgba(255,255,255,0.04))]";

export const AdminHeaderSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className={`h-7 w-32 ${shimmer}`} />
      <div className={`h-12 w-[34rem] max-w-full ${shimmer}`} />
      <div className={`h-5 w-[42rem] max-w-full ${shimmer}`} />
    </div>
  );
};

export const AdminStatsSkeleton = () => {
  return (
    <div className="grid gap-5 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="space-y-4 p-6">
            <div className={`h-4 w-28 ${shimmer}`} />
            <div className={`h-10 w-20 ${shimmer}`} />
            <div className={`h-4 w-40 ${shimmer}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const AdminPanelSkeleton = ({ rows = 5 }) => {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className={`h-6 w-40 ${shimmer}`} />
        <div className={`h-4 w-72 ${shimmer}`} />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid gap-3 rounded-[22px] border border-border/55 bg-white/30 p-4 dark:bg-white/[0.02] md:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div className={`h-12 ${shimmer}`} />
            <div className={`h-12 ${shimmer}`} />
            <div className={`h-12 ${shimmer}`} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export const AdminDetailSkeleton = () => {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
      <AdminPanelSkeleton rows={4} />
      <div className="space-y-6">
        <AdminPanelSkeleton rows={2} />
        <AdminPanelSkeleton rows={2} />
      </div>
    </div>
  );
};
