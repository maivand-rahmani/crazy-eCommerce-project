export const dynamic = "force-dynamic";
import React, { Suspense } from "react";
import MiniLoader from "@/Components/Loading/ComponentLoader/miniloader";
import Main from "@/Components/main/banners/main";
import CategorySection from "@/Components/main/ui/categorySection/Main";
import DragScrollContainer from "@/Components/main/ScrollContainer/ScrollContainer";
import FeaturedProducts from "@/Components/main/ui/CategorySection/FeaturedProducts";




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
        <Suspense fallback={<MiniLoader />}>
          <FeaturedProducts />
        </Suspense>
      </div>
      <DragScrollContainer />
    </div>
  );
};

export default Page;
