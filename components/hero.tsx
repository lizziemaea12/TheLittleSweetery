import Link from "next/link";

export function Hero() {
  return (
    <section className="rounded-2xl border border-oliveGray/30 bg-white/70 bg-dot-texture bg-dots p-6 shadow-sm">
      <h1 className="text-4xl font-bold text-lavender md:text-5xl">The Little Sweetery</h1>
      <p className="mt-2 text-lg font-semibold text-chocolate">
        Kid-owned treats for parties and community events.
      </p>
      <p className="mt-2 max-w-2xl">
        We serve handcrafted cake pops, caramel corn, puppy chow, and rotating seasonal specials
        for celebrations of all sizes.
      </p>
      <Link
        href="/book"
        className="mt-4 inline-block rounded-full bg-lavender px-5 py-2 font-semibold text-white transition hover:bg-accentTeal"
      >
        Book The Little Sweetery
      </Link>
    </section>
  );
}
