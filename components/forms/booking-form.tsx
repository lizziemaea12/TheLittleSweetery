"use client";

import { FormEvent, useState } from "react";
import { EVENT_TYPES } from "@/lib/constants";

type FormState = {
  name: string;
  email: string;
  eventDate: string;
  eventType: (typeof EVENT_TYPES)[number];
  guestCount: string;
  notes: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  eventDate: "",
  eventType: "birthday party",
  guestCount: "",
  notes: "",
};

export function BookingForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name || !form.email || !form.eventDate || !form.guestCount) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          guestCount: Number(form.guestCount),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to submit booking request.");
        return;
      }
      setSuccess("Thanks! Your booking request was sent.");
      setForm(initialState);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-oliveGray/30 bg-white p-5 shadow-sm">
      <div>
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          required
          className="mt-1 block w-full rounded border border-oliveGray/50 p-2"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          className="mt-1 block w-full rounded border border-oliveGray/50 p-2"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
      </div>
      <div>
        <label htmlFor="eventDate">Event date</label>
        <input
          id="eventDate"
          type="date"
          required
          className="mt-1 block w-full rounded border border-oliveGray/50 p-2"
          value={form.eventDate}
          onChange={(e) => setForm((prev) => ({ ...prev, eventDate: e.target.value }))}
        />
      </div>
      <div>
        <label htmlFor="eventType">Event type</label>
        <select
          id="eventType"
          className="mt-1 block w-full rounded border border-oliveGray/50 p-2"
          value={form.eventType}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, eventType: e.target.value as FormState["eventType"] }))
          }
        >
          {EVENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="guestCount">Estimated guest count</label>
        <input
          id="guestCount"
          type="number"
          min={1}
          required
          className="mt-1 block w-full rounded border border-oliveGray/50 p-2"
          value={form.guestCount}
          onChange={(e) => setForm((prev) => ({ ...prev, guestCount: e.target.value }))}
        />
      </div>
      <div>
        <label htmlFor="notes">Notes/message</label>
        <textarea
          id="notes"
          className="mt-1 block w-full rounded border border-oliveGray/50 p-2"
          rows={4}
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>
      {error ? <p className="text-red-600">{error}</p> : null}
      {success ? <p className="text-green-700">{success}</p> : null}
      <button
        type="submit"
        className="rounded-full bg-lavender px-4 py-2 font-semibold text-white disabled:opacity-60"
        disabled={submitting}
      >
        {submitting ? "Sending..." : "Submit booking request"}
      </button>
    </form>
  );
}
