import { addToCart } from './addToCart.js'
import { toast } from 'react-hot-toast'

const MAX_QUANTITY = 99;
const MIN_QUANTITY = 1;

export async function handleCartQuantityChange({ setLoading = () => {} , setCounter = () => {} , setAdded = () => {}, cart_id , variantId , method }){
    
    // Get current quantity from counter element if available
    const currentQty = setCounter ? 0 : 0; // We'll track through the callback

    if (method === "add") {
      setLoading(true);
      setCounter((s) => {
        if (s >= MAX_QUANTITY) {
          toast.error(`Maximum quantity is ${MAX_QUANTITY}`);
          return s;
        }
        return s + 1;
      });
      try {
        let res = await addToCart(variantId, method, cart_id);

        setCounter(res.item.quantity);
        setAdded(res.item);
        if (!res.item)
          throw new Error("Something gone wrong while sending request");
      } catch (error) {
        console.error("Add to cart failed:", error);
        setCounter((s) => s - 1);
        toast.error("Something gone wrong while sending request");
      } finally {
        setLoading(false);
      }
    }

    if (method === "remove") {
      setLoading(true);
      setCounter((s) => {
        if (s <= MIN_QUANTITY) {
          return s;
        }
        return s - 1;
      });
      try {
        let res = await addToCart(variantId, method, cart_id);

        setCounter(res?.item?.quantity);
        if (res?.item) setAdded(res?.item);
        else setAdded(false);

        if (res?.success)
          throw new Error("Something gone wrong while sending request");
      } catch (error) {
        console.error("Remove from cart failed:", error);
        setCounter((s) => s + 1);
        toast.error("Something gone wrong while sending request");
      } finally {
        setLoading(false);
      }
    }

    if (method === "delete") {
      setLoading(true);
      setCounter(0);
      try {
        let res = await addToCart(variantId, method, cart_id);
        if (res?.success) {
          setAdded(false);
          toast.success("Item removed from cart");
        }
        if (!res?.success)
          throw new Error("Something gone wrong while sending request");
      } catch (error) {
        console.error("Delete from cart failed:", error);
        toast.error("Something gone wrong while sending request");
      } finally {
        setLoading(false);
      }
    }

    
    return true
}
