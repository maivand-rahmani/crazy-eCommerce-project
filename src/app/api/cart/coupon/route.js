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
    try {
        const { searchParams } = new URL(req.url)
        const coupon = searchParams.get("coupon")
        let checkedCoupon;

        const res = await prisma.coupons.findFirst({
            where: {coupon_code: coupon}
        })

        if (res) checkedCoupon = checkIfCouponValid(res)
        
        if (checkedCoupon) {
            const updated = await prisma.coupons.update({
                where: {coupon_code: res.coupon_code},
                data: {times_used: { increment: 1}}
            })

            if (updated) {
                return NextResponse.json({ ...checkedCoupon , status: 200 })
            }
        }

        return NextResponse.json({ status: 404 })
    } catch (error) {
        console.error("Coupon API error:", error);
        return NextResponse.json(
            { error: "Failed to validate coupon" },
            { status: 500 }
        );
    }
}
