"use client"
import React , {useState} from 'react'
import CartProductsList from '@/entities/cart/ui/CartProductsList';
import OrderSummary from "@/entities/cart/ui/OrderSummary"



const page = () => {
  const [total , setTotal] = useState(0)
  const [checkout , setCheckout] = useState(false)
  const [items , setItems] = useState([])



  return (
    <div className={`py-10 transition-all text-text md:p-10 relative grid ${!checkout ? "md:grid-cols-[2fr_1fr]" : checkout ? "md:grid-cols-[1fr_2fr]" : ""}`}>
      <CartProductsList setItems={setItems} checkoutState={checkout} setTotal={setTotal} />
      {total > 0 && <OrderSummary checkout={checkout} items={items} setCheckout={setCheckout} total={total} />}
    </div>
  )
}

export default page