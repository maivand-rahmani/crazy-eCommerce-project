import { Fetch } from "@/shared/lib";

export async function getOrders() {
  const { data } = await Fetch("/api/orders");
  return data;
}

export async function getOrder(orderId) {
  const { data, error } = await Fetch(`/api/orders/${orderId}`);
  if (error) {
    throw new Error(error);
  }
  return data;
}

export async function cancelOrder(orderId) {
  const { data, error } = await Fetch(`/api/orders/${orderId}`, "PATCH");

  if (error) {
    throw new Error(error);
  }

  return data;
}
