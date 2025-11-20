import { auth } from "@clerk/nextjs/server";
import { Url } from "@/Components/ui/urlWay/url";
import Slider from "@/Components/ui/slider/Slider";
import React, { Suspense } from "react";
import Miniloader from "@/Components/Loading/ComponentLoader/miniloader";
import MainInfo from "./ProductMiniComponents/MainInfo";
import ProductSpecs from "./ProductMiniComponents/ProductSpecs";
import RelatedProducts from "./ProductMiniComponents/RelatedProducts";
import MainCommentComponent from "./ProductMiniComponents/CommentSection/MainComponent";
import Fetch from "../../../../funcs/fetch";

export const metadata = {
  title: "Product Details",
  description: "Detailed view of the selected product.",
};

const page = async ({ params }) => {
  const { product } = await params;
  const { getToken } = await auth();
  const token = await getToken();

  let MainData = await Fetch(
    `/api/products/${product}`,
    "GET",
    token ? token : null
  );


 
  const data = token ? MainData[0] : MainData

  const specs = data?.products?.product_specs || [];

  const images =
    Array.isArray(data?.product_images) && data.product_images.length > 0
      ? data.product_images
      : Array.isArray(data?.products?.product_images)
      ? data.products.product_images
      : [];

  if (!Array.isArray(data?.product_images))
    return <div>Something gone wrong {JSON.stringify(data)}</div>;

  return (
    <main className="md:px-4 h-full p-5 md:p-20 flex flex-col">
      <div className="w-full flex-col flex center pb-28 md:px-20 md:flex-row md:gap-10 gap-5">
        <Suspense fallback={<Miniloader />}>
          <Slider images={images} />
        </Suspense>
        <Suspense
          fallback={
            <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
          }
        >
          <MainInfo product={data} isFavorite={ token ? MainData[1]?.isFavorite : null} />
        </Suspense>
      </div>
      <Suspense fallback={<Miniloader />}>
        <ProductSpecs specs={specs} />
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
        <div>
          <MainCommentComponent productID={data?.products?.id} />
        </div>
      </Suspense>
    </main>
  );
};

export default page;
