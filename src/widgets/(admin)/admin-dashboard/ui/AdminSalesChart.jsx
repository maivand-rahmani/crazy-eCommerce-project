"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const AdminSalesChart = ({ data }) => {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -14, bottom: 0 }}>
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.18)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            tickFormatter={(value) => currencyFormatter.format(value)}
          />
          <Tooltip
            cursor={{ stroke: "rgba(30, 64, 175, 0.2)", strokeWidth: 1 }}
            contentStyle={{
              background: "var(--admin-panel)",
              border: "1px solid var(--admin-panel-border)",
              borderRadius: "16px",
              boxShadow: "0 20px 40px -28px rgba(15, 23, 42, 0.55)",
            }}
            formatter={(value, key) => {
              if (key === "sales") return currencyFormatter.format(value);
              return value;
            }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="url(#salesGradient)"
            strokeWidth={3}
            dot={{ r: 3, fill: "#1E40AF" }}
            activeDot={{ r: 6, fill: "#F59E0B" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminSalesChart;
