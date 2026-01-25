import { addToCart } from './addToCart.js'
import { toast } from 'react-hot-toast'

export async function handleCartQuantityChange({ setLoading = () => {} , setCounter = () => {} , setAdded = () => {}, cart_id , variantId , method }){
    if (method === "add") {
      setLoading(true);
      setCounter((s) => s + 1);
      try {
        let res = await addToCart(variantId, method, cart_id);

        setCounter(res.item.quantity);
        setAdded(res.item);
        if (!res.item)
          throw new Error("Something gone wrong while sending request");
      } catch {
        setCounter((s) => s - 1);
        toast.error("Something gone wrong while sending request");
      } finally {
        setLoading(false);
      }
    }

    if (method === "remove") {
      setLoading(true);
      setCounter((s) => s - 1);
      try {
        let res = await addToCart(variantId, method, cart_id);

        setCounter(res?.item?.quantity);
        if (res?.item) setAdded(res?.item);
        else setAdded(false);

        if (res?.success)
          throw new Error("Something gone wrong while sending request");
      } catch {
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
      } catch {
        toast.error("Something gone wrong while sending request");
      } finally {
        setLoading(false);
      }
    }

    
    return true
}
