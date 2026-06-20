import { WizardAnswers, RecommendationResult } from "./types";

const DISCLAIMER =
  "This recommendation provides general product guidance only and is not tax, legal, or financial advice.";

export function getRecommendation(answers: WizardAnswers): RecommendationResult {
  const { filingType, incomeSources, deductions, helpPreference, companyRevenue } = answers;

  const reasons: string[] = [];
  const matchedInputs: string[] = [];
  const warnings: string[] = [];

  // ---------- RULE 1: INCORPORATED COMPANY (highest priority) ----------
  if (filingType === "incorporated") {
    if (companyRevenue === "noRevenue") {
      reasons.push("You selected an incorporated company with no revenue.");
      reasons.push("Nil Corporate Return is designed for companies with no revenue.");
      matchedInputs.push("filingType:incorporated", "companyRevenue:noRevenue");

      return {
        recommendedProductId: "nil-corporate-return",
        recommendedProductName: "Nil Corporate Return",
        price: 175,
        confidence: "high",
        reasons,
        matchedInputs,
        disclaimer: DISCLAIMER,
      };
    }

    // hasRevenue or not specified -> Business Corporate
    reasons.push("You selected an incorporated company.");
    reasons.push("Business Corporate supports corporate tax filing and business revenue.");
    matchedInputs.push("filingType:incorporated");
    if (companyRevenue === "hasRevenue") matchedInputs.push("companyRevenue:hasRevenue");

    return {
      recommendedProductId: "business-corporate",
      recommendedProductName: "Business Corporate",
      price: 400,
      confidence: "high",
      reasons,
      matchedInputs,
      disclaimer: DISCLAIMER,
    };
  }

  // ---------- RULE 2: EXPERT FULL SERVICE ----------
  if (helpPreference === "expertFiles") {
    reasons.push("You selected that you want an expert to file your return for you.");
    reasons.push("Expert Full Service includes document upload, expert preparation, and expert filing.");
    matchedInputs.push("helpPreference:expertFiles");

    return {
      recommendedProductId: "expert-full-service",
      recommendedProductName: "Expert Full Service",
      price: 250,
      confidence: "high",
      reasons,
      matchedInputs,
      disclaimer: DISCLAIMER,
    };
  }

  // ---------- RULE 3: EXPERT ASSIST ----------
  if (helpPreference === "expertHelp") {
    reasons.push("You selected that you want expert help while filing.");
    reasons.push("Expert Assist includes expert chat, video calls, and review before filing.");
    matchedInputs.push("helpPreference:expertHelp");

    return {
      recommendedProductId: "expert-assist",
      recommendedProductName: "Expert Assist",
      price: 120,
      confidence: "high",
      reasons,
      matchedInputs,
      disclaimer: DISCLAIMER,
    };
  }

  // ---------- RULE 4: SELF-EMPLOYED ----------
  const selfEmployedTriggers: { key: string; present: boolean; label: string }[] = [
    { key: "filingType", present: filingType === "self-employed", label: "You selected freelancer / self-employed filing." },
    { key: "freelanceIncome", present: incomeSources.includes("freelanceIncome"), label: "You selected freelance income." },
    { key: "gigWorkIncome", present: incomeSources.includes("gigWorkIncome"), label: "You selected gig-work income." },
    { key: "businessRevenue", present: incomeSources.includes("businessRevenue"), label: "You selected business revenue." },
    { key: "businessExpenses", present: deductions.includes("businessExpenses"), label: "You selected business expenses." },
    { key: "homeOfficeExpenses", present: deductions.includes("homeOfficeExpenses"), label: "You selected home-office expenses." },
    { key: "vehicleExpenses", present: deductions.includes("vehicleExpenses"), label: "You selected vehicle expenses." },
  ];

  const matchedSelfEmployed = selfEmployedTriggers.filter((t) => t.present);

  if (matchedSelfEmployed.length > 0) {
    matchedSelfEmployed.forEach((t) => {
      reasons.push(t.label);
      matchedInputs.push(t.key);
    });
    reasons.push("Self-Employed supports freelance income and business-related expenses.");

    return {
      recommendedProductId: "self-employed",
      recommendedProductName: "Self-Employed",
      price: 70,
      confidence: "high",
      reasons,
      matchedInputs,
      disclaimer: DISCLAIMER,
    };
  }

  // ---------- RULE 5: PREMIER ----------
  const premierTriggers: { key: string; present: boolean; label: string }[] = [
    { key: "investmentIncome", present: incomeSources.includes("investmentIncome"), label: "You selected investment income." },
    { key: "capitalGains", present: incomeSources.includes("capitalGains"), label: "You selected capital gains." },
    { key: "rentalIncome", present: incomeSources.includes("rentalIncome"), label: "You selected rental income." },
    { key: "foreignIncome", present: incomeSources.includes("foreignIncome"), label: "You selected foreign income." },
  ];

  const matchedPremier = premierTriggers.filter((t) => t.present);

  if (matchedPremier.length > 0) {
    matchedPremier.forEach((t) => {
      reasons.push(t.label);
      matchedInputs.push(t.key);
    });
    reasons.push("Premier supports investment income, capital gains, rental income, and foreign income.");

    return {
      recommendedProductId: "premier",
      recommendedProductName: "Premier",
      price: 50,
      confidence: "high",
      reasons,
      matchedInputs,
      disclaimer: DISCLAIMER,
    };
  }

  // ---------- RULE 6: DELUXE ----------
  const deluxeTriggers: { key: string; present: boolean; label: string }[] = [
    { key: "medicalExpenses", present: deductions.includes("medicalExpenses"), label: "You selected medical expenses." },
    { key: "donations", present: deductions.includes("donations"), label: "You selected donations." },
    { key: "employmentExpenses", present: deductions.includes("employmentExpenses"), label: "You selected employment expenses." },
  ];

  const matchedDeluxe = deluxeTriggers.filter((t) => t.present);

  if (matchedDeluxe.length > 0) {
    matchedDeluxe.forEach((t) => {
      reasons.push(t.label);
      matchedInputs.push(t.key);
    });
    reasons.push("Deluxe supports medical expenses, donations, and employment expenses.");

    // contradiction check: user picked "no special deductions" AND a deduction
    if (deductions.includes("noSpecialDeductions")) {
      warnings.push(
        "You selected 'No special deductions' along with specific deductions. We used the specific deductions for this recommendation."
      );
    }

    return {
      recommendedProductId: "deluxe",
      recommendedProductName: "Deluxe",
      price: 30,
      confidence: "medium",
      reasons,
      matchedInputs,
      warnings: warnings.length ? warnings : undefined,
      disclaimer: DISCLAIMER,
    };
  }

  // ---------- RULE 7: FREE (default / simple case) ----------
  reasons.push("You have a simple personal tax situation with salary and/or student income.");
  reasons.push("No special deductions, investments, rental, or freelance income were selected.");
  matchedInputs.push("filingType:personal");

  if (incomeSources.includes("salaryIncome")) matchedInputs.push("salaryIncome");
  if (incomeSources.includes("studentIncome")) matchedInputs.push("studentIncome");

  return {
    recommendedProductId: "free",
    recommendedProductName: "Free",
    price: 0,
    confidence: "high",
    reasons,
    matchedInputs,
    disclaimer: DISCLAIMER,
  };
}