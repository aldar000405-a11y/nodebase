import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function resolveUserIdFromSession(): Promise<string | null> {
  const session = await getServerSession(authOptions);

  const sessionUserId = session?.user?.id?.trim();
  if (sessionUserId) {
    const byId = await prisma.user.findUnique({
      where: { id: sessionUserId },
      select: { id: true },
    });

    if (byId?.id) {
      return byId.id;
    }
  }

  const email = session?.user?.email?.trim().toLowerCase();
  if (!email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const userId = await resolveUserIdFromSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const projectId = id?.trim();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project id is required" },
        { status: 400 },
      );
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        userId: true,
        deletedAt: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (existingProject.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (existingProject.deletedAt) {
      return NextResponse.json(
        {
          success: true,
          message: "Project already moved to trash",
          projectId,
        },
        { status: 200 },
      );
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project moved to trash",
        projectId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("SOFT_DELETE_PROJECT_FAILED", error);
    return NextResponse.json(
      { error: "Failed to soft delete project" },
      { status: 500 },
    );
  }
}
