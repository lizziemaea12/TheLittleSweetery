import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ratingSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const parsed = ratingSchema.safeParse({
      ...raw,
      stars: Number(raw.stars),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid rating submission", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const rating = await prisma.rating.create({
      data: { ...parsed.data, approved: false },
    });

    return NextResponse.json({ rating }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save rating" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const ratings = await prisma.rating.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ratings });
  } catch {
    return NextResponse.json({ error: "Unable to fetch ratings" }, { status: 500 });
  }
}
