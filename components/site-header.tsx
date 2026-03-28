import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="border-b border-oliveGray/40 bg-white/60 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 p-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl text-chocolate">
          <Image src="/images/logo.png" alt="The Little Sweetery" width={40} height={40} className="rounded-full" />
          <span>The Little Sweetery</span>
        </Link>
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-chocolate">
          <Link href="/about" className="hover:text-lavender">
            About
          </Link>
          <Link href="/book" className="hover:text-lavender">
            Book
          </Link>
          <Link href="/ratings" className="hover:text-lavender">
            Ratings
          </Link>
          <Link href="/admin" className="hover:text-lavender">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
