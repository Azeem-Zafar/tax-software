export type ProductSupports = {
  salaryIncome: boolean;
  studentIncome: boolean;
  medicalExpenses: boolean;
  donations: boolean;
  employmentExpenses: boolean;
  investmentIncome: boolean;
  capitalGains: boolean;
  foreignIncome: boolean;
  rentalIncome: boolean;
  freelanceIncome: boolean;
  gigWorkIncome: boolean;
  businessExpenses: boolean;
  homeOfficeExpenses: boolean;
  vehicleExpenses: boolean;
  expertHelp: boolean;
  fullService: boolean;
  corporateFiling: boolean;
  nilCorporateReturn: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  currency: "CAD";
  description: string;
  bestFor: string[];
  supports: ProductSupports;
};

// ---- Wizard Answer Types ----

export type FilingType = "personal" | "self-employed" | "incorporated";

export type IncomeSource =
  | "salaryIncome"
  | "studentIncome"
  | "investmentIncome"
  | "capitalGains"
  | "rentalIncome"
  | "freelanceIncome"
  | "gigWorkIncome"
  | "businessRevenue"
  | "foreignIncome";

export type Deduction =
  | "medicalExpenses"
  | "donations"
  | "employmentExpenses"
  | "homeOfficeExpenses"
  | "vehicleExpenses"
  | "businessExpenses"
  | "noSpecialDeductions";

export type HelpPreference =
  | "fileMyself"
  | "expertHelp"
  | "expertFiles";

export type CompanyRevenue = "hasRevenue" | "noRevenue" | null;

export type WizardAnswers = {
  filingType: FilingType | null;
  incomeSources: IncomeSource[];
  deductions: Deduction[];
  helpPreference: HelpPreference | null;
  companyRevenue: CompanyRevenue;
};

// ---- Recommendation Output ----

export type RecommendationResult = {
  recommendedProductId: string;
  recommendedProductName: string;
  price: number;
  confidence: "low" | "medium" | "high";
  reasons: string[];
  matchedInputs: string[];
  optionalUpgrade?: {
    productId: string;
    productName: string;
    reason: string;
  };
  warnings?: string[];
  disclaimer: string;
};