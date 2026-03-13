"use client";
import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Fetch } from "@/shared/lib/fetch";
import { Link } from "@/shared/i18n/model/routing";

const OrdersPage = () => {
  const t = useTranslations("orders");
  const tStatus = useTranslations("orders.status");
  const tSort = useTranslations("orders.sort");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await Fetch("/api/orders");
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Sort
    return [...filtered].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "created_at") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortBy === "total_cents") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [orders, statusFilter, sortBy, sortOrder]);

  const calculateItemsQuantity = (order) => {
    return (
      order.order_items?.reduce((total, item) => total + item.quantity, 0) || 0
    );
  };

  const formatPrice = (cents) => {
    return (cents / 100).toFixed(2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    const colors = {
      created: "bg-status-created text-status-created",
      paid: "bg-status-paid text-status-paid",
      shipped: "bg-status-shipped text-status-shipped",
      delivered: "bg-status-delivered text-status-delivered",
      cancelled: "bg-status-cancelled text-status-cancelled",
    };
    return colors[status] || "bg-surface text-text";
  };

  const getReturnStatusColor = (status) => {
    const colors = {
      none: "bg-surface text-text",
      requested: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      rejected: "bg-rose-100 text-rose-800",
      processed: "bg-green-100 text-green-800",
    };

    return colors[status] || "bg-surface text-text";
  };

  const getCancellationState = (order) => {
    return ["created", "paid"].includes(order.status)
      ? t("detail.cancellation.available")
      : t("detail.cancellation.locked");
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-bg">
      <h1 className="text-3xl font-bold mb-8 text-text">{t("title")}</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-text">
            {tStatus("label")}:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input text-input-text"
          >
            <option value="all">{tStatus("all")}</option>
            <option value="created">{tStatus("created")}</option>
            <option value="paid">{tStatus("paid")}</option>
            <option value="shipped">{tStatus("shipped")}</option>
            <option value="delivered">{tStatus("delivered")}</option>
            <option value="cancelled">{tStatus("cancelled")}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-text">
            {tSort("label")}:
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-input text-input-text"
          >
            <option value="created_at">{tSort("date")}</option>
            <option value="total_cents">{tSort("price")}</option>
            <option value="status">{tSort("status")}</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-3 py-2 bg-surface hover:opacity-80 rounded-md transition-colors text-text"
          >
            {sortOrder === "asc" ? `↑ ${tSort("asc")}` : `↓ ${tSort("desc")}`}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-unactive-text text-lg">{t("loading")}</p>
        </div>
      ) : filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-unactive-text text-lg">{t("empty")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-surface shadow-md rounded-lg overflow-hidden">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-text uppercase tracking-wider">
                  {t("table.orderId")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text uppercase tracking-wider">
                  {t("table.status")}
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-text uppercase tracking-wider cursor-pointer hover:opacity-80"
                  onClick={() => handleSort("total_cents")}
                >
                  {t("table.price")}{" "}
                  {sortBy === "total_cents" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-medium text-text uppercase tracking-wider cursor-pointer hover:opacity-80"
                  onClick={() => handleSort("created_at")}
                >
                  {t("table.date")}{" "}
                  {sortBy === "created_at" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text uppercase tracking-wider">
                  {t("table.itemsQuantity")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text uppercase tracking-wider">
                  {t("table.return")}
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-text uppercase tracking-wider">
                  {t("table.cancellation")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {filteredAndSortedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:opacity-80 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-sm text-primary underline font-mono"
                    >
                      {order.id.slice(0, 8)}...
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-text font-medium">
                      ${formatPrice(order.total_cents)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-unactive-text">
                      {formatDate(order.created_at)}
                    </span>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span className="text-sm text-text">
                       {calculateItemsQuantity(order)}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span
                       className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReturnStatusColor(order.return_status || "none")}`}
                     >
                       {t(`detail.return.status.${order.return_status || "none"}`)}
                     </span>
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <span className="text-sm text-unactive-text">
                       {getCancellationState(order)}
                     </span>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
