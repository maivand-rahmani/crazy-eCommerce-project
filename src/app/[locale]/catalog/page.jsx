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

import { getCategories } from "@/features/catalog";
import { CategoryCard } from "@/features/home";
import React from "react";
import { getTranslations } from "next-intl/server";

const page = async () => {
  const t = await getTranslations("common");
  let data = await getCategories();

  if (!data) return <div>{t("error")}</div>;

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8 md:py-14 xl:px-10">
      <div className="space-y-3 text-center md:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-text md:text-4xl">
          {metadata.title}
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-6 text-muted md:mx-0 md:text-base">
          {metadata.description}
        </p>
      </div>

      <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
        {Array.isArray(data)
          ? data.map((category) => (
              <div key={category.id} className="w-full max-w-80">
                <CategoryCard
                  Scroll={false}
                  Category={category}
                  kidsList={data.filter((el) => el.parent_id === category.id)}
                />
              </div>
            ))
          : null}
      </div>
    </section>
  );
};

export default page;
