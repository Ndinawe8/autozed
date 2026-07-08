import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoZed — Buy & Sell Cars in Zambia",
  description:
    "Browse thousands of used and new cars from dealers and private sellers across Zambia. List your car for free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span>
                © {new Date().getFullYear()} AutoZed — demo marketplace.
              </span>
              <div className="flex gap-4">
                <Link href="/" className="hover:text-slate-900">
                  Browse cars
                </Link>
                <Link href="/sell" className="hover:text-slate-900">
                  Sell your car
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
