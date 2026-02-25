"use client";

import React, { useState } from 'react';
import { Bell, BellOff, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export function StockAlertButton({ variantId, productName, variantName }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/products/stock-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          variantId: variantId.toString(), 
          email,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubscribed(true);
        toast.success('We\'ll notify you when it\'s back in stock!');
      } else {
        toast.error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg">
        <Check size={20} />
        <span>We&apos;ll notify you when it&apos;s back in stock!</span>
      </div>
    );
  }

  if (showForm) {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-600">
            Get notified when <strong>{productName}</strong> {variantName && `- ${variantName}`} is back in stock
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <>
                  <Bell size={18} />
                  Notify
                </>
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="flex items-center gap-2 px-4 py-3 w-full bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <Bell size={20} />
      <span>Notify me when available</span>
    </button>
  );
}

export default StockAlertButton;
