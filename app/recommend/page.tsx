"use client";

import { useState } from "react";
import { getRecommendation } from "@/lib/recommendationEngine";
import {
  WizardAnswers,
  FilingType,
  IncomeSource,
  Deduction,
  HelpPreference,
  RecommendationResult,
} from "@/lib/types";

const initialAnswers: WizardAnswers = {
  filingType: null,
  incomeSources: [],
  deductions: [],
  helpPreference: null,
  companyRevenue: null,
};

export default function RecommendPage() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<WizardAnswers>(initialAnswers);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RecommendationResult | null>(null);

  const isIncorporated = answers.filingType === "incorporated";
  const totalSteps = isIncorporated ? 5 : 4;

  function toggleIncome(source: IncomeSource) {
    setAnswers((prev) => ({
      ...prev,
      incomeSources: prev.incomeSources.includes(source)
        ? prev.incomeSources.filter((s) => s !== source)
        : [...prev.incomeSources, source],
    }));
  }

  function toggleDeduction(d: Deduction) {
    setAnswers((prev) => ({
      ...prev,
      deductions: prev.deductions.includes(d)
        ? prev.deductions.filter((x) => x !== d)
        : [...prev.deductions, d],
    }));
  }

  function validateStep(): boolean {
    setError("");
    if (step === 1 && !answers.filingType) {
      setError("Please select a filing type.");
      return false;
    }
    if (step === 2 && answers.incomeSources.length === 0) {
      setError("Please select at least one income source.");
      return false;
    }
    if (step === 4 && !answers.helpPreference) {
      setError("Please select a help preference.");
      return false;
    }
    if (step === 5 && isIncorporated && !answers.companyRevenue) {
      setError("Please tell us if the company had revenue.");
      return false;
    }
    return true;
  }

  function handleNext() {
    if (!validateStep()) return;
    if (step === 4 && !isIncorporated) {
      setResult(getRecommendation(answers));
      setStep(6);
      return;
    }
    if (step === 5) {
      setResult(getRecommendation(answers));
      setStep(6);
      return;
    }
    setStep((s) => s + 1);
  }

  function handleBack() {
    setError("");
    if (step === 6 && !isIncorporated) {
      setStep(4);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  }

  function handleRestart() {
    setAnswers(initialAnswers);
    setResult(null);
    setError("");
    setStep(1);
  }

  return (
    <div className="min-h-[calc(100vh-64px)] max-w-2xl mx-auto px-6 sm:px-10 py-16">
      <div className="mb-10">
        <p className="text-xs tracking-[0.25em] uppercase text-[#C9A24B] mb-3">
          Recommendation Wizard
        </p>
        <h1
          className="text-3xl sm:text-4xl font-bold"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Find Your Product
        </h1>
      </div>

      {/* Progress Indicator */}
      {step < 6 && (
        <div className="mb-10">
          <div className="flex justify-between text-xs text-[#F2EFE9]/40 mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-[#F2EFE9]/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#C9A24B] h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div key={step} className="animate-step-in">
        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">What are you filing for?</h2>
            <div className="space-y-3">
              {[
                { value: "personal", label: "Personal return" },
                { value: "self-employed", label: "Freelancer / self-employed" },
                { value: "incorporated", label: "Incorporated company" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, filingType: opt.value as FilingType }))
                  }
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                    answers.filingType === opt.value
                      ? "border-[#C9A24B] bg-[#C9A24B]/10 text-[#F2EFE9]"
                      : "border-[#F2EFE9]/15 hover:border-[#F2EFE9]/30 text-[#F2EFE9]/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Which income sources apply to you?</h2>
            <div className="space-y-3">
              {[
                { value: "salaryIncome", label: "Salary income" },
                { value: "studentIncome", label: "Student income" },
                { value: "investmentIncome", label: "Investment income" },
                { value: "capitalGains", label: "Capital gains" },
                { value: "rentalIncome", label: "Rental income" },
                { value: "freelanceIncome", label: "Freelance income" },
                { value: "gigWorkIncome", label: "Gig-work income" },
                { value: "businessRevenue", label: "Business revenue" },
                { value: "foreignIncome", label: "Foreign income" },
              ].map((opt) => {
                const checked = answers.incomeSources.includes(opt.value as IncomeSource);
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? "border-[#C9A24B] bg-[#C9A24B]/10"
                        : "border-[#F2EFE9]/15 hover:border-[#F2EFE9]/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleIncome(opt.value as IncomeSource)}
                      className="accent-[#C9A24B] w-4 h-4"
                    />
                    <span className={checked ? "text-[#F2EFE9]" : "text-[#F2EFE9]/75"}>
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">
              Which deductions or expenses apply to you?
            </h2>
            <div className="space-y-3">
              {[
                { value: "medicalExpenses", label: "Medical expenses" },
                { value: "donations", label: "Donations" },
                { value: "employmentExpenses", label: "Employment expenses" },
                { value: "homeOfficeExpenses", label: "Home-office expenses" },
                { value: "vehicleExpenses", label: "Vehicle expenses" },
                { value: "businessExpenses", label: "Business expenses" },
                { value: "noSpecialDeductions", label: "No special deductions" },
              ].map((opt) => {
                const checked = answers.deductions.includes(opt.value as Deduction);
                return (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border cursor-pointer transition-all ${
                      checked
                        ? "border-[#C9A24B] bg-[#C9A24B]/10"
                        : "border-[#F2EFE9]/15 hover:border-[#F2EFE9]/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDeduction(opt.value as Deduction)}
                      className="accent-[#C9A24B] w-4 h-4"
                    />
                    <span className={checked ? "text-[#F2EFE9]" : "text-[#F2EFE9]/75"}>
                      {opt.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">How much help do you want?</h2>
            <div className="space-y-3">
              {[
                { value: "fileMyself", label: "I want to file myself" },
                { value: "expertHelp", label: "I want expert help while filing" },
                { value: "expertFiles", label: "I want an expert to file for me" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, helpPreference: opt.value as HelpPreference }))
                  }
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                    answers.helpPreference === opt.value
                      ? "border-[#C9A24B] bg-[#C9A24B]/10 text-[#F2EFE9]"
                      : "border-[#F2EFE9]/15 hover:border-[#F2EFE9]/30 text-[#F2EFE9]/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && isIncorporated && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Did the company have revenue?</h2>
            <div className="space-y-3">
              {[
                { value: "hasRevenue", label: "Yes, company had revenue" },
                { value: "noRevenue", label: "No, company had no revenue" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, companyRevenue: opt.value as any }))
                  }
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                    answers.companyRevenue === opt.value
                      ? "border-[#C9A24B] bg-[#C9A24B]/10 text-[#F2EFE9]"
                      : "border-[#F2EFE9]/15 hover:border-[#F2EFE9]/30 text-[#F2EFE9]/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: Result */}
        {step === 6 && result && (
          <div>
            <div className="rounded-2xl border border-[#C9A24B]/30 bg-[#C9A24B]/[0.06] p-7">
              <p className="text-xs uppercase tracking-widest text-[#C9A24B]/80 font-semibold mb-2">
                Recommended Product
              </p>
              <h2 className="text-3xl font-bold mb-1" style={{ fontFamily: "Georgia, serif" }}>
                {result.recommendedProductName}
              </h2>
              <p className="text-lg text-[#F2EFE9]/70 mb-6">CAD ${result.price}</p>

              <p className="text-xs font-semibold text-[#F2EFE9]/40 uppercase tracking-wider mb-2">
                Why this product
              </p>
              <ul className="text-sm text-[#F2EFE9]/75 space-y-1.5 mb-5">
                {result.reasons.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#C9A24B] mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>

              {result.warnings && result.warnings.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm text-yellow-200 mb-5">
                  {result.warnings.map((w, i) => (
                    <p key={i}>⚠️ {w}</p>
                  ))}
                </div>
              )}

              <p className="text-xs text-[#F2EFE9]/35 italic pt-4 border-t border-[#F2EFE9]/10">
                {result.disclaimer}
              </p>
            </div>

            <button
              onClick={handleRestart}
              className="mt-6 w-full px-5 py-3.5 rounded-full bg-[#F2EFE9]/10 hover:bg-[#F2EFE9]/15 text-[#F2EFE9] font-medium transition-colors"
            >
              Restart Questionnaire
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {step < 6 && (
        <div className="flex justify-between mt-10">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-3 rounded-full border border-[#F2EFE9]/15 text-[#F2EFE9]/70 disabled:opacity-30 hover:border-[#F2EFE9]/30 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="px-7 py-3 rounded-full bg-[#C9A24B] text-[#0B0E14] font-semibold hover:scale-[1.03] transition-transform"
          >
            {step === 4 && !isIncorporated ? "See Result" : step === 5 ? "See Result" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}