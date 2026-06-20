"use client";

import { useState } from "react";
import Link from "next/link";

type NavLink = { href: string; label: string };

export default function MobileNav({ navLinks }: { navLinks: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex flex-col items-center justify-center gap-1.5"
        aria-label="Toggle menu"
      >
        <span
          className={`block w-5 h-[1.5px] bg-[#F2EFE9] transition-all duration-300 ${
            open ? "rotate-45 translate-y-[3px]" : ""
          }`}
        />
        <span
          className={`block w-5 h-[1.5px] bg-[#F2EFE9] transition-all duration-300 ${
            open ? "-rotate-45 -translate-y-[3px]" : ""
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-[#0B0E14] border-b border-[#F2EFE9]/10 px-6 py-6 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-3 rounded-lg text-[#F2EFE9]/75 hover:bg-white/5 hover:text-[#F2EFE9] transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/recommend"
            onClick={() => setOpen(false)}
            className="mt-3 px-4 py-3 rounded-full bg-[#C9A24B] text-[#0B0E14] text-sm font-semibold text-center"
          >
            Find my product
          </Link>
        </div>
      )}
    </div>
  );
}