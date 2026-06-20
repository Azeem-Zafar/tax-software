import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import MobileNav from "../app/MobileNav"

export const metadata: Metadata = {
  title: "Tax Software",
  description: "Find the right tax product for your situation.",
};

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/compare", label: "Compare" },
  { href: "/recommend", label: "Recommend" },
  { href: "/assistant", label: "AI Assistant" },
  { href: "/admin/products", label: "Admin" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0B0E14] text-[#F2EFE9] antialiased">
        <header className="sticky top-0 z-50 border-b border-[#F2EFE9]/10 bg-[#0B0E14]/80 backdrop-blur-md">
          <nav className="max-w-6xl mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg tracking-tight">
              <span className="text-[#C9A24B]">Tax</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden sm:flex items-center gap-7 text-sm">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#F2EFE9]/60 hover:text-[#F2EFE9] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <Link
              href="/recommend"
              className="hidden sm:inline-block px-4 py-2 rounded-full bg-[#C9A24B] text-[#0B0E14] text-sm font-semibold hover:scale-[1.03] transition-transform"
            >
              Find my product
            </Link>

            {/* Mobile menu (client component) */}
            <MobileNav navLinks={NAV_LINKS} />
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}