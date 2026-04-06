import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorized, unauthorizedAdminResponse } from "@/lib/admin-auth";

export async function GET() {
  try {
    let settings = await prisma.globalSetting.findUnique({
      where: { id: "settings" },
    });

    if (!settings) {
      settings = await prisma.globalSetting.create({
        data: { id: "settings", inventoryMode: true },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    const { inventoryMode } = await request.json();

    if (typeof inventoryMode !== "boolean") {
      return NextResponse.json({ error: "Invalid inventoryMode" }, { status: 400 });
    }

    const settings = await prisma.globalSetting.upsert({
      where: { id: "settings" },
      update: { inventoryMode },
      create: { id: "settings", inventoryMode },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
