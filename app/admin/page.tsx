import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminLoginGate } from "@/components/admin/admin-login-gate";
import { PendingRatingsTable } from "@/components/admin/pending-ratings-table";
import { BookingsTable } from "@/components/admin/bookings-table";
import { InventoryTable } from "@/components/admin/inventory-table";
import { OrdersTable } from "@/components/admin/orders-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Little Sweetery Admin",
  description: "Admin tools for ratings moderation and booking requests.",
  openGraph: {
    title: "The Little Sweetery Admin",
    description: "Admin tools for ratings moderation and booking requests.",
  },
};

export default async function AdminPage() {
  let pendingRatings: Awaited<ReturnType<typeof prisma.rating.findMany>> = [];
  let bookings: Awaited<ReturnType<typeof prisma.bookingRequest.findMany>> = [];
  let products: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let orders: Awaited<
    ReturnType<
      typeof prisma.order.findMany<{
        include: { items: { include: { product: { select: { name: true } } } } };
      }>
    >
  > = [];

  try {
    const [ratingsRes, bookingsRes, productsRes, ordersRes] = await Promise.all([
      prisma.rating.findMany({
        where: { approved: false },
        orderBy: { createdAt: "desc" },
      }),
      prisma.bookingRequest.findMany({
        orderBy: { eventDate: "asc" },
      }),
      prisma.product.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.order.findMany({
        include: {
          items: {
            include: { product: { select: { name: true } } }
          }
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    pendingRatings = ratingsRes;
    bookings = bookingsRes;
    products = productsRes;
    orders = ordersRes;
  } catch {
    // Error logged or handled via empty arrays
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-lavender md:text-4xl">Admin</h1>
        <AdminLoginGate />
      </section>
      <PendingRatingsTable initialRatings={pendingRatings} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <InventoryTable initialProducts={products} />
        <OrdersTable initialOrders={orders} />
      </div>
      <BookingsTable bookings={bookings} />
    </div>
  );
}
