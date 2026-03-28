"use client";

import { useState } from "react";
import { formatDisplayDate } from "@/lib/utils";

type PendingRating = {
  id: string;
  name: string;
  stars: number;
  comment: string;
  approved: boolean;
  createdAt: string | Date;
};

type PendingRatingsTableProps = {
  initialRatings: PendingRating[];
};

export function PendingRatingsTable({ initialRatings }: PendingRatingsTableProps) {
  const [ratings, setRatings] = useState(initialRatings);
  const [error, setError] = useState<string | null>(null);

  async function approve(id: string) {
    setError(null);
    const response = await fetch(`/api/ratings/${id}`, { method: "PATCH" });
    if (!response.ok) {
      setError("Could not update rating.");
      return;
    }
    setRatings((prev) => prev.filter((rating) => rating.id !== id));
  }

  async function remove(id: string) {
    setError(null);
    const response = await fetch(`/api/ratings/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setError("Could not delete rating.");
      return;
    }
    setRatings((prev) => prev.filter((rating) => rating.id !== id));
  }

  return (
    <section className="space-y-3 rounded-2xl border border-oliveGray/30 bg-white p-4 shadow-sm">
      <h2 className="text-xl font-semibold">Pending Ratings</h2>
      {error ? <p className="text-red-600">{error}</p> : null}
      {ratings.length === 0 ? (
        <p>No pending ratings.</p>
      ) : (
        <ul className="space-y-3">
          {ratings.map((rating) => (
            <li key={rating.id} className="rounded-xl border border-oliveGray/30 p-3">
              <p className="font-semibold">
                {rating.name} ({rating.stars}/5)
              </p>
              <p>{rating.comment}</p>
              <p className="text-sm text-gray-600">{formatDisplayDate(rating.createdAt)}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => approve(rating.id)} className="rounded-full border border-oliveGray/60 px-3 py-1">
                  Approve
                </button>
                <button onClick={() => remove(rating.id)} className="rounded-full border border-oliveGray/60 px-3 py-1">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
