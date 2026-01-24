export const dynamic = "force-dynamic";
import Fetch from "@/funcs/fetch"
import CategoryCard from "@/components/main/ui/categorySection/CategoryCard";
import React from "react";

const page = async () => {
  
  let data = await Fetch("/api/categories")

  if (!data) return <div>Something gone wrong</div>;

  return (
    <div className="h-full grid grid-cols-2 md:grid-cols-5 gap-10 p-20 md:p-20">
      {Array.isArray(data) ? (
        data.map((category) => (
          <CategoryCard
            Scroll={false}
            Category={category}
            kidsList={data.filter((el) => el.parent_id === category.id)}
            key={category.id}
          />
        ))
      ) : null}
    </div>
  );
};

export default page;
