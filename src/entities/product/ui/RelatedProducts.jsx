import ProductCard from "@/entities/product/ProductCard/ProductCard";
import Fetch from "@/shared/lib/fetch";

const RelatedProducts = async ({ id, category }) => {
  if (!id || !category) {
    return null;
  }

  let data = null;
  let otherInfo = null;

  try {
    const result = await Fetch(`/api/products/related?id=${id}&category=${category}&limit=4`);

    if (!result || result.error) {
      throw new Error(result?.error || "Failed to fetch related products");
    }

    data = result;

    const wishlistRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist`, {
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
    return null;
  }

  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

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
