export const dynamic = "force-dynamic";
import React, { Suspense } from "react";
import MiniLoader from "@/shared/ui/Loading/ComponentLoader/miniloader";
import Main from "@/features/home/ui/banners/main";
import CategorySection from "@/features/home/ui/CategorySection/Main";
import DragScrollContainer from "@/shared/ui/ScrollContainer/ScrollContainer";
import FeaturedProducts from "@/features/home/ui/CategorySection/FeaturedProducts";
import ProductsRenderSkeleton from "@/shared/ui/skeleton/ProductsRenderSkeleton";

const Page = async () => {
  return (
    <div className="mx-auto max-w-[1440px]">
      <Suspense fallback={<MiniLoader />}>
        <Main />
      </Suspense>
      <Suspense fallback={<MiniLoader />}>
        <CategorySection />
      </Suspense>
      <div className="md:my-14 md:mx-40">
        <h1 className="text-2xl font-bold my-6">Featured Products</h1>
        <Suspense fallback={<ProductsRenderSkeleton productsCount={8} />}>
          <FeaturedProducts />
        </Suspense>
      </div>
      <DragScrollContainer />
    </div>
  );
};

export default Page;
