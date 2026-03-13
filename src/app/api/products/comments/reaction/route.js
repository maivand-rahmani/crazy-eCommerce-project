import { getServerSession } from 'next-auth'
import prisma from "../../../../../../prisma/client";
import { authOptions } from '@/features/auth/model/authOptions';

export async function POST(req) {
  const { commentId, type } = await req.json();
  const user = await getServerSession(authOptions).then((res) => res?.user);

  if (!user) return Response.json({ error: "Not authorized" }, { status: 401 });

  const existing = await prisma.reviews_reactions.findFirst({
    where: {
      user_id: user.id,
      comment_id: Number(commentId)
    }
  });

  if (!existing) {
    await prisma.reviews_reactions.create({
      data: {
        user_id: user.id,
        comment_id: Number(commentId),
        type
      }
    });
  } 
  else if (existing.type === type) {
    await prisma.reviews_reactions.delete({
      where: { id: existing.id }
    });
  } 
  else {
    // 3. Нажал противоположную → обновить
    await prisma.reviews_reactions.update({
      where: { id: existing.id },
      data: { type }
    });
  }

  // Возвращаем обновлённые подсчёты
  const likes = await prisma.reviews_reactions.count({
    where: { comment_id: Number(commentId), type: "like" },
  });

  const dislikes = await prisma.reviews_reactions.count({
    where: { comment_id: Number(commentId), type: "dislike" },
  });

  return Response.json({ likes, dislikes });
}
