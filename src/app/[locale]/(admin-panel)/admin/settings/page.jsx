import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, SectionTitle } from "@/shared";

export const metadata = {
  title: "Admin Settings | Cyber",
  robots: "noindex, nofollow",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Workspace settings"
        title="Settings"
        description="This panel is reserved for future system-wide controls, audit preferences, and operational configuration."
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming next</CardTitle>
          <CardDescription>
            Expand this area with fulfillment automations, notification rules, or audit logging once the domain requirements are finalized.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-unactive-text">
          The admin core is now focused on products, variants, orders, users, and coupons. Keep settings lean until operational workflows are defined.
        </CardContent>
      </Card>
    </div>
  );
}
