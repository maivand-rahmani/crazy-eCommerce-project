import { auth } from "@clerk/nextjs/server";
import { Url } from "@/shared/ui/urlWay/url";
import Slider from "@/shared/ui/slider/Slider";
import React, { Suspense } from "react";
import Miniloader from "@/shared/ui/Loading/ComponentLoader/miniloader";
import MainInfo from "@/entities/product/ui/MainInfo.jsx";
import ProductSpecs from "@/entities/product/ui/ProductSpecs.jsx";
import RelatedProducts from "@/entities/product/ui/RelatedProducts.jsx";
import MainCommentComponent from "@/entities/comment/ui/CommentSection/MainComponent.jsx";
import Fetch from "@/shared/lib/fetch";
import { ProductRatingStats } from "@/entities/rating/ui/ProductRatingStats.jsx";

export const metadata = {
  title: "Product Details",
  description: "Detailed view of the selected product.",
};

const page = async ({ params }) => {
  const { variantId } = await params;
  const { getToken, userId } = await auth();
  const token = await getToken();

  let MainData = await Fetch(`/api/products/${variantId}`, "GET", token);

  const data = userId ? MainData.variant : MainData;
  const metaData = userId ? MainData.meta : null;

  return (
    <main className="md:px-4 h-full w-full overflow-hidden p-5 md:p-20 flex flex-col">
      <div className="w-full flex-col flex center pb-28 md:px-20 md:flex-row md:gap-10 gap-5">
        <Suspense fallback={<Miniloader />}>
          <Slider productId={data.products.id} variantId={variantId} />
        </Suspense>
        <Suspense
          fallback={
            <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
          }
        >
          <MainInfo product={data} otherInfo={userId ? metaData : null} />
        </Suspense>
      </div>
      <Suspense fallback={<Miniloader />}>
        <ProductSpecs productId={data.products.id} />
      </Suspense>
      {/* <Suspense fallback={<Miniloader />}>
        <div className="py-10 px-5 md:py-20 md:px-40">
          <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
          <RelatedProducts
            id={data?.products?.id}
            category={data?.products?.categories?.id}
          />
        </div>
      </Suspense> */}
      <Suspense fallback={<Miniloader />}>
        <div className="rounded-3xl bg-gray-200 shadow-2xl p-4 my-5">
          <div>
            <ProductRatingStats productId={data.products.id} />
          </div>
          <div>
            <MainCommentComponent productID={data?.products?.id} />
          </div>
        </div>
      </Suspense>
    </main>
  );
};

export default page;
