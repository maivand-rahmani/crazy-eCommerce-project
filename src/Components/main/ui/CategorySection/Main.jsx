export const dynamic = "force-dynamic";

import React from "react";
import CategoryCard from "./CategoryCard";
import {getTranslations} from "next-intl/server"
import Link from "next/link";

 
const CategorySection = async () => {
    const t = await getTranslations('categories')
   let data , categories;

  try {
    data = await fetch(`${process.env.API_URL}/api/categories`);
    categories = await data.json();
  } catch (error) {
    console.log(error)
  }
  
  return (
    <div className="py-16 bg-[#FAFAFA] flex flex-col gap-12 px-4 md:px-40">
      <div>
        <h1 className="font-bold text-xl/8 "><Link href={"/catalog"}>{t("title")}</Link></h1>
      </div>
      <div className="grid grid-cols-2 gap-4 md:flex">
        {!categories?.error && categories.map((Category) => (
          Category.parent_id === null && (
            <CategoryCard Category={Category} kidsList={categories.filter(element => element.parent_id === Category.id)} key={Category.id} />
          )
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
