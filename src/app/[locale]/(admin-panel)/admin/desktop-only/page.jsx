import React from "react";
import { MonitorOff } from "lucide-react";

import { Card, CardContent, SectionTitle } from "@/shared";

export const metadata = {
  title: "Desktop Only | Admin",
  robots: "noindex, nofollow",
};

export default function DesktopOnlyPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="max-w-xl space-y-6 text-center">
        <SectionTitle title="Desktop only" />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-10">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <MonitorOff className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium text-text">This page is available on desktop devices only.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
