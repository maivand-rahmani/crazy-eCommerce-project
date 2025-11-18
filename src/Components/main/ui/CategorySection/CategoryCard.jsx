"use client"
import { useRouter } from 'next/navigation';
import {useTranslations} from "next-intl"
import React, { useState } from "react";
import { Smartphone, Laptop, Tablet, Headphones , Cable , Headset , PlugZap , TabletSmartphone , Watch, MonitorIcon } from "lucide-react";

const CategoriesLogos = {
  Smartphones: <Smartphone />,
  Computers: <Laptop />,
  Tablets: <Tablet />,
  Accessories: <Headphones />,
  Cables: <Cable />,
  Headphones: <Headset />,
  Chargers: <PlugZap />,
  "Cases & Covers": <TabletSmartphone />,
  Watches: <Watch />,
  Monitors: <MonitorIcon />,
};

const CategoryCard =  ({ Category , kidsList , Scroll = true }) => {
   const router = useRouter();
  const t = useTranslations()
  const [clicked , setclick] = useState(false)

  function Click() {
    setclick(!clicked)
    router.push(`/catalog/${Category.name}`)
  }
  
  return (
    <div className="flex center transition-all rounded-2xl bg-card-bg hover:bg-card-bg/60" onClick={Click} key={Category.id}>
      <div className="flex center gap-2 flex-col py-6 w-full px-13 md:max-w-30 ">
        <div>{CategoriesLogos[Category.name]}</div>
        <h1>{t(`categories.list.${Category.name}`)}</h1>
      </div>
      <div className="flex gap-5 overflow-x-auto">
        {Scroll && clicked && kidsList.map(SubCategory => (
          <div className={`flex hover:bg-card-bg/60 center flex-col ${clicked ? 'py-6 px-10' : ''}`} key={SubCategory.id}>
            <div>{CategoriesLogos[SubCategory.name]}</div>
            <h1 className="text-sm/5 py-2">{t(`categories.list.${SubCategory.name}`)}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCard;
