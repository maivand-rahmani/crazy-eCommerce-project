import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth'
import prisma from "../../../../../../prisma/client";
import { authParams } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const { commentId, type } = await req.json();
    const user = await getServerSession(authParams).then((res) => res?.user);

    if (!user) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

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
      // Нажал противоположную → обновить
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

    return NextResponse.json({ likes, dislikes });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to update reaction" },
      { status: 500 },
    );
  }
}
