"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import productsData from "@/data/products.json";
import { Product } from "@/lib/types";

const products = productsData as Product[];
const previewProducts = products.slice(0, 4);

const FAQS = [
  {
    q: "How does the recommendation work?",
    a: "You answer a short questionnaire about your income, deductions, and how much help you want. Our engine matches your answers against product rules and suggests the best fit.",
  },
  {
    q: "Is this real tax advice?",
    a: "No. This tool only provides product guidance based on predefined rules. For tax, legal, or financial advice, please consult a qualified professional.",
  },
  {
    q: "Can I ask questions instead of using the wizard?",
    a: "Yes — use the AI Assistant to ask in plain language, like 'I have freelance income, which product fits me?'",
  },
  {
    q: "What about incorporated companies?",
    a: "The wizard and assistant both handle incorporated companies, freelancers, investors, and more.",
  },
];

const STEPS = [
  { label: "Answer", detail: "Tell us about income, deductions, and how much help you want." },
  { label: "Match", detail: "Our engine checks your answers against every product rule instantly." },
  { label: "File", detail: "Pick your recommended product and get started with confidence." },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-[#0B0E14] text-[#F2EFE9] overflow-x-hidden">
      <style jsx global>{`
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes resolve {
          0% { opacity: 0; transform: translateY(6px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(420%); opacity: 0; }
        }
        .rise { animation: riseIn 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .rise-1 { animation-delay: 0.05s; }
        .rise-2 { animation-delay: 0.18s; }
        .rise-3 { animation-delay: 0.3s; }
        .rise-4 { animation-delay: 0.42s; }
        .float-slow { animation: drift 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .rise, .float-slow, .resolve-row { animation: none !important; }
        }
      `}</style>

      {/* ================= HERO ================= */}
      <section className="relative min-h-[92vh] flex items-center px-6 sm:px-10">
        {/* ambient backdrop */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full bg-[#C9A24B]/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-[#3D5A6C]/20 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#F2EFE9 1px, transparent 1px), linear-gradient(90deg, #F2EFE9 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center py-20">
          {/* Left: copy */}
          <div>
            <p className={`text-xs tracking-[0.25em] uppercase text-[#C9A24B] mb-6 ${mounted ? "rise rise-1" : "opacity-0"}`}>
              Tax Software
            </p>
            <h1 className={`text-5xl sm:text-6xl font-bold leading-[1.05] tracking-tight mb-6 ${mounted ? "rise rise-2" : "opacity-0"}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Eight products.
              <br />
              One that's <span className="text-[#C9A24B] italic">actually yours.</span>
            </h1>
            <p className={`text-lg text-[#F2EFE9]/60 max-w-md mb-10 leading-relaxed ${mounted ? "rise rise-3" : "opacity-0"}`}>
              Answer a few honest questions or ask our assistant directly — we'll match your real situation to the right product, with the reasoning shown.
            </p>
            <div className={`flex flex-wrap gap-4 ${mounted ? "rise rise-4" : "opacity-0"}`}>
              <Link
                href="/recommend"
                className="group relative px-7 py-3.5 rounded-full bg-[#C9A24B] text-[#0B0E14] font-semibold overflow-hidden transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <span className="relative z-10">Find my product</span>
              </Link>
              <Link
                href="/compare"
                className="px-7 py-3.5 rounded-full border border-[#F2EFE9]/20 font-semibold hover:border-[#F2EFE9]/50 hover:bg-white/5 transition-colors"
              >
                Compare products
              </Link>
            </div>
          </div>

          {/* Right: signature animated element — fields resolving into a match */}
          <div className={`relative ${mounted ? "rise rise-3" : "opacity-0"}`}>
            <div className="relative rounded-2xl border border-[#F2EFE9]/10 bg-white/[0.03] backdrop-blur-sm p-6 float-slow overflow-hidden">
              {/* scanning line */}
              <div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A24B] to-transparent"
                style={{ animation: "scanline 3.5s ease-in-out infinite" }}
              />
              <p className="text-xs uppercase tracking-widest text-[#F2EFE9]/40 mb-4">Matching your inputs</p>

              <div className="space-y-2.5 mb-5">
                {[
                  { label: "Freelance income", on: true },
                  { label: "Home-office expenses", on: true },
                  { label: "Investment income", on: false },
                  { label: "Wants expert help", on: false },
                ].map((row, i) => (
                  <div
                    key={row.label}
                    className="resolve-row flex items-center justify-between text-sm py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5"
                    style={{ animation: `resolve 0.5s ease both`, animationDelay: `${0.6 + i * 0.15}s` }}
                  >
                    <span className="text-[#F2EFE9]/70">{row.label}</span>
                    <span className={row.on ? "text-[#C9A24B]" : "text-[#F2EFE9]/25"}>
                      {row.on ? "✓ matched" : "—"}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="rounded-xl bg-[#C9A24B]/10 border border-[#C9A24B]/30 px-4 py-4"
                style={{ animation: "resolve 0.6s ease both", animationDelay: "1.3s" }}
              >
                <p className="text-xs uppercase tracking-widest text-[#C9A24B]/70 mb-1">Recommended</p>
                <p className="text-xl font-bold">Self-Employed — CAD $70</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCT PREVIEW ================= */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-24">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
            Start with the basics
          </h2>
          <Link href="/products" className="text-[#C9A24B] text-sm font-medium hover:underline">
            View all eight products →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {previewProducts.map((product, i) => (
            <div
              key={product.id}
              className="group relative rounded-xl border border-[#F2EFE9]/10 p-6 hover:border-[#C9A24B]/40 hover:bg-white/[0.02] transition-all duration-300"
style={
  mounted
    ? {
        animationName: "riseIn",
        animationDuration: "0.6s",
        animationTimingFunction: "ease",
        animationFillMode: "both",
        animationDelay: `${i * 0.08}s`,
      }
    : undefined
}            >
              <p className="text-xs text-[#F2EFE9]/40 mb-2">0{i + 1}</p>
              <h3 className="font-bold text-lg mb-1">{product.name}</h3>
              <p className="text-2xl font-bold text-[#C9A24B] mb-3">
                ${product.price}
                <span className="text-xs text-[#F2EFE9]/40 font-normal"> CAD</span>
              </p>
              <p className="text-sm text-[#F2EFE9]/55 leading-relaxed">{product.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="border-y border-[#F2EFE9]/10 bg-white/[0.015]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-24">
          <h2 className="text-3xl font-bold mb-14" style={{ fontFamily: "Georgia, serif" }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative">
            <div className="hidden sm:block absolute top-5 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-[#C9A24B]/40 via-[#C9A24B]/10 to-transparent" />
            {STEPS.map((step, i) => (
              <div key={step.label} className="relative">
                <div className="w-10 h-10 rounded-full bg-[#0B0E14] border border-[#C9A24B]/50 text-[#C9A24B] flex items-center justify-center font-bold text-sm mb-5 relative z-10">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.label}</h3>
                <p className="text-sm text-[#F2EFE9]/55 leading-relaxed max-w-xs">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="max-w-3xl mx-auto px-6 sm:px-10 py-24">
        <h2 className="text-3xl font-bold mb-12" style={{ fontFamily: "Georgia, serif" }}>
          Questions, answered
        </h2>
        <div className="divide-y divide-[#F2EFE9]/10">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="flex justify-between items-center cursor-pointer list-none font-medium text-[#F2EFE9]/90">
                {faq.q}
                <span className="text-[#C9A24B] transition-transform group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <p className="text-sm text-[#F2EFE9]/55 mt-3 leading-relaxed pr-8">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#F2EFE9]/10 py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[#F2EFE9]/40">
          <p>© 2026 Tax Software</p>
          <div className="flex gap-6">
            <Link href="/products" className="hover:text-[#F2EFE9]">Products</Link>
            <Link href="/compare" className="hover:text-[#F2EFE9]">Compare</Link>
            <Link href="/recommend" className="hover:text-[#F2EFE9]">Recommend</Link>
            <Link href="/assistant" className="hover:text-[#F2EFE9]">Assistant</Link>
          </div>
        </div>
        <p className="text-xs text-[#F2EFE9]/25 text-center mt-5 max-w-xl mx-auto px-6">
          Fictional product for demonstration purposes only. Not real tax software, and not tax, legal, or financial advice.
        </p>
      </footer>
    </div>
  );
}