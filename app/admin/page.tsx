import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminLoginGate } from "@/components/admin/admin-login-gate";
import { PendingRatingsTable } from "@/components/admin/pending-ratings-table";
import { BookingsTable } from "@/components/admin/bookings-table";

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
  try {
    [pendingRatings, bookings] = await Promise.all([
      prisma.rating.findMany({
        where: { approved: false },
        orderBy: { createdAt: "desc" },
      }),
      prisma.bookingRequest.findMany({
        orderBy: { eventDate: "asc" },
      }),
    ]);
  } catch {
    pendingRatings = [];
    bookings = [];
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-lavender md:text-4xl">Admin</h1>
        <AdminLoginGate />
      </section>
      <PendingRatingsTable initialRatings={pendingRatings} />
      <BookingsTable bookings={bookings} />
    </div>
  );
}
