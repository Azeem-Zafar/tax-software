import productsData from "@/data/products.json";
import { Product } from "@/lib/types";

const products = productsData as Product[];

const COMPARE_FEATURES: { key: keyof Product["supports"]; label: string }[] = [
  { key: "salaryIncome", label: "Salary Income" },
  { key: "donations", label: "Donations" },
  { key: "medicalExpenses", label: "Medical Expenses" },
  { key: "investmentIncome", label: "Investment Income" },
  { key: "rentalIncome", label: "Rental Income" },
  { key: "freelanceIncome", label: "Freelance Income" },
  { key: "businessExpenses", label: "Business Expenses" },
  { key: "expertHelp", label: "Expert Help" },
  { key: "fullService", label: "Full Service" },
  { key: "corporateFiling", label: "Corporate Filing" },
  { key: "nilCorporateReturn", label: "Nil Return" },
];

export default function ComparePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <p className="text-xs tracking-[0.25em] uppercase text-[#C9A24B] mb-4">
          Side By Side
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Compare every product.
        </h1>
        <p className="text-[#F2EFE9]/60 text-lg">
          See exactly what each product supports before you decide.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[#F2EFE9]/10 bg-white/[0.02]">
        <table className="min-w-[950px] w-full text-sm">
          <thead>
            <tr className="border-b border-[#F2EFE9]/10">
              <th className="text-left px-5 py-4 font-semibold text-[#F2EFE9]/40 text-xs uppercase tracking-wider sticky left-0 bg-[#11151D]">
                Feature
              </th>
              {products.map((p) => (
                <th key={p.id} className="px-5 py-4 text-center min-w-[130px]">
                  <div className="font-bold text-[#F2EFE9]">{p.name}</div>
                  <div className="text-xs font-normal text-[#C9A24B] mt-1">
                    CAD ${p.price}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#F2EFE9]/5 hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-3.5 font-medium sticky left-0 bg-[#11151D]">
                Price
              </td>
              {products.map((p) => (
                <td key={p.id} className="px-5 py-3.5 text-center text-[#F2EFE9]/80">
                  CAD ${p.price}
                </td>
              ))}
            </tr>

            {COMPARE_FEATURES.map((feature) => (
              <tr
                key={feature.key}
                className="border-b border-[#F2EFE9]/5 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-3.5 font-medium sticky left-0 bg-[#11151D]">
                  {feature.label}
                </td>
                {products.map((p) => (
                  <td key={p.id} className="px-5 py-3.5 text-center">
                    {p.supports[feature.key] ? (
                      <span className="text-[#C9A24B] font-bold text-base">✓</span>
                    ) : (
                      <span className="text-[#F2EFE9]/15">✗</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-[#F2EFE9]/30 mt-4 sm:hidden">
        ← Swipe left/right to see all products →
      </p>
    </div>
  );
}