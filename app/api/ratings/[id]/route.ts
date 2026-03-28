import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorized, unauthorizedAdminResponse } from "@/lib/admin-auth";

type RouteContext = {
  params: { id: string };
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  if (!isAdminAuthorized(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    const rating = await prisma.rating.findUnique({ where: { id: params.id } });
    if (!rating) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }

    const updated = await prisma.rating.update({
      where: { id: params.id },
      data: { approved: !rating.approved },
    });
    return NextResponse.json({ rating: updated });
  } catch {
    return NextResponse.json({ error: "Unable to update rating" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!isAdminAuthorized(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    await prisma.rating.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete rating" }, { status: 500 });
  }
}
