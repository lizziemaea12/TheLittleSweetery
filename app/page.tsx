import Link from "next/link";
import { Hero } from "@/components/hero";
import { TreatCard } from "@/components/treat-card";
import { RatingsList } from "@/components/ratings-list";
import { TREATS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  let latestRatings: Awaited<ReturnType<typeof prisma.rating.findMany>> = [];
  try {
    latestRatings = await prisma.rating.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  } catch {
    latestRatings = [];
  }

  return (
    <div className="space-y-10">
      <Hero />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Treats</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TREATS.map((treat) => (
            <TreatCard key={treat.key} name={treat.name} description={treat.description} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Recent Ratings</h2>
          <Link href="/ratings" className="underline">
            View all ratings
          </Link>
        </div>
        <RatingsList ratings={latestRatings} />
      </section>
    </div>
  );
}
