"use server"
import Fetch from "@/shared/lib/fetch"

async function addUserAddress(address) {
    const response = await Fetch('/api/users/addresses', 'POST', null, address)
    return response.json()
}