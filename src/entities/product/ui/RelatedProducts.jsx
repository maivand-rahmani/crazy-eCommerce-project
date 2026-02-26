import ProductCard from "@/entities/product/ProductCard/ProductCard";

const RelatedProducts = async ({ id, category }) => {
  // Validate props
  if (!id || !category) {
    return null;
  }

  let data = null;
  let otherInfo = null;

  try {
    // Fetch related products from API using optimized product_cards table
    const res = await fetch(
      `${process.env.API_URL}/api/products/related?id=${id}&category=${category}&limit=4`,
      {
        next: { revalidate: 60 }, // Cache for 60 seconds
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
    // Fail silently - don't break the page
    return null;
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  // Transform data for ProductCard - now simpler since using product_cards
  const transformedData = data.map(product => ({
    variant_id: product.variant_id,
    product_id: product.product_id,
    category_id: product.category_id,
    product_name: product.product_name,
    variant_name: product.variant_name,
    price_cents: product.price_cents,
    image_url: product.image_url,
    isFavorite: otherInfo?.isInWishlist?.includes(product.variant_id) || false
  }));

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
