"use client";
import React, { useState } from "react";
import Link from "next/link";
import {useParams } from "next/navigation"
import { Truck , Store , BadgeCheck , ShoppingCart } from 'lucide-react';
import { AddToWishListCom } from '@/features/add-to-wishlist/ui/AddToWishListCom.jsx';
import { AddToCartButtonForProductPage } from '@/features/add-to-cart/ui/AddToCartButtonForProductPage.jsx';
import { StockAlertButton } from '@/features/stock-alert/ui/StockAlertButton.jsx';

const  MainInfo = ({ product , otherInfo }) => {
  const variants = product.products?.product_variants || [];
  const currentVariant = product;
  const isOutOfStock = currentVariant.stock_quantity <= 0;

   const { categoryId } = useParams()

 

  // {Характеристики для ТОвара (экран , камера и т.д.)} можно добавить ниже
  const productSpecs = product.products?.product_specs || [];
  const specs = ["RAM" , "Screen Size" , "Battery Capacity" , "Weight" , "Processor" , "Operating System"];

  // gurantee , stock , free delivery можно добавить ниже
  const info = [
    { icon: <BadgeCheck />, key: "Guaranteed", text: "1 Year" },
    { icon: <Store />, key: "In Stock", text: product.stock_quantity > 0 ? "today" : "Out of Stock" },
    { icon: <Truck />, key: "Free Delivery" , text: "1-2 days" },
  ]

  const [selectedColor, setSelectedColor] = useState(
    currentVariant?.variant_options.find(o => o.key === "Color")?.value || null
  );
  const [selectedStorage, setSelectedStorage] = useState(
    currentVariant?.variant_options.find(o => o.key === "Storage")?.value || null
  );

  // Уникальные цвета
  const colorOptions = Array.from(
    new Map(
      variants.map(v => [
        v.variant_options.find(o => o.key === "Color")?.value || "N/A",
        v,
      ])
    ).values()
  );

  // Storage для выбранного цвета
  const storageOptions = variants
    .filter(v => (v.variant_options.find(o => o.key === "Color")?.value || "N/A") === selectedColor)
    .map(v => ({
      id: v.id,
      storage: v.variant_options.find(o => o.key === "Storage")?.value || "N/A",
      variant_name: v.variant_name,
    }));

  // RAM для выбранного цвета + storage
  const ramOptions = variants
    .filter(v => {
      const color = v.variant_options.find(o => o.key === "Color")?.value || "N/A";
      const storage = v.variant_options.find(o => o.key === "Storage")?.value || null;
      return color === selectedColor && storage === selectedStorage && v.variant_options.find(o => o.key === "RAM");
    })
    .map(v => ({
      id: v.id,
      ram: v.variant_options.find(o => o.key === "RAM")?.value || "N/A",
      variant_name: v.variant_name,
    }));

  const currentColor = currentVariant?.variant_options.find(o => o.key === "Color")?.value;
  const currentStorage = currentVariant?.variant_options.find(o => o.key === "Storage")?.value;
  const currentRam = currentVariant?.variant_options.find(o => o.key === "RAM")?.value;

  return (
    <div className="h-full w-full">
      <h1 className="text-4xl font-bold mb-4">
        {product.products.name} | {currentVariant.variant_name}
      </h1>
      <p className="text-2xl font-semibold text-green-700 mb-6">
        ${(currentVariant.price_cents / 100)}
      </p>

      {/* COLOR */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Select color:</h2>
        <ul className="flex flex-wrap gap-4">
          {colorOptions.map((v, i) => {
            const color = v.variant_options.find(o => o.key === "Color")?.value || "N/A";
            const isSelected = color === selectedColor;
            return (
              <li
                key={i}
                className={`px-4 py-2 border rounded-lg cursor-pointer text-center transition-colors ${
                  isSelected ? "border-blue-300 bg-blue-100" : "hover:bg-gray-100"
                }`}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedStorage(null);
                }}
              >
                {color}

                {/* STORAGE dropdown прямо под выбранным цветом */}
                {isSelected && storageOptions.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-2 transition-all duration-300 ease-out">
                    {storageOptions.map((option, idx) => {
                      const isCurrent = option.storage === currentStorage && selectedColor === currentColor;
                      return (
                        <li
                          key={idx}
                          className={`px-4 py-2 border rounded-lg cursor-pointer text-center transition-colors ${
                            isCurrent ? "border-blue-600 bg-blue-100" : "hover:bg-gray-100"
                          }`}
                          onClick={() => setSelectedStorage(option.storage)}
                        >
                          <Link
                            href={`/catalog/${categoryId}/${option.id}?variant=${option.variant_name}&product=${product.products.name}`}
                          >
                            {option.storage}
                          </Link>

                          {/* RAM dropdown прямо под выбранным storage */}
                          {selectedStorage === option.storage && ramOptions.length > 0 && (
                            <ul className="mt-2 flex flex-col gap-2 transition-all duration-300 ease-out">
                              {ramOptions.map((r, ridx) => {
                                const isCurrentRam = r.ram === currentRam;
                                return (
                                  <li
                                    key={ridx}
                                    className={`px-4 py-2 border rounded-lg cursor-pointer text-center transition-colors ${
                                      isCurrentRam ? "border-blue-600 bg-blue-100" : "hover:bg-gray-100"
                                    }`}
                                  >
                                    <Link
                                      href={`/catalog/${categoryId}/${r.id}?variant=${r.variant_name}&product=${product.products.name}`}
                                    >
                                      {r.ram}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Product Specs */}
      {productSpecs.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Product Specifications:</h2>
          <ul className="grid grid-cols-3 gap-4">
            {specs.map((spec, index) => (
              productSpecs.some(s => s.key === spec) && (
              <li className="w-full rounded p-2 flex flex-col   bg-unactive-text/35" key={index}>
                <span className="font-semibold text-unactive-text">{spec}</span>
                <span className="">{productSpecs.find(s => s.key === spec)?.value}</span>
              </li>
            )))}
          </ul>
        </div>
      )}

      {/* Product Description */}
      <div>
        <p className="text-xl text-gray-700">{product.products.description}</p>
      </div>

      {/* add to favorite , cart button */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className={`border-2 rounded flex center hover:border-red-600 hover  :text-white transition ${otherInfo?.isFavorite ? "border-red-600" : null}`}>
          <AddToWishListCom wishlistInfo={otherInfo} variantId={currentVariant.id} productId={product.products.id}> 
          {otherInfo?.isFavorite ? "Added to wishlist" : "Add to Wishlist"}
        </AddToWishListCom>
        </div>
        
        
        {isOutOfStock ? (
          <StockAlertButton 
            variantId={currentVariant.id} 
            productName={product.products.name}
            variantName={currentVariant.variant_name}
          />
        ) : (
          <AddToCartButtonForProductPage variantId={currentVariant.id} cart_id={otherInfo?.cart_id}/>
        )}
      </div>

      {/* {guarantee , stock , free delivery} */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {info.map((item , index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="flex gap-2 items-center">
              <div className="bg-unactive-text/35 p-4 rounded-2xl">{IconComponent}</div>
              <span className="flex flex-col text-gray-700">
                <span className="font-semibold">{item.key}:</span> 
                <span>{item.text}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainInfo;
