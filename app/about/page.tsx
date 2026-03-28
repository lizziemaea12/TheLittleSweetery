import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About The Little Sweetery",
  description: "Learn the story behind The Little Sweetery.",
  openGraph: {
    title: "About The Little Sweetery",
    description: "Learn the story behind The Little Sweetery.",
  },
};

export default function AboutPage() {
  return (
    <article className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-lavender md:text-4xl">About The Little Sweetery</h1>
        <p>
          The Little Sweetery is a kid-owned treat business created to bring joyful sweets to birthdays,
          school events, and neighborhood gatherings.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">Do you handle allergens?</h3>
            <p>
              We can share ingredient information, but treats may be made in spaces where common
              allergens are present.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">How far ahead should I book?</h3>
            <p>We recommend at least 2 weeks when possible, especially for larger events.</p>
          </div>
          <div>
            <h3 className="font-semibold">What serving sizes do you offer?</h3>
            <p>We tailor portions to your guest count and event type.</p>
          </div>
        </div>
      </section>
    </article>
  );
}
