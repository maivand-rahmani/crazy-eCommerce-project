"use client";
import { useRouter } from "@/shared/i18n/model/routing";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Cable,
  Headset,
  PlugZap,
  TabletSmartphone,
  Watch,
  MonitorIcon,
  ChevronRight,
} from "lucide-react";

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

const CategoryCard = ({ Category, kidsList, Scroll = true }) => {
  const router = useRouter();
  const t = useTranslations();
  const [clicked, setclick] = useState(false);

  function Click() {
    setclick(!clicked);
    router.push(`/catalog/${Category.id}`);
  }

  return (
    <div
      className="group flex min-h-44 w-full cursor-pointer flex-col justify-between rounded-[28px] border border-border/60 bg-card/85 p-5 text-center text-text shadow-[0_18px_60px_-34px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card hover:shadow-[0_24px_70px_-34px_rgba(59,130,246,0.2)]"
      onClick={Click}
      key={Category.id}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-background/70 text-text shadow-sm transition-transform duration-300 group-hover:scale-105">
          {CategoriesLogos[Category.name]}
        </div>
        <h1 className="text-base font-semibold leading-snug md:text-lg">
          {t(`categories.list.${Category.name}`)}
        </h1>
      </div>

      <div className="mt-5 flex min-h-6 items-center justify-center">
        {Scroll && clicked ? (
          <div className="flex w-full gap-2 overflow-x-auto pb-1">
            {kidsList.map((SubCategory) => (
              <div
                className="flex shrink-0 items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1.5 text-xs text-muted"
                key={SubCategory.id}
              >
                <span className="text-text">
                  {CategoriesLogos[SubCategory.name]}
                </span>
                <h1>{t(`categories.list.${SubCategory.name}`)}</h1>
              </div>
            ))}
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors duration-200 group-hover:text-text">
            <span>Explore</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCard;
