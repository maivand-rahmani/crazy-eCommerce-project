"use client";

import React, { useEffect, useState } from 'react';
import { X, ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuickView } from '../model/QuickViewContext';
import { AddToCartButton } from '../../add-to-cart/ui/AddToCartButton';
import { AddToWishListCom } from '../../add-to-wishlist/ui/AddToWishListCom';
import Link from 'next/link';

export function QuickViewModal() {
  const { isOpen, productData, closeQuickView } = useQuickView();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      if (!productData?.variantId) {
        setProduct(null);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productData.variantId}`);
        const data = await res.json();
        setProduct(data.variant || data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen && productData) {
      fetchProduct();
    }
  }, [isOpen, productData]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeQuickView();
    }
  };

  const nextImage = () => {
    const images = product?.product_images || [];
    if (images.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    const images = product?.product_images || [];
    if (images.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-2xl m-4">
        {/* Close button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
                {product.product_images && product.product_images.length > 0 ? (
                  <>
                    <img
                      src={product.product_images[selectedImageIndex]?.url}
                      alt={product.products?.name}
                      className="w-full h-full object-cover"
                    />
                    {product.product_images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              
              {/* Thumbnail indicators */}
              {product.product_images && product.product_images.length > 1 && (
                <div className="flex gap-2 mt-4 justify-center">
                  {product.product_images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        idx === selectedImageIndex ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800">
                {product.products?.name}
              </h2>
              {product.variant_name && (
                <p className="text-lg text-gray-500 mt-1">{product.variant_name}</p>
              )}

              <p className="text-3xl font-bold text-blue-600 mt-4">
                ${(product.price_cents / 100).toFixed(2)}
              </p>

              {/* Stock status */}
              <div className="mt-3">
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600 font-medium">✓ In Stock</span>
                ) : (
                  <span className="text-red-500 font-medium">✗ Out of Stock</span>
                )}
              </div>

              {/* Quick specs */}
              {product.products?.product_specs?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Specifications:</h3>
                  <ul className="space-y-1">
                    {product.products.product_specs.slice(0, 5).map((spec, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        <span className="font-medium">{spec.key}:</span> {spec.value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto pt-6 flex flex-col gap-3">
                {product.stock_quantity > 0 ? (
                  <AddToCartButton variantId={product.id} />
                ) : (
                  <button
                    disabled
                    className="w-full py-3 bg-gray-300 text-gray-500 rounded-xl cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                )}
                
                <Link
                  href={`/catalog/${product.products?.category_id}/${product.id}?product=${product.products?.name}&variant=${product.variant_name}`}
                  className="block text-center py-3 border-2 border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500">Product not found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuickViewModal;
