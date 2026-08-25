import React from "react";

import { Card, CardContent, CardHeader, CardTitle, SectionTitle } from "@/shared";

export const metadata = {
  title: "Admin Settings | Cyber",
  robots: "noindex, nofollow",
};

export default function SettingsPage() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <SectionTitle title="Settings" />
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-unactive-text">
          No settings configured yet.
        </CardContent>
      </Card>
    </div>
  );
}
