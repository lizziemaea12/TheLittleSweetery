import type { Metadata } from "next";
import { BookingForm } from "@/components/forms/booking-form";

export const metadata: Metadata = {
  title: "Book The Little Sweetery",
  description: "Request The Little Sweetery for your event.",
  openGraph: {
    title: "Book The Little Sweetery",
    description: "Request The Little Sweetery for your event.",
  },
};

export default function BookPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold text-lavender md:text-4xl">Book The Little Sweetery</h1>
      <p>Tell us about your event and we will reach out to confirm details.</p>
      <BookingForm />
    </section>
  );
}
