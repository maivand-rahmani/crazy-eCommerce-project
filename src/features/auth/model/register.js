"use server";
import { hash } from 'bcrypt'
import Fetch from '@/shared/lib/fetch'

export async function register(data) {
  const { firstname, lastname, email, password } = data;
  const hashedPassword = await hash(password, 10);

  try {
    const user = await Fetch('/api/auth/register', 'POST', null, { firstname, lastname, email, password: hashedPassword });
    if (user) return user
  } catch (error) {
    return new Error("error while register" , error);
  }
}
