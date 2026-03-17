export const dynamic = "force-dynamic";

import React from "react";
import { SearchResultsContainer } from "@/shared/ui/search";
import { getTranslations } from "next-intl/server";
import { searchProducts } from "@/features/catalog";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const searchParams = resolvedParams?.searchParams || {};
  const query = searchParams?.q || "";
  
  return {
    title: query ? `Search: ${query} | Crazy Ecommerce` : "Search Products | Crazy Ecommerce",
    description: query 
      ? `Search results for "${query}" at Crazy Ecommerce. Find the best products at great prices.`
      : "Search for products at Crazy Ecommerce. Browse our wide selection of electronics, clothing, home goods, and more.",
    openGraph: {
      title: query ? `Search: ${query} | Crazy Ecommerce` : "Search Products | Crazy Ecommerce",
      description: "Find exactly what you're looking for at Crazy Ecommerce.",
    },
  };
}

const SearchPage = async ({ params }) => {
  const t = await getTranslations("search");
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "en";
  
  // In Next.js 15+, searchParams is a promise
  const searchParams = resolvedParams?.searchParams || {};
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = resolvedSearchParams?.q || "";
  
  // Fetch search results from API
  let data = null;
  if (query) {
    try {
      data = await searchProducts(query);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  }

  return (
    <div className="min-h-screen">
      <SearchResultsContainer 
        query={query} 
        initialData={data}
        locale={locale}
      />
    </div>
  );
};

export default SearchPage;
