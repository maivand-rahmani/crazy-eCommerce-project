import prisma from '../../../../../prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import { getAuthSecret } from '@/shared/lib/auth';

export const GET = async (req) => {
    try {
        const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
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
    } catch (error) {
        console.error("Addresses GET error:", error);
        return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
    }
}

export const POST = async (req) => {
    try {
        const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
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

        const alreadyDefault = addresses.some(address => address.isDefault === true);
        
        if (body.isDefault && alreadyDefault) {
            return NextResponse.json({ error: "Only one address can be set as default. Please unset the current default address before setting a new one." , status: 409 }, { status: 409 })
        }

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
    } catch (error) {
        console.error("Addresses POST error:", error);
        return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
    }
}

export const DELETE = async (req) => {
    try {
        const data = await req.json()
        const addressId = data.id;

        const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!user) 
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const existingAddresses = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                addresses: true
            }
        })
        
        const addresses = existingAddresses?.addresses ?? [];
        const addressToDelete = addresses.find((address) => address.id === addressId);

        if (addressToDelete) {
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    addresses: {
                        set: addresses.filter((address) => address.id !== addressId)
                    }
                }
            })  

            return NextResponse.json({ message: "Address deleted successfully" , status: 200 }, { status: 200 })
        } 

        return NextResponse.json({ error: "Address not found" }, { status: 404 })
    } catch (error) {
        console.error("Addresses DELETE error:", error);
        return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
    }
}

export const PUT = async (req) => {
    try {
        const user = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const body = await req.json();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const existingAddresses = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                addresses: true
            }
        })

        const addresses = existingAddresses?.addresses ?? [];
        const addressToUpdate = addresses.find((address) => address.id === body.id);

        if (addressToUpdate) {
            const response = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    addresses: {
                        set: addresses.map((address) => {
                            if (address.id === body.id) {
                                return body;
                            }
                            return address;
                        })
                    }
                }
            })

            return NextResponse.json({ data: response, status: 200 })
        }

        return NextResponse.json({ error: "Address not found" }, { status: 404 })
    } catch (error) {
        console.error("Addresses PUT error:", error);
        return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
    }
}
