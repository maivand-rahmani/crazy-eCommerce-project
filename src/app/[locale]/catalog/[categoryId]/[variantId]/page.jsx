import { getProduct } from "@/features/catalog";
import { Fetch } from "@/shared/lib";
import React, { Suspense } from "react";
import { Miniloader, Slider } from "@/shared";
import { MainInfo, ProductSpecs, RelatedProducts } from "@/entities/product";
import MainCommentComponent from "@/entities/comment";
import { ProductRatingStats } from "@/entities/rating";
import { getServerSession } from "next-auth";
import { authParams } from "@/app/api/auth/[...nextauth]/route";
import { getTranslations } from "next-intl/server";
import { ProductViewTracker } from "@/features/recently-viewed";

export async function generateMetadata({ params }) {
  const { variantId } = await params;

  try {
    const MainData = await getProduct(variantId);
    const data = MainData?.variant;
    const productName = data?.products?.name || "Product";
    const productCategory = data?.products?.categories?.name || "Products";

    return {
      title: `${productName} - Reviews, Specs & Best Price`,
      description: `Buy ${productName} online. Check ${productName} specs, read reviews, compare prices. Free shipping on orders over $50. Secure checkout.`,
      keywords: [
        productName,
        productCategory,
        "buy online",
        "product reviews",
        "best price",
      ],
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
  const { variantId, categoryId } = await params;
  const user = await getServerSession(authParams).then((res) => res?.user);
  const userId = user ? user.id : null;

  let MainData;
  try {
    MainData = await getProduct(variantId);
  } catch (error) {
    console.error("Error fetching product:", error);
    return (
      <main className="md:px-4 h-full text-text w-full overflow-hidden p-5 md:p-20 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Error Loading Product</h1>
        <p className="text-muted">Something went wrong while loading the product.</p>
      </main>
    );
  }

  // Handle null/undefined product data gracefully
  if (!MainData) {
    return (
      <main className="md:px-4 h-full text-text w-full overflow-hidden p-5 md:p-20 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Product Not Found</h1>
        <p className="text-muted">The requested product could not be found.</p>
      </main>
    );
  }

  const data = userId ? MainData?.variant : MainData;
  const metaData = userId ? MainData?.meta : null;

  const productId = data?.products?.id;
  const categoryIdFromProduct = data?.products?.categories?.id;
  const fallbackCategoryId = categoryIdFromProduct || Number(categoryId);

  return (
    <main className="md:px-4 h-full text-text w-full overflow-hidden p-5 md:p-20 flex flex-col">
      <ProductViewTracker product={data} />
      <div className="w-full flex-col flex center pb-28 md:px-20 md:flex-row md:gap-10 gap-5">
        <Suspense>
          <Slider productId={productId} variantId={variantId} />
        </Suspense>
        <Suspense
          fallback={
            <div className="w-full h-64 bg-surface animate-pulse"></div>
          }
        >
          <MainInfo product={data} otherInfo={userId ? metaData : null} />
        </Suspense>
      </div>
      <Suspense >
        <ProductSpecs productId={productId} />
      </Suspense>
      <Suspense >
        <div className="py-10 px-5 md:py-20 md:px-40">
          <h2 className="text-2xl font-semibold mb-6">
            {t("relatedProducts")}
          </h2>
          <RelatedProducts id={variantId} category={fallbackCategoryId} />
        </div>
      </Suspense>
      <Suspense>
        <div className="rounded-3xl bg-surface shadow-2xl p-4 my-5 border border-border">
          <div>
            <ProductRatingStats productId={productId} />
          </div>
          <div>
            <MainCommentComponent productID={productId} />
          </div>
        </div>
      </Suspense>
    </main>
  );
};

export default page;
