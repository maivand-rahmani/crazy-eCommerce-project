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
import MiniLoader from "@/shared/ui/Loading/ComponentLoader/miniloader";
import Main from "@/features/home/ui/banners/main";
import CategorySection from "@/features/home/ui/CategorySection/Main";
import DragScrollContainer from "@/shared/ui/ScrollContainer/ScrollContainer";
import FeaturedProducts from "@/features/home/ui/CategorySection/FeaturedProducts";
import ProductsRenderSkeleton from "@/shared/ui/skeleton/ui/ProductsRenderSkeleton";

const Page = async () => {
  const t = await getTranslations("home");

  return (
    <div className="mx-auto max-w-[1440px]">
      <Suspense fallback={<MiniLoader />}>
        <Main />
      </Suspense>
      <Suspense fallback={<MiniLoader />}>
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
