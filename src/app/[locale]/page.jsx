export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop Premium Products Online | Fast Shipping & Best Deals",
  description:
    "Discover top-quality products with fast shipping. Browse categories, find exclusive deals, and shop safely on our trusted e-commerce platform.",
  keywords: [
    "online shopping",
    "best deals",
    "fast shipping",
    "premium products",
    "electronics",
    "fashion",
    "home goods",
  ],
  openGraph: {
    title: "Shop Premium Products Online | Fast Shipping & Best Deals",
    description:
      "Discover top-quality products with fast shipping. Browse categories, find exclusive deals and shop safely.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Premium Products Online | Fast Shipping & Best Deals",
    description:
      "Discover top-quality products with fast shipping. Browse categories, find exclusive deals.",
  },
};

import React, { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Miniloader, ProductsRenderSkeleton } from "@/shared";
import { Main, CategorySection, FeaturedProducts } from "@/features/home";
import { DragScrollContainer } from "@/shared/ui/ScrollContainer";

const Page = async () => {
  const t = await getTranslations("home");

  return (
    <div className="mx-auto max-w-[1440px]">
      <Suspense fallback={<Miniloader />}>
        <Main />
      </Suspense>
      <Suspense fallback={<Miniloader />}>
        <CategorySection />
      </Suspense>
      <div className="md:my-14 md:mx-40 text-text">
        <h1 className="text-2xl font-bold my-6">{t("featuredProducts")}</h1>
        <Suspense fallback={<ProductsRenderSkeleton productsCount={8} />}>
          <FeaturedProducts />
        </Suspense>
      </div>
      <DragScrollContainer />
    </div>
  );
};

export default Page;
