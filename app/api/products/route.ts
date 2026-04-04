import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorized, unauthorizedAdminResponse } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    const body = await request.json();
    const { id, stockQuantity } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stockQuantity: Number(stockQuantity) }
    });

    return NextResponse.json({ product: updatedProduct });
  } catch {
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }
}
