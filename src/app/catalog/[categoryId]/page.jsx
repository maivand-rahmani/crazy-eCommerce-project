export const dynamic = "force-dynamic";
export const dynamicParams = false;
import React from "react";
import ProductsContainer from './ProductsContainer/ProductsContainer'
import { Url } from "@/Components/ui/urlWay/url.jsx"


export async function generateStaticParams() {
  return [
    { categoryId: "Smartphones" },
    { categoryId: "Computers" },
    { categoryId: "Tablets" },
    { categoryId: "Accessories" },
    { categoryId: "Cables" },
    { categoryId: "Headphones" },
    { categoryId: "Chargers" },
    { categoryId: "Cases & Covers" },
    { categoryId: "Watches" },
    { categoryId: "Monitors" },
  ];
}

const page = async ({ params }) => {
  const categoryId  = await params?.categoryId;
   

  let data;
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/products?category=${categoryId}`,
      {
        cache: "no-store",
      }
    );
    data = await res.json();
  } catch (error) {
    console.log("Something gone wrong!", error);
  }

  if (!data) return <div>Something gone wrong</div>;

  return (
    <div className="">
      <Url />
      <ProductsContainer category={categoryId} data={data}/>
    </div>
  );
};

export default page;
