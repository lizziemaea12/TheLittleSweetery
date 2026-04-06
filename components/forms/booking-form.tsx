"use client";

import { FormEvent, useState, useEffect } from "react";
import { EVENT_TYPES } from "@/lib/constants";

type FormState = {
  name: string;
  email: string;
  eventDate: string;
  eventAddress: string;
  eventType: (typeof EVENT_TYPES)[number];
  guestCount: string;
  notes: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  eventDate: "",
  eventAddress: "",
  eventType: "birthday party",
  guestCount: "",
  notes: "",
};

export function BookingForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const guests = parseInt(form.guestCount);
    if (isNaN(guests) || guests <= 0) {
      setPrice(null);
      return;
    }

    if (guests < 20) setPrice(50);
    else if (guests <= 50) setPrice(80);
    else setPrice(120);
  }, [form.guestCount]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name || !form.email || !form.eventDate || !form.eventAddress || !form.guestCount) {
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
          estimatedPrice: price,
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
      setError("Something went wrong. Please try again or reach out to us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-3xl border border-oliveGray/20 bg-white p-6 sm:p-8 shadow-xl max-w-2xl mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-display font-bold text-chocolate italic">Book an Event</h2>
        <p className="text-chocolate/60 text-sm">Tell us about your sweet occasion and we&apos;ll get back to you with a quote!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-oliveGray/80 ml-1">Full Name</label>
          <input
            id="name"
            required
            placeholder="Jane Doe"
            className="w-full rounded-2xl border border-oliveGray/20 bg-cream/5 p-4 focus:ring-2 focus:ring-lavender/20 focus:border-lavender outline-none transition-all"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-oliveGray/80 ml-1">Email Address</label>
          <input
            id="email"
            type="email"
            required
            placeholder="jane@example.com"
            className="w-full rounded-2xl border border-oliveGray/20 bg-cream/5 p-4 focus:ring-2 focus:ring-lavender/20 focus:border-lavender outline-none transition-all"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="eventDate" className="text-xs font-black uppercase tracking-widest text-oliveGray/80 ml-1">Event Date</label>
          <input
            id="eventDate"
            type="date"
            required
            className="w-full rounded-2xl border border-oliveGray/20 bg-cream/5 p-4 focus:ring-2 focus:ring-lavender/20 focus:border-lavender outline-none transition-all"
            value={form.eventDate}
            onChange={(e) => setForm((prev) => ({ ...prev, eventDate: e.target.value }))}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="eventType" className="text-xs font-black uppercase tracking-widest text-oliveGray/80 ml-1">Event Type</label>
          <select
            id="eventType"
            className="w-full rounded-2xl border border-oliveGray/20 bg-cream/5 p-4 focus:ring-2 focus:ring-lavender/20 focus:border-lavender outline-none transition-all appearance-none cursor-pointer"
            value={form.eventType}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, eventType: e.target.value as FormState["eventType"] }))
            }
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="eventAddress" className="text-xs font-black uppercase tracking-widest text-oliveGray/80 ml-1">Event Address</label>
        <input
          id="eventAddress"
          required
          placeholder="123 Sweet St, Candy Town"
          className="w-full rounded-2xl border border-oliveGray/20 bg-cream/5 p-4 focus:ring-2 focus:ring-lavender/20 focus:border-lavender outline-none transition-all"
          value={form.eventAddress}
          onChange={(e) => setForm((prev) => ({ ...prev, eventAddress: e.target.value }))}
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="guestCount" className="text-xs font-black uppercase tracking-widest text-oliveGray/80 ml-1">Estimated Guest Count</label>
        <div className="relative">
          <input
            id="guestCount"
            type="number"
            min={1}
            required
            placeholder="0"
            className="w-full rounded-2xl border border-oliveGray/20 bg-cream/5 p-4 focus:ring-2 focus:ring-lavender/20 focus:border-lavender outline-none transition-all"
            value={form.guestCount}
            onChange={(e) => setForm((prev) => ({ ...prev, guestCount: e.target.value }))}
          />
          {price !== null && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-caramel/10 text-caramel font-bold px-4 py-1 rounded-full border border-caramel/20 animate-in fade-in zoom-in duration-300">
              Estimated Price: ${price}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="notes" className="text-xs font-black uppercase tracking-widest text-oliveGray/80 ml-1">Additional Notes</label>
        <textarea
          id="notes"
          placeholder="Any special requests or details we should know?"
          className="w-full rounded-2xl border border-oliveGray/20 bg-cream/5 p-4 focus:ring-2 focus:ring-lavender/20 focus:border-lavender outline-none transition-all"
          rows={3}
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="pt-2">
        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 text-sm mb-4 animate-in slide-in-from-top-2">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-2xl border border-green-100 text-sm mb-4 animate-in slide-in-from-top-2">
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-lavender p-4 font-bold text-white shadow-lg shadow-lavender/20 hover:bg-lavender/90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending Request..." : "Submit Booking Request"}
        </button>
      </div>
    </form>
  );
}
