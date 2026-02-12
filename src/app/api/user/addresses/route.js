import prisma from '../../../../../prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
    const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const addresses = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            addresses: true
        }
    })
    if (!addresses) {
        return NextResponse.json({ error: "Address not found", status: 404 })
    }

    return NextResponse.json({ data: addresses, status: 200 })
}

export const POST = async (req) => {
    const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const body = await req.json();


    const existingAddresses = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            addresses: true
        }
    })

    const addresses = existingAddresses?.addresses ?? [];

    const alreadyExists = addresses.some(address =>
    address.street === body.street &&
    address.city === body.city &&
    address.state === body.state &&
    address.zip === body.zip
    );

    if (!alreadyExists) {
        const response = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                addresses: {
                    push: body 
                }
            }
        })

        return NextResponse.json({ data: response, status: 201 })
    }

    return NextResponse.json({ error: "Address already exists" }, { status: 400 })
}