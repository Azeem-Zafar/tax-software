import productsData from "@/data/products.json";
import { Product } from "@/lib/types";
import Link from "next/link";

const products = productsData as Product[];

const FEATURE_LABELS: Record<string, string> = {
  salaryIncome: "Salary income",
  studentIncome: "Student income",
  medicalExpenses: "Medical expenses",
  donations: "Donations",
  employmentExpenses: "Employment expenses",
  investmentIncome: "Investment income",
  capitalGains: "Capital gains",
  foreignIncome: "Foreign income",
  rentalIncome: "Rental income",
  freelanceIncome: "Freelance income",
  gigWorkIncome: "Gig-work income",
  businessExpenses: "Business expenses",
  homeOfficeExpenses: "Home-office expenses",
  vehicleExpenses: "Vehicle expenses",
  expertHelp: "Expert help",
  fullService: "Full service filing",
  corporateFiling: "Corporate filing",
  nilCorporateReturn: "Nil corporate return",
};

function getTopFeatures(product: Product, limit = 4): string[] {
  return Object.entries(product.supports)
    .filter(([, value]) => value === true)
    .map(([key]) => FEATURE_LABELS[key] || key)
    .slice(0, limit);
}

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <p className="text-xs tracking-[0.25em] uppercase text-[#C9A24B] mb-4">
          All Products
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Eight products, built for different lives.
        </h1>
        <p className="text-[#F2EFE9]/60 text-lg">
          From a simple salary return to a full corporate filing — pick the one that
          matches your situation, or let the wizard choose for you.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((product, i) => (
      <div
  key={product.id}
  className="animate-fade-up group relative rounded-2xl border border-[#F2EFE9]/10 bg-white/[0.02] p-6 flex flex-col hover:border-[#C9A24B]/40 hover:bg-white/[0.04] transition-all duration-300"
  style={{ animationDelay: `${i * 0.06}s` }}
>

            <div className="flex items-start justify-between mb-4">
              <span className="text-xs text-[#F2EFE9]/30">0{i + 1}</span>
              <span className="text-2xl font-bold text-[#C9A24B]">
                ${product.price}
                <span className="text-xs text-[#F2EFE9]/40 font-normal"> CAD</span>
              </span>
            </div>

            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <p className="text-sm text-[#F2EFE9]/55 mb-5 leading-relaxed">
              {product.description}
            </p>

            <p className="text-[11px] font-semibold text-[#F2EFE9]/35 uppercase tracking-wider mb-2">
              Best For
            </p>
            <ul className="text-sm text-[#F2EFE9]/70 mb-5 space-y-1">
              {product.bestFor.map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>

            <p className="text-[11px] font-semibold text-[#F2EFE9]/35 uppercase tracking-wider mb-2">
              Key Features
            </p>
            <ul className="text-sm text-[#F2EFE9]/70 mb-6 space-y-1.5">
              {getTopFeatures(product).map((f, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-[#C9A24B]">✓</span> {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex gap-2 pt-2 border-t border-[#F2EFE9]/10">
              <Link
                href="/recommend"
                className="flex-1 text-center px-4 py-2.5 rounded-full bg-[#C9A24B] text-[#0B0E14] text-sm font-semibold hover:scale-[1.02] transition-transform"
              >
                Choose This
              </Link>
              <Link
                href="/compare"
                className="flex-1 text-center px-4 py-2.5 rounded-full border border-[#F2EFE9]/20 text-sm font-medium hover:border-[#F2EFE9]/40 transition-colors"
              >
                Compare
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}