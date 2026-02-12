export const dynamic = "force-dynamic";
export const dynamicParams = false;
import React from "react";
import ProductsContainer from "../../../features/catalog/ui/ProductsContainer/ProductsContainer";
import { Url } from "@/shared/ui/urlWay/url.jsx";
import Fetch from "@/shared/lib/fetch";
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
  const { categoryId } = params;

  let data = await Fetch(`/api/products?category=${categoryId}`);

  if (!data) return <div>Something gone wrong</div>;

  return (
    <div className="">
      <ProductsContainer category={categoryId} data={data} />
    </div>
  );
};

export default page;
