export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse All Product Categories | Shop by Department",
  description:
    "Explore our full catalog of products across all categories. Find exactly what you need with easy navigation and filter options.",
  keywords: [
    "product categories",
    "shop by department",
    "browse catalog",
    "online store",
    "all products",
  ],
  openGraph: {
    title: "Browse All Product Categories | Shop by Department",
    description:
      "Explore our full catalog of products across all categories. Find exactly what you need.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Browse All Product Categories | Shop by Department",
    description: "Explore our full catalog of products across all categories.",
  },
};

import Fetch from "@/shared/lib/fetch";
import CategoryCard from "@/features/home/ui/CategorySection/CategoryCard";
import React from "react";
import { getTranslations } from "next-intl/server";

const page = async () => {
  const t = await getTranslations("common");
  let data = await Fetch("/api/categories");

  if (!data) return <div>{t("error")}</div>;

  return (
    <div className="h-full grid grid-cols-2 md:grid-cols-5 gap-10 p-5 md:p-20">
      {Array.isArray(data)
        ? data.map((category) => (
            <CategoryCard
              Scroll={false}
              Category={category}
              kidsList={data.filter((el) => el.parent_id === category.id)}
              key={category.id}
            />
          ))
        : null}
    </div>
  );
};

export default page;
