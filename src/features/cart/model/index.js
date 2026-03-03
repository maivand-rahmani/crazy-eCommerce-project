import { Fetch } from "@/shared/lib";
export async function getUserCart() {
    const data = await Fetch("/api/cart");
    return data;
}