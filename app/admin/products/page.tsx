import productsData from "@/data/products.json";
import { Product } from "@/lib/types";

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

function splitFeatures(product: Product) {
  const supported: string[] = [];
  const unsupported: string[] = [];
  Object.entries(product.supports).forEach(([key, value]) => {
    const label = FEATURE_LABELS[key] || key;
    if (value) supported.push(label);
    else unsupported.push(label);
  });
  return { supported, unsupported };
}

export default function AdminProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <p className="text-xs tracking-[0.25em] uppercase text-[#C9A24B] mb-4">
          Admin · Read Only
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Product configuration.
        </h1>
        <p className="text-[#F2EFE9]/60 text-lg">
          The raw rules driving every recommendation, straight from{" "}
          <code className="text-[#C9A24B] text-base">data/products.json</code>.
        </p>
      </div>

      {/* Summary strip */}
      <div className="flex flex-wrap gap-4 mb-12">
        <div className="px-5 py-3 rounded-xl border border-[#F2EFE9]/10 bg-white/[0.02]">
          <p className="text-xs text-[#F2EFE9]/40 uppercase tracking-wider">Total Products</p>
          <p className="text-2xl font-bold text-[#C9A24B]">{products.length}</p>
        </div>
        <div className="px-5 py-3 rounded-xl border border-[#F2EFE9]/10 bg-white/[0.02]">
          <p className="text-xs text-[#F2EFE9]/40 uppercase tracking-wider">Price Range</p>
          <p className="text-2xl font-bold text-[#C9A24B]">
            ${Math.min(...products.map((p) => p.price))}–${Math.max(...products.map((p) => p.price))}
          </p>
        </div>
        <div className="px-5 py-3 rounded-xl border border-[#F2EFE9]/10 bg-white/[0.02]">
          <p className="text-xs text-[#F2EFE9]/40 uppercase tracking-wider">Tracked Features</p>
          <p className="text-2xl font-bold text-[#C9A24B]">
            {Object.keys(products[0].supports).length}
          </p>
        </div>
      </div>

      {/* Product config cards */}
      <div className="space-y-5">
        {products.map((product, i) => {
          const { supported, unsupported } = splitFeatures(product);
          return (
            <div
              key={product.id}
              className="rounded-2xl border border-[#F2EFE9]/10 bg-white/[0.02] p-6 sm:p-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5 pb-5 border-b border-[#F2EFE9]/10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-[#F2EFE9]/30 bg-white/[0.04] px-2 py-0.5 rounded">
                      {product.id}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: "Georgia, serif" }}>
                    {product.name}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#C9A24B]">
                    ${product.price} <span className="text-xs font-normal text-[#F2EFE9]/40">CAD</span>
                  </p>
                </div>
              </div>

              <p className="text-[11px] font-semibold text-[#F2EFE9]/35 uppercase tracking-wider mb-2">
                Best For
              </p>
              <ul className="text-sm text-[#F2EFE9]/75 mb-6 space-y-1">
                {product.bestFor.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] font-semibold text-[#C9A24B]/70 uppercase tracking-wider mb-2">
                    ✓ Supported ({supported.length})
                  </p>
                  <ul className="text-sm text-[#F2EFE9]/70 space-y-1.5">
                    {supported.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-[#C9A24B]">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#F2EFE9]/30 uppercase tracking-wider mb-2">
                    ✗ Not Supported ({unsupported.length})
                  </p>
                  <ul className="text-sm text-[#F2EFE9]/35 space-y-1.5">
                    {unsupported.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span>✗</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}