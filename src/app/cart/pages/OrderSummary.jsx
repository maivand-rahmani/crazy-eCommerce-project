"use client";
import React, { useState } from "react";
import CouponForm from '../components/CouponForm'
import { X } from "lucide-react";




const OrderSummary = ({ total , setCheckout , checkout }) => {
  const [coupon, setCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [userForm , setUserForm] = useState({})

  let discardChecout = () => {
    setCheckout(false)
    setCoupon(false)
    setDiscountAmount(0)
  }

  return (
    <div className="md:pt-25 p-4 transition-all duration-500 ease-in-out">
      <div className="rounded-2xl block sticky p-5 top-25 border shadow-xl">
        <div className="font-extrabold text-2xl uppercase flex justify-between">
          <h1>Order summary: </h1>
          {checkout && <X onClick={discardChecout}/>} 
        </div>

        {checkout && <CouponForm total={total} setAmount={setDiscountAmount} setCoupon={setCoupon}/>}

        {/* totals */}
        <div className="flex flex-col text-xl gap-5 my-5">
          <div className="font-bold flex justify-between">
            <h1>Subtotal: </h1>
            <h1>{total.toFixed(2)}$</h1>
          </div>
          {coupon && (
            <div className="flex justify-between text-unactive-text">
              <h1>Discount: </h1>
              <h1 className="text-green-700">-{discountAmount}$</h1>
            </div>
          )}
          <div className="font-bold flex justify-between">
            <h2>total: </h2>
            <h2>{(total - discountAmount).toFixed(2)}$</h2>
          </div>
        </div>

        <button onClick={() => setCheckout(true)} className="bg-black  text-white w-full p-5 text-center font-extrabold font-mono rounded">
          {checkout ? "Order" : "Checkout"}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;
