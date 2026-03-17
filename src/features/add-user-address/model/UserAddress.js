"use server"
import { Fetch } from "@/shared/lib/fetch"

export async function addUserAddress(address) {
    try {
        const response = await Fetch('/api/user/addresses', 'POST', address)  
        return response      
    } catch (error) {
        return new Error(error)
    }
}

export async function updateUserAddress(addressId , address) {
    try {
        const response = await Fetch('/api/user/addresses', 'PUT', { ...address , id: addressId }) 
        return response      
    } catch (error) {
        return new Error(error)
    }
}