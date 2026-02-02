import prisma from '../../../../prisma/client'
export async function getUserByEmail(email) {
    try {
        let user = await prisma.User.findUnique({where: {email: email}})
        if (!user) return null
        return user
    } catch (error) {
        return new Error(error)
    }
    
}