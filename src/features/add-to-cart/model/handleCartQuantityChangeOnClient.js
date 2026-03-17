import { toast } from "react-hot-toast";

import { addToCart } from "./addToCart.js";

const MAX_QUANTITY = 99;
const MIN_QUANTITY = 1;

export async function handleCartQuantityChange({
  setLoading = () => {},
  setCounter = () => {},
  setAdded = () => {},
  cart_id,
  variantId,
  method,
}) {
  if (method === "add") {
    setLoading(true);
    setCounter((current) => {
      if (current >= MAX_QUANTITY) {
        toast.error(`Maximum quantity is ${MAX_QUANTITY}`);
        return current;
      }
      return current + 1;
    });

    try {
      const res = await addToCart(variantId, method, cart_id);

      if (res?.error) {
        throw new Error(res.error);
      }

      setCounter(res.item.quantity);
      setAdded(res.item);
    } catch (error) {
      setCounter((current) => current - 1);
      toast.error(error instanceof Error ? error.message : "Could not update cart.");
      return false;
    } finally {
      setLoading(false);
    }

    return true;
  }

  if (method === "remove") {
    setLoading(true);
    setCounter((current) => (current <= MIN_QUANTITY ? current : current - 1));

    try {
      const res = await addToCart(variantId, method, cart_id);

      if (res?.error) {
        throw new Error(res.error);
      }

      if (res?.item) {
        setCounter(res.item.quantity);
        setAdded(res.item);
      } else {
        setCounter(0);
        setAdded(false);
      }

      return true;
    } catch (error) {
      setCounter((current) => current + 1);
      toast.error(error instanceof Error ? error.message : "Could not update cart.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  if (method === "delete") {
    setLoading(true);

    try {
      const res = await addToCart(variantId, method, cart_id);

      if (!res?.success) {
        throw new Error(res?.error || "Could not remove this item.");
      }

      setCounter(0);
      setAdded(false);
      toast.success("Item removed from cart");
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove this item.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  return false;
}

export default handleCartQuantityChange;
