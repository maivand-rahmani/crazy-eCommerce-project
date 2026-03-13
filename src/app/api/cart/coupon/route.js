import { NextResponse } from 'next/server'
import prisma from '../../../../../prisma/client'

let checkIfCouponValid = (coupon) => {
    const { id , discount_amount , discount_percent , max_usage , times_used , valid_from , expires_at} = coupon
    if (max_usage <= times_used) return false
    if (new Date(valid_from) > new Date()) return false
    if (new Date(expires_at) < new Date()) return false

    const type = discount_amount ? "amount" : "percent"

    return { id: id , type: type , value: type === "amount" ? discount_amount : discount_percent }
}

export async function GET(req){
    const { searchParams } = new URL(req.url)
    const coupon = searchParams.get("coupon")
    let checkedCoupon;

    const res = await prisma.coupons.findFirst({
        where: {coupon_code: coupon}
    })

    if (res) checkedCoupon = checkIfCouponValid(res)
    
    if (checkedCoupon) {
        return NextResponse.json({ ...checkedCoupon , status: 200 })
    }

    return NextResponse.json({ status: 404 })
}
