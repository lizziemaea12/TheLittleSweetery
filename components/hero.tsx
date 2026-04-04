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
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href="/order"
          className="inline-block rounded-full bg-caramel px-6 py-2 font-bold text-white shadow-lg shadow-caramel/20 transition hover:bg-chocolate"
        >
          Order Treats
        </Link>
        <Link
          href="/book"
          className="inline-block rounded-full bg-lavender px-6 py-2 font-bold text-white shadow-lg shadow-lavender/20 transition hover:bg-oliveGray"
        >
          Book An Event
        </Link>
      </div>
    </section>
  );
}
