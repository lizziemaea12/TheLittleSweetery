import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthorized, unauthorizedAdminResponse } from "@/lib/admin-auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  if (!isAdminAuthorized(request)) {
    return unauthorizedAdminResponse();
  }

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

interface OrderItemInput {
  productId: string;
  quantity: number;
}

interface OrderInput {
  customerName: string;
  customerEmail: string;
  items: OrderItemInput[];
}

interface OrderItemCreate {
  productId: string;
  quantity: number;
  price: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderInput = await request.json();
    const { customerName, customerEmail, items } = body;

    if (!customerEmail || !customerName || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // Step 1: Check inventory and calculate total price
    const productIds = items.map((i: OrderItemInput) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });
    
    // Explicitly type the product map to avoid implicit any
    type ProductType = (typeof dbProducts)[0];
    const productMap = new Map<string, ProductType>();
    dbProducts.forEach(p => productMap.set(p.id, p));

    let totalPrice = 0;
    const itemsToCreate: OrderItemCreate[] = [];

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
      }

      if (dbProduct.stockQuantity < item.quantity) {
        return NextResponse.json({ 
          error: `Not enough stock for ${dbProduct.name}. Only ${dbProduct.stockQuantity} left.` 
        }, { status: 400 });
      }

      totalPrice += dbProduct.price * item.quantity;
      itemsToCreate.push({
        productId: item.productId,
        quantity: item.quantity,
        price: dbProduct.price
      });
    }

    // Step 2: Use a transaction to create the order and update stock
    const newOrder = await prisma.$transaction(async (tx) => {
      // 1. Create the order
      const order = await tx.order.create({
        data: {
          customerName,
          customerEmail,
          totalPrice,
          items: {
            create: itemsToCreate
          }
        },
        include: { items: true }
      });

      // 2. Update inventory
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });
      }

      return order;
    });

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Order error:", error);
    return NextResponse.json({ error: "Failed to place order: " + message }, { status: 500 });
  }
}
