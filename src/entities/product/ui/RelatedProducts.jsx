import React from 'react'
import ProductCard from "@/entities/product/ProductCard/ProductCard";
import { getTranslations } from "next-intl/server";
import Fetch from "@/shared/lib/fetch";

const RelatedProducts = async ({ id, category }) => {
  const t = await getTranslations("common");
  
  // Validate props
  if (!id || !category) {
    return null;
  }

  let data = null;
  let otherInfo = null;
  let error = null;

  try {
    // Fetch related products from API
    const res = await fetch(
      `${process.env.API_URL}/api/products/related?id=${id}&category=${category}&limit=4&vlimit=1`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const result = await res.json();
    
    // Handle API error response
    if (result.error) {
      throw new Error(result.error);
    }
    
    data = result;

    // Try to get wishlist info - the API will handle auth check internally
    const wishlistRes = await fetch(`${process.env.API_URL}/api/wishlist`, {
      cache: "no-store",
    });
    
    if (wishlistRes.ok) {
      const wishlistData = await wishlistRes.json();
      
      if (wishlistData?.wishlist) {
        otherInfo = {
          isInWishlist: wishlistData.wishlist.map(item => item.variant_id) || []
        };
      }
    }
  } catch (err) {
    console.error('Error loading related products:', err);
    error = err.message;
    // Don't show section if there's an error - fail silently
    return null;
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null; // Don't show section if no related products
  }

  // Transform API data to match ProductCard's expected format
  const transformedData = data.flatMap((pro) => {
    const variant = pro.product_variants?.[0];
    if (!variant) return [];
    
    const image = pro.product_images?.[0]?.url || "/placeholder.png";
    
    return [{
      variant_id: variant.id,
      product_id: pro.id,
      category_id: pro.category_id,
      product_name: pro.name,
      variant_name: variant.variant_name,
      price_cents: variant.price_cents,
      image_url: image,
      isFavorite: otherInfo?.isInWishlist?.includes(variant.id) || false
    }];
  });

  if (transformedData.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
      {transformedData.map((product) => (
        <ProductCard 
          key={product.variant_id} 
          data={product} 
          otherInfo={otherInfo} 
        />
      ))}
    </div>
  );
};

export default RelatedProducts;
