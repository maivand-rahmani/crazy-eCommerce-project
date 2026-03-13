import React from "react";
import { getFeaturedProducts } from "@/features/home";
import HomeProductShowcaseClient from "./HomeProductShowcaseClient";

const HomeProductShowcaseSection = async () => {
  const response = await getFeaturedProducts(8);

  return (
    <HomeProductShowcaseClient
      featuredProducts={response?.data || []}
      featuredOtherInfo={response?.otherInfo || null}
    />
  );
};

export default HomeProductShowcaseSection;
