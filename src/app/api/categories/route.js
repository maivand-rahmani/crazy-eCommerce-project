import { NextResponse } from 'next/server'
import prisma from '../../../../prisma/client'
import { serializeBigInt } from '../../../../prisma/funcs'

export async function GET() {
    try {
        const data = await prisma.categories.findMany()
        return NextResponse.json(serializeBigInt(data))
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch categories", status: 500 });
    }
}