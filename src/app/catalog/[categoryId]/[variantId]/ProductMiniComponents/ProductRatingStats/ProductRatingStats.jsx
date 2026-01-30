"use client";

import { useEffect, useState } from "react";
import Fetch from '../../../../../../funcs/fetch';



export function ProductRatingStats({ productId }){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await Fetch(`/api/products/${productId}/rating`);
        setData(res);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [productId]);

  if (loading) {
    return (
      <div className="mt-6 rounded-xl border border-gray-200 bg-white/70 px-6 py-5 shadow-sm">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  if (!data || data.total === 0) {
    return (
      <div className="mt-6 rounded-xl border border-gray-200 bg-white/70 px-6 py-5 shadow-sm">
        <p className="text-sm text-gray-500">No ratings yet.</p>
      </div>
    );
  }

  const { total, average, median, counts } = data;
  const maxCount = Math.max(...Object.values(counts));
  const stars = [5, 4, 3, 2, 1];

  return (
    <div className="mt-6 grid gap-6 rounded-xl border border-gray-200 bg-white/80 px-6 py-5 shadow-sm sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
      {/* Left side: main numbers */}
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-gray-900">
              {average.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">/ 5</span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            {/* stars */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < Math.round(average);
                return (
                  <svg
                    key={i}
                    className={
                      "h-4 w-4 " +
                      (filled ? "text-yellow-400" : "text-gray-300")
                    }
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.562-.955L10 0l2.948 5.955 6.562.955-4.755 4.635 1.123 6.545z" />
                  </svg>
                );
              })}
            </div>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Based on {total} reviews • median {median.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Right side: distribution bars */}
      <div className="space-y-2">
        {stars.map(star => {
          const count = counts[star] || 0;
          const width =
            maxCount === 0 ? 0 : Math.round((count / maxCount) * 100);

          return (
            <div key={star} className="flex items-center gap-3 text-xs">
              <div className="flex w-10 items-center justify-between text-gray-500">
                <span className="font-medium text-gray-700">{star}</span>
                <svg
                  className="h-3 w-3 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.49 6.91l6.562-.955L10 0l2.948 5.955 6.562.955-4.755 4.635 1.123 6.545z" />
                </svg>
              </div>

              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-500 transition-[width] duration-300"
                  style={{ width: `${width}%` }}
                />
              </div>

              <span className="w-10 text-right text-[11px] text-gray-500">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
