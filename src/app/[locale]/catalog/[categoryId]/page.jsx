export const dynamic = "force-dynamic";
export const dynamicParams = false;
import React from "react";
import ProductsContainer from "@/features/catalog/ui/ProductsContainer/ProductsContainer";
import { Url } from "@/shared/ui/urlWay/url.jsx";
import Fetch from "@/shared/lib/fetch";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { categoryId } = params;
  const categoryNames = {
    1: "Electronics",
    2: "Clothing",
    3: "Home & Garden",
    4: "Sports",
    5: "Books",
    6: "Toys",
    7: "Beauty",
    8: "Automotive",
    9: "Health",
    10: "Food",
  };
  const categoryName = categoryNames[categoryId] || "Products";

  return {
    title: `${categoryName} - Quality Products | Fast Delivery`,
    description: `Shop our curated selection of ${categoryName.toLowerCase()}. Best prices, reliable delivery, and quality guaranteed on every purchase.`,
    keywords: [categoryName.toLowerCase(), "buy", "online shopping", "quality products"],
    openGraph: {
      title: `${categoryName} - Quality Products | Fast Delivery`,
      description: `Shop our curated selection of ${categoryName.toLowerCase()}. Best prices and quality guaranteed.`,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${categoryName} - Quality Products | Fast Delivery`,
      description: `Shop our curated selection of ${categoryName.toLowerCase()}.`,
    },
  };
}

export async function generateStaticParams() {
  return [
    { categoryId: "1" },
    { categoryId: "2" },
    { categoryId: "3" },
    { categoryId: "4" },
    { categoryId: "5" },
    { categoryId: "6" },
    { categoryId: "7" },
    { categoryId: "8" },
    { categoryId: "9" },
    { categoryId: "10" },
  ];
}

const page = async ({ params }) => {
  const t = await getTranslations("common");
  const { categoryId } = params;

  let data = await Fetch(`/api/products?category=${categoryId}`);

  if (!data) return <div>{t("error")}</div>;

  return (
    <div className="">
      <ProductsContainer category={categoryId} data={data}  />
    </div>
  );
};

export default page;
