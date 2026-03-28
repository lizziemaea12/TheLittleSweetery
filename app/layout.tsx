import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const displayFont = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "The Little Sweetery",
    template: "%s | The Little Sweetery",
  },
  description: "Kid-owned treats for parties, school events, and neighborhood celebrations.",
  openGraph: {
    title: "The Little Sweetery",
    description: "Kid-owned treats for parties, school events, and neighborhood celebrations.",
    type: "website",
    images: [{ url: "/images/logo.png", width: 1024, height: 1024, alt: "The Little Sweetery logo" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-5xl flex-1 p-4">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
