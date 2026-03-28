"use client";

import { FormEvent, useState } from "react";
import { StarRating } from "@/components/star-rating";

type RatingFormState = {
  name: string;
  stars: number;
  comment: string;
};

const initialState: RatingFormState = {
  name: "",
  stars: 5,
  comment: "",
};

type RatingFormProps = {
  onSubmitted?: () => Promise<void> | void;
};

export function RatingForm({ onSubmitted }: RatingFormProps) {
  const [form, setForm] = useState<RatingFormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.name || !form.comment) {
      setError("Please enter your name and comment.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to submit rating.");
        return;
      }
      setSuccess("Thanks! Your rating was submitted for approval.");
      setForm(initialState);
      await onSubmitted?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-oliveGray/30 bg-white p-5 shadow-sm">
      <div>
        <label htmlFor="rating-name">Name</label>
        <input
          id="rating-name"
          required
          className="mt-1 block w-full rounded border border-oliveGray/50 p-2"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>
      <div>
        <p>Stars</p>
        <StarRating value={form.stars} onChange={(stars) => setForm((prev) => ({ ...prev, stars }))} />
      </div>
      <div>
        <label htmlFor="rating-comment">Comment</label>
        <textarea
          id="rating-comment"
          required
          rows={4}
          className="mt-1 block w-full rounded border border-oliveGray/50 p-2"
          value={form.comment}
          onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))}
        />
      </div>
      {error ? <p className="text-red-600">{error}</p> : null}
      {success ? <p className="text-green-700">{success}</p> : null}
      <button
        type="submit"
        className="rounded-full bg-lavender px-4 py-2 font-semibold text-white disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? "Sending..." : "Submit rating"}
      </button>
    </form>
  );
}
