import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RatingsList } from "@/components/ratings-list";
import { RatingForm } from "@/components/forms/rating-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Little Sweetery Ratings",
  description: "See approved ratings and submit your own feedback.",
  openGraph: {
    title: "The Little Sweetery Ratings",
    description: "See approved ratings and submit your own feedback.",
  },
};

export default async function RatingsPage() {
  let ratings: Awaited<ReturnType<typeof prisma.rating.findMany>> = [];
  try {
    ratings = await prisma.rating.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    ratings = [];
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-lavender md:text-4xl">Customer Ratings</h1>
        <RatingsList ratings={ratings} />
      </section>
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Leave a Rating</h2>
        <p>New ratings are reviewed before they appear publicly.</p>
        <RatingForm />
      </section>
    </div>
  );
}
