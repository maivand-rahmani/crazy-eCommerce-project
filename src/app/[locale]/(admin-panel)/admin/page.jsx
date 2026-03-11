import React from "react";

export const metadata = {
  title: "Admin Dashboard | Store Management",
  description:
    "Store administration panel. Manage products, orders, customers, and analytics from one centralized dashboard.",
  robots: "noindex, nofollow",
  openGraph: {
    title: "Admin Dashboard | Store Management",
    description: "Store administration panel for managing your e-commerce business.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Admin Dashboard | Store Management",
    description: "Store administration panel.",
  },
};

const page = async () => {
  return <div>
    <h1 className="text-2xl text-text font-bold mb-4">Admin Dashboard</h1>
  </div>;
};

export default page;
