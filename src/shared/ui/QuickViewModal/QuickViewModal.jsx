"use client";

import { useState, useEffect } from "react";
import { X, Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { AddToWishListCom } from "../../../features/add-to-wishlist/ui/AddToWishListCom";
import { CompareButton } from "../../../features/compare-products/ui/CompareButton";

const QuickViewModal = ({ product, isOpen, onClose, otherInfo }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentImageIndex(0);
      setQuantity(1);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const images = product.images || [product.image_url].filter(Boolean);
  const currentImage = images[currentImageIndex];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: product.variant_id,
          quantity: quantity,
        }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("cart-updated"));
        onClose();
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const compareProduct = {
    variantId: product.variant_id?.toString(),
    productId: product.product_id?.toString(),
    name: product.product_name,
    imageUrl: product.image_url,
    priceCents: product.price_cents,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Image Gallery */}
          <div className="md:w-1/2 bg-gray-50 relative">
            <div className="aspect-square relative overflow-hidden">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.variant_name || product.product_name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail dots */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2 p-4">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-4">
              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900">
                {product.product_name}
              </h2>
              {product.variant_name && (
                <p className="text-lg text-gray-600">{product.variant_name}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={
                        star <= Math.round(product.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating?.toFixed(1) || "0.0"} ({product.review_count || 0}{" "}
                  reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-gray-900">
                ${((product.price_cents || 0) / 100).toFixed(2)}
              </div>

              {/* Specs */}
              {(product.specs || product.variant_options) && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-700">Specifications:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {product.specs &&
                      Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="text-gray-500">{key}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    {product.variant_options &&
                      Object.entries(product.variant_options).map(
                        ([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <span className="text-gray-500">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        )
                      )}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock_quantity > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.stock_quantity > 0
                    ? `In Stock (${product.stock_quantity})`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={loading || !product.stock_quantity}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} />
                  {loading ? "Adding..." : "Add to Cart"}
                </button>

                <button className="p-3 border rounded-xl hover:bg-gray-50 transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              {/* Quick action buttons (wishlist & compare) */}
              <div className="flex gap-2 pt-2">
                <AddToWishListCom
                  wishlistInfo={otherInfo}
                  productId={product.product_id}
                  variantId={product.variant_id}
                />
                <CompareButton product={compareProduct} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default QuickViewModal;
