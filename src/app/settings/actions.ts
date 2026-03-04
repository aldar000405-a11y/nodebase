"use server";

import prisma from "@/lib/db";

export async function updateUserSettings(
  userId: number,
  data: { name: string; email: string },
) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Invalid email address.");
  }

  const existing = await prisma.user.findFirst({
    where: { email: data.email, NOT: { id: userId } },
  });
  if (existing) {
    throw new Error("Email is already in use.");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
    },
  });
  return user;
}
