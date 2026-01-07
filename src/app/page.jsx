export const dynamic = "force-dynamic";
import React, { Suspense } from "react";
import MiniLoader from "@/components/Loading/ComponentLoader/miniloader";
import Main from "@/components/main/banners/main";
import CategorySection from "@/components/main/ui/categorySection/Main";
import DragScrollContainer from "@/components/main/ScrollContainer/ScrollContainer";
import FeaturedProducts from "@/components/main/ui/CategorySection/FeaturedProducts";
import ProductsRenderSkeleton from "@/components/ui/skeleton/ProductsRenderSkeleton";

const Page = async () => {
  return (
    <div className="dark mx-auto max-w-[1440px]">
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
