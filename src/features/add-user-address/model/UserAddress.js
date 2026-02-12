"use server"
import Fetch from "@/shared/lib/fetch"

export default async function addUserAddress(address) {
    try {
        const response = await Fetch('/api/user/addresses', 'POST', null, address)  
        return response      
    } catch (error) {
        return new Error(error)
    }
}