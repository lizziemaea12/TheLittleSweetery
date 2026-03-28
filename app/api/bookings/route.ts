import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";
import { isAdminAuthorized, unauthorizedAdminResponse } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const parsed = bookingSchema.safeParse({
      ...raw,
      guestCount: Number(raw.guestCount),
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking request", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const booking = await prisma.bookingRequest.create({
      data: {
        ...parsed.data,
        eventDate: new Date(parsed.data.eventDate),
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unable to save booking request" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    const bookings = await prisma.bookingRequest.findMany({
      orderBy: { eventDate: "asc" },
    });
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json({ error: "Unable to fetch bookings" }, { status: 500 });
  }
}
