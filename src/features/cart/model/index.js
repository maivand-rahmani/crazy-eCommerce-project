import { Fetch } from "@/shared/lib";
export async function getUserCart() {
    const response = await Fetch("/api/cart");
    return response;
}
