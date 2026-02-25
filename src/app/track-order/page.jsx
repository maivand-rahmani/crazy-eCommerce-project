"use client";

import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';

const ORDER_STEPS = [
  { key: 'created', label: 'Order Placed', icon: Clock },
  { key: 'paid', label: 'Payment Confirmed', icon: CheckCircle },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Package },
];

function getStepIndex(status) {
  const statusOrder = ['created', 'paid', 'shipped', 'delivered', 'cancelled'];
  return statusOrder.indexOf(status);
}

function OrderTracker({ order }) {
  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-6">Order Progress</h2>
      
      {isCancelled ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl">
          <XCircle size={24} />
          <span className="font-medium">Order has been cancelled</span>
        </div>
      ) : (
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div 
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>

          {ORDER_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.key} className="flex flex-col items-center">
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}
                    ${isCurrent ? 'ring-4 ring-green-200' : ''}
                  `}
                >
                  <Icon size={20} />
                </div>
                <span className={`mt-2 text-sm font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Details */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold mb-3">Order Information</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-500">Order ID:</span> <span className="font-mono">{order.id}</span></p>
            <p><span className="text-gray-500">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
            <p><span className="text-gray-500">Total:</span> <span className="font-bold">${(order.total_cents / 100).toFixed(2)}</span></p>
            <p><span className="text-gray-500">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </p>
          </div>
        </div>

        {order.address && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin size={18} />
              Shipping Address
            </h3>
            <div className="text-sm text-gray-600">
              <p>{order.address.name}</p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
              <p>{order.address.country}</p>
              <p className="mt-1">{order.address.phone}</p>
            </div>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Items</h3>
        <div className="space-y-3">
          {order.order_items?.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                {/* Placeholder for item image - would need to fetch */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package size={24} />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium">Product Variant ID: {item.variant_id}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity} × ${(item.unit_price_cents / 100).toFixed(2)}</p>
              </div>
              <p className="font-semibold">${((item.quantity * item.unit_price_cents) / 100).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`/api/track-order/${orderId.trim()}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.error || 'Order not found');
      }
    } catch (err) {
      setError('Failed to fetch order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">Track Your Order</h1>
        <p className="text-gray-600 text-center mb-8">Enter your order ID to see the current status</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter order ID (e.g., abc123-def456...)"
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Searching...' : 'Track'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
            <XCircle size={20} />
            {error}
          </div>
        )}

        {/* Order Result */}
        {order && <OrderTracker order={order} />}

        {/* Help Text */}
        {!order && !error && !loading && (
          <div className="text-center text-gray-500 mt-12">
            <p>You can find your order ID in your order confirmation email</p>
          </div>
        )}
      </div>
    </div>
  );
}
