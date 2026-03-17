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
import { Miniloader, ProductsRenderSkeleton } from "@/shared";
import { Main, CategorySection } from "@/features/home";
import { DragScrollContainer } from "@/shared/ui/ScrollContainer";
import { HomeProductShowcaseSection } from "@/widgets/home-product-showcase";

const Page = async () => {
  return (
    <div className="mx-auto max-w-360">
      <Suspense fallback={<Miniloader />}>
        <Main />
      </Suspense>
      <Suspense fallback={<Miniloader />}>
        <CategorySection />
      </Suspense>
      <Suspense fallback={<ProductsRenderSkeleton productsCount={8} />}>
        <HomeProductShowcaseSection />
      </Suspense>
      <DragScrollContainer />
    </div>
  );
};

export default Page;
