import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function resolveOrCreateUserIdFromSession(): Promise<string | null> {
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

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: session?.user?.name ?? undefined,
      image: session?.user?.image ?? undefined,
    },
    create: {
      email,
      name: session?.user?.name ?? undefined,
      image: session?.user?.image ?? undefined,
      emailVerified: new Date(),
    },
    select: { id: true },
  });

  return user.id;
}

function generateProjectName(): string {
  const first = [
    "global",
    "alpha",
    "zen",
    "nova",
    "delta",
    "pixel",
    "fusion",
    "signal",
    "atlas",
    "neon",
  ];
  const second = [
    "design",
    "studio",
    "board",
    "system",
    "flow",
    "engine",
    "canvas",
    "portal",
    "framework",
    "prototype",
  ];

  const firstPart = first[Math.floor(Math.random() * first.length)] ?? "global";
  const secondPart =
    second[Math.floor(Math.random() * second.length)] ?? "design";
  const suffix = Date.now().toString(36).slice(-4);

  return `${firstPart}-${secondPart}-${suffix}`;
}

export async function GET(request: Request) {
  try {
    const userId = await resolveOrCreateUserIdFromSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim() ?? "";

    const projects = await prisma.project.findMany({
      where: {
        userId,
        deletedAt: null,
        ...(search
          ? {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            }
          : {}),
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        name: true,
        platform: true,
        status: true,
        healthScore: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ items: projects }, { status: 200 });
  } catch (error) {
    console.error("GET_PROJECTS_FAILED", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    const userId = await resolveOrCreateUserIdFromSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.create({
      data: {
        name: generateProjectName(),
        platform: "DESKTOP",
        status: "QUEUED",
        healthScore: 100,
        userId,
        journeyNodes: [],
        journeyEdges: [],
      },
      select: {
        id: true,
        name: true,
        platform: true,
        status: true,
        healthScore: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ item: project }, { status: 201 });
  } catch (error) {
    console.error("CREATE_PROJECT_FAILED", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
