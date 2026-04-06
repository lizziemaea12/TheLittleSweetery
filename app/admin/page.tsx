import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminLoginGate } from "@/components/admin/admin-login-gate";
import { PendingRatingsTable } from "@/components/admin/pending-ratings-table";
import { BookingsTable } from "@/components/admin/bookings-table";
import { InventoryTable } from "@/components/admin/inventory-table";
import { OrdersTable } from "@/components/admin/orders-table";

import { InventoryModeToggle } from "@/components/admin/inventory-mode-toggle";

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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [pendingRatings, bookings, products, orders, settings] = (await Promise.all([
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
    prisma.globalSetting.findUnique({
      where: { id: "settings" },
    }).then((s: any) => s ?? { inventoryMode: true }),
  ]).catch(() => [[], [], [], [], { inventoryMode: true }])) as any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <div className="space-y-12 pb-24">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-lavender/10 shadow-xl shadow-lavender/5">
        <div className="space-y-1">
          <h1 className="text-4xl font-display font-bold text-chocolate italic">Dashboard</h1>
          <p className="text-chocolate/60 text-sm">Welcome back to <span className="text-lavender font-bold">The Little Sweetery</span> admin panel.</p>
          <div className="pt-2">
             <AdminLoginGate />
          </div>
        </div>
        <div className="w-full md:w-auto">
          <InventoryModeToggle initialMode={settings.inventoryMode} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-12">
        <PendingRatingsTable initialRatings={pendingRatings} />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 h-full">
            <InventoryTable initialProducts={products} />
          </div>
          <div className="lg:col-span-3 h-full">
            <OrdersTable initialOrders={orders} />
          </div>
        </div>

        <BookingsTable bookings={bookings} />
      </section>
    </div>
  );
}
