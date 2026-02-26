import React from 'react'
import ProductCard from "@/entities/product/ProductCard/ProductCard";
import { getTranslations } from "next-intl/server";

const RelatedProducts = async ({ id, category }) => {
  const t = await getTranslations("common");
  let data = null;
  let otherInfo = null;
  let error = null;

  try {
    // Fetch related products from API
    const res = await fetch(`${process.env.API_URL}/api/products/related?id=${id}&category=${category}&limit=4&vlimit=1`, {
      cache: "no-store",
    });
    
    // Check HTTP status before parsing JSON
    if (!res.ok) {
      throw new Error(`Failed to fetch related products: ${res.status}`);
    }
    data = await res.json();

    // Try to get wishlist info - the API will handle auth check internally
    try {
      const wishlistRes = await fetch(`${process.env.API_URL}/api/wishlist`, {
        cache: "no-store",
      });
      
      // Check HTTP status for wishlist API
      if (wishlistRes.ok) {
        const wishlistData = await wishlistRes.json();
        if (wishlistData?.wishlist) {
          otherInfo = {
            isInWishlist: wishlistData.wishlist.map(item => item.variant_id) || []
          };
        }
      }
      // Silently fail for wishlist - not critical, user can still see products
    } catch (wishlistErr) {
      // Wishlist is non-critical, continue without it
      console.warn('Failed to load wishlist:', wishlistErr);
    }
  } catch (err) {
    console.error('Error loading related products:', err);
    error = err.message;
  }

  // Show error state to user if fetch failed
  if (error) {
    return null; // Silently hide section on error to not disrupt UX
  }

  if (!data || data.length === 0) {
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
