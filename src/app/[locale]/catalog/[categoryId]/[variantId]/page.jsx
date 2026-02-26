
import Slider from "@/shared/ui/slider/Slider";
import React, { Suspense } from "react";
import Miniloader from "@/shared/ui/Loading/ComponentLoader/miniloader";
import MainInfo from "@/entities/product/ui/MainInfo.jsx";
import ProductSpecs from "@/entities/product/ui/ProductSpecs.jsx";
import RelatedProducts from "@/entities/product/ui/RelatedProducts.jsx";
import MainCommentComponent from "@/entities/comment/ui/CommentSection/MainComponent.jsx";
import Fetch from "@/shared/lib/fetch";
import { ProductRatingStats } from "@/entities/rating/ui/ProductRatingStats.jsx";
import { getServerSession } from "next-auth";
import { authParams } from "@/app/api/auth/[...nextauth]/route";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { variantId } = params;
  
  try {
    const MainData = await Fetch(`/api/products/${variantId}`);
    const data = MainData?.variant;
    const productName = data?.products?.name || "Product";
    const productCategory = data?.products?.categories?.name || "Products";

    return {
      title: `${productName} - Reviews, Specs & Best Price`,
      description: `Buy ${productName} online. Check ${productName} specs, read reviews, compare prices. Free shipping on orders over $50. Secure checkout.`,
      keywords: [productName, productCategory, "buy online", "product reviews", "best price"],
      // openGraph: {
      //   title: `${productName} - Reviews, Specs & Best Price`,
      //   description: `Buy ${productName} online. Free shipping on orders over $50.`,
      //   type: "product",
      // },
      twitter: {
        card: "product",
        title: `${productName} - Reviews, Specs & Best Price`,
        description: `Buy ${productName} online. Free shipping on orders over $50.`,
      },
    };
  } catch (error) {
    return {
      title: "Product Details",
      description: "Detailed view of the selected product.",
    };
  }
}

const page = async ({ params }) => {
  const t = await getTranslations("productDetails");
  const { variantId } = params;
  const user = await getServerSession(authParams).then((res) => res?.user);
  const userId = user ? user.id : null;

  let MainData = await Fetch(`/api/products/${variantId}`);

  const data = userId ? MainData.variant : MainData;
  const metaData = userId ? MainData.meta : null;

  return (
    <main className="md:px-4 h-full text-text w-full overflow-hidden p-5 md:p-20 flex flex-col">
      <div className="w-full flex-col flex center pb-28 md:px-20 md:flex-row md:gap-10 gap-5">
        <Suspense fallback={<Miniloader />}>
          <Slider productId={data?.products?.id} variantId={variantId} />
        </Suspense>
        <Suspense
          fallback={
            <div className="w-full h-64 bg-surface animate-pulse"></div>
          }
        >
          <MainInfo product={data} otherInfo={userId ? metaData : null} />
        </Suspense>
      </div>
      <Suspense fallback={<Miniloader />}>
        <ProductSpecs productId={data?.products.id} />
      </Suspense>
      <Suspense fallback={<Miniloader />}>
        <div className="py-10 px-5 md:py-20 md:px-40">
          <h2 className="text-2xl font-semibold mb-6">{t("relatedProducts")}</h2>
          <RelatedProducts
            id={data?.products?.id}
            category={data?.products?.categories?.id}
          />
        </div>
      </Suspense>
      <Suspense fallback={<Miniloader />}>
        <div className="rounded-3xl bg-surface shadow-2xl p-4 my-5 border border-border">
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
