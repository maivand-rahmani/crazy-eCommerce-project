"use client";
import React, { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Fetch from "@/shared/lib/fetch";
import Image from "next/image";

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error: fetchError } = await Fetch(
          `/api/orders/${params.orderId}`,
        );
        if (fetchError) {
          setError(fetchError);
        } else {
          setOrder(data);
          console.log(data);
        }
      } catch (err) {
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    if (params.orderId) {
      fetchOrder();
    }
  }, [params.orderId]);

  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      created: "bg-yellow-100 text-yellow-800",
      paid: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const discount =
    order?.coupons?.discount_amount ??
    (order?.coupons?.discount_percent
      ? Math.floor((order?.total_cents * order?.coupons.discount_percent) / 100)
      : 0);

  const finalPrice = order?.total_cents - discount;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-4">
            {error || "Order not found"}
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => router.push("/orders")}
          className="text-blue-500 hover:text-blue-700 transition-colors mb-4"
        >
          ← Back to Orders
        </button>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Order #{order.id}
                </h2>
                <p className="text-gray-600">
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {order.coupons && (
              <div className="mt-4 p-3 bg-green-50 rounded-md">
                <p className="text-sm text-green-800">
                  Coupon Applied: {order.coupons.coupon_code}
                  {order.coupons.discount_percent &&
                    ` (${order.coupons.discount_percent}% off)`}
                  {order.coupons.discount_amount &&
                    ` ($${formatPrice(order.coupons.discount_amount)} off)`}
                </p>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.order_items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 pb-4 border-b last:border-b-0"
                >
                  {/* Product Image */}
                  <Link
                    href={`/catalog/${item.product_variants.products?.categories?.id}/${item.product_variants.id}`}
                    className="w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 hover:opacity-90 transition-opacity"
                  >
                    {item.product_variants.products?.product_images?.[0]
                      ?.url ? (
                      <Image
                        width={100}
                        height={100}
                        src={
                          item.product_variants.products.product_images[0].url
                        }
                        alt={item.product_variants.products.name}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      href={`/catalog/${item.product_variants.products?.categories?.id}/${item.product_variants.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {item.product_variants.products?.name || "Product Name"}
                    </Link>
                    {item.product_variants.variant_name && (
                      <p className="text-sm text-gray-600">
                        Variant: {item.product_variants.variant_name}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Category:{" "}
                      {item.product_variants.products?.categories?.name ||
                        "N/A"}
                    </p>
                  </div>

                  {/* Quantity and Price */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                    <p className="font-medium">
                      ${formatPrice(item.unit_price_cents)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: $
                      {formatPrice(item.unit_price_cents * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${formatPrice(order.total_cents)}</span>
              </div>
              {order.coupons && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>
                    -$
                    {formatPrice(discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>
                  ${formatPrice(finalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.address && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="text-gray-600">
                {typeof order.address === "object" ? (
                  <div>
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.city}, {order.address.state}{" "}
                      {order.address.zip}
                    </p>
                    <p>{order.address.country}</p>
                  </div>
                ) : (
                  <p>{order.address}</p>
                )}
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
            <div className="text-gray-600">
              <p>Name: {order.user?.name || "N/A"}</p>
              <p>Email: {order.user?.email || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
