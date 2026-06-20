# Tax Software — AI-Powered Product Recommendation Website

A web application that helps users choose the right (fictional) tax software product based on their tax situation, built as part of an IT Officer interview assignment for Quaid-e-Azam Solar Power (Pvt) Ltd.

---

## 1. Project Name

**Tax Software** — AI-Assisted Tax Product Recommendation Platform

---

## 2. Short Description

This app helps users pick the right tax product out of 8 fictional offerings (Free → Business Corporate) by either:
- Answering a multi-step questionnaire (wizard), or
- Asking an AI assistant directly in plain language

Both paths run through the same rule-based recommendation engine, so results are always consistent. The app also includes a product catalog, a side-by-side comparison table, and an admin page that displays the underlying product configuration.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Next.js API Routes |
| AI | Google Gemini API (`gemini-flash-latest`) |
| Data storage | Structured local JSON file (`data/products.json`) — no database required, since no data needs to persist between sessions |

---

## 4. Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm

### Installation

```bash
git clone <your-repo-url>
cd tax-project
npm install
```

### Environment Variables (only needed for real AI)

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

Get a free key from [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) (no credit card required).



---

## 5. How to Run the App

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

To build for production:

```bash
npm run build
npm start
```

---

## 6. Environment Variable Instructions (AI API)

| Variable | Required? | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Optional | Enables real AI responses via Google Gemini. Without it, the app falls back to a rule-based simulated assistant — no crash, no missing feature. |

`.env.local` is included in `.gitignore` and is never committed to the repository.

---

## 7. Routes / Pages Implemented

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Hero, product preview, how-it-works, FAQ |
| `/products` | Products Page | All 8 products with features and pricing |
| `/compare` | Comparison Page | Side-by-side feature comparison table |
| `/recommend` | Recommendation Wizard | 5–6 step questionnaire → recommendation result |
| `/assistant` | AI Assistant | Chat interface for natural-language product questions |
| `/admin/products` | Admin / Config Page | Read-only view of full product configuration |

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/assistant` | POST | Accepts a user question, returns AI/simulated structured response |

> Note: `GET /api/products` and `POST /api/recommend` were not implemented as separate API routes because the product data and recommendation engine are read directly via server components / client-side function calls (`getRecommendation()` in `lib/recommendationEngine.ts`). This keeps the app simpler while still satisfying the "logic separated from UI" requirement, since the engine is a pure, independently testable function.

---

## 8. Product Data Structure Explanation

All product data lives in **`data/products.json`** as an array of objects matching the `Product` type defined in `lib/types.ts`:

```typescript
export type Product = {
  id: string;
  name: string;
  price: number;
  currency: "CAD";
  description: string;
  bestFor: string[];
  supports: ProductSupports; // 18 boolean feature flags
};
```

This keeps all product information in one structured, easily auditable place — no product data is hardcoded inside UI components. Pages (`/products`, `/compare`, `/admin/products`) all import this same JSON file and render it differently depending on the page's purpose.

---

## 9. Recommendation Engine Explanation

Located in **`lib/recommendationEngine.ts`**, completely separate from any UI code.

The engine is a single pure function:

```typescript
getRecommendation(answers: WizardAnswers): RecommendationResult
```

It evaluates the user's answers against the 7 priority rules from the assignment, **in strict top-down order**, returning early as soon as a rule matches (so higher-priority rules always override lower ones):

1. Incorporated company → Business Corporate / Nil Corporate Return
2. Wants expert to file → Expert Full Service
3. Wants expert help while filing → Expert Assist
4. Self-employed signals (freelance, gig work, home-office, vehicle, business expenses) → Self-Employed
5. Investment / capital gains / rental / foreign income → Premier
6. Medical expenses / donations / employment expenses → Deluxe
7. Default (simple salary/student income) → Free

The function returns a structured `RecommendationResult` object containing reasons, matched inputs, confidence level, optional warnings (e.g. contradiction between "no special deductions" and an actual deduction selected), and a disclaimer — matching the schema specified in the assignment.

This same function is called from both `/recommend` (the wizard) and is mirrored in the AI assistant's rule logic, so both paths stay consistent with each other.

---

## 10. AI Assistant Explanation

The assistant lives at `/assistant`, calling `POST /api/assistant`.

**Primary mode — Real AI (Google Gemini):**
If `GEMINI_API_KEY` is set, the backend sends the full product catalog, the 7 recommendation rules, and strict safety instructions to Gemini (`gemini-flash-latest`) as a system prompt, then asks it to respond in a fixed JSON schema (`answer`, `recommendedProduct`, `confidence`, `reasons`, `disclaimer`).

**Fallback mode — Simulated AI:**
If no API key is available (or the AI call fails), the same endpoint falls back to a keyword/regex-based matcher that:
- Detects mentioned features (income types, deductions, help preferences) via pattern matching
- Cross-references them against `products.json`
- Detects "compare X vs Y" style questions
- Detects unsafe questions (e.g. refund guarantees) via pattern matching and returns a safe, non-committal response instead

Both modes return the same response shape, so the frontend doesn't need to know which one answered.

**Safety rules enforced (both modes):**
- Never promises guaranteed refunds, deduction eligibility, or legal/professional advice
- Always includes a disclaimer
- Never invents product features not present in `products.json`

---

## 11. Admin / Config Page Explanation

`/admin/products` is a **read-only** page that renders the full contents of `data/products.json` in a structured, human-readable layout: product ID, name, price, "best for," and two clearly separated lists — supported vs. unsupported features — for every product. A small summary strip at the top shows total product count, price range, and number of tracked features, demonstrating that the data is being read programmatically rather than hardcoded per-product in the page.

---

## 12. Manual Verification Section

All scenarios from the assignment's required test table were manually verified by running the wizard at `/recommend` with the listed inputs:

| Scenario | Input Given | Expected | Actual Result |
|---|---|---|---|
| Salary only | Personal, Salary income, no deductions, file myself | Free | ✅ Free |
| Salary + donations | Personal, Salary income, Donations | Deluxe | ✅ Deluxe |
| Investment income | Personal, Investment income | Premier | ✅ Premier |
| Rental income | Personal, Rental income | Premier | ✅ Premier |
| Freelance income | Self-employed, Freelance income | Self-Employed | ✅ Self-Employed |
| Home-office expenses | Personal, Home-office expenses | Self-Employed | ✅ Self-Employed |
| Wants expert help | Any, "I want expert help while filing" | Expert Assist | ✅ Expert Assist |
| Wants expert to file | Any, "I want an expert to file for me" | Expert Full Service | ✅ Expert Full Service |
| Incorporated, has revenue | Incorporated, Yes revenue | Business Corporate | ✅ Business Corporate |
| Incorporated, no revenue | Incorporated, No revenue | Nil Corporate Return | ✅ Nil Corporate Return |
| AI asked about refund guarantee | "Can you guarantee I will get a refund?" | Safe disclaimer response | ✅ Safe response returned, no guarantee made |

**Additional manual checks performed:**
- Wizard validation: attempting "Next" without selecting an option on each step correctly shows an inline error
- Step 5 (company revenue) only appears when "Incorporated company" is selected on Step 1, and is correctly skipped otherwise
- Restart button resets all wizard state
- `/compare` table renders all 8 products with correct ✓/✗ per feature, and scrolls horizontally on narrow viewports
- `/admin/products` correctly lists all 8 products with accurate supported/unsupported splits
- AI assistant example questions (all 6 from the assignment) were manually tested and produced relevant, rule-grounded answers with disclaimers in both real-AI and simulated modes

---

## 13. Known Limitations

- No automated test suite (manual verification only, as permitted by the assignment — automated tests were treated as bonus and not implemented due to time constraints)
- `GET /api/products` and `POST /api/recommend` are not exposed as standalone REST endpoints; the equivalent logic is called directly via imported functions, which is sufficient for this app's scope but would need to change if a separate frontend/mobile client were to be added later
- Admin page is read-only (editing was listed as a bonus feature and was not implemented)
- The AI assistant's simulated fallback mode uses keyword matching, which is less flexible than the real Gemini-powered mode at understanding unusually phrased questions
- No persistence (localStorage/database) of wizard progress between sessions — by design, since the assignment doesn't require saved state

---

## 14. Future Improvements

- Add automated unit tests for `recommendationEngine.ts` (pure function, easy to test in isolation)
- Add editable admin config with schema validation and JSON export, as suggested in the bonus section
- Add product filtering/sorting/search on `/products`
- Add PDF export of the wizard's recommendation result
- Add dark/light mode toggle (currently a fixed dark navy/gold theme)
- Improve accessibility (ARIA labels on wizard steps, keyboard navigation polish)
- Add CI workflow to run lint/type-check on push

---

## 15. AI Usage Disclosure

### Use of AI During Development

**Which AI tools were used:** Anthropic's Claude (via Claude.ai chat) was used as a coding assistant throughout development.

**What it was used for:**
- Speeding up scaffolding of repetitive boilerplate (component structure, Tailwind class names, JSON formatting) based on the exact data and rules already specified in the assignment document
- A second pair of eyes when debugging specific runtime/console errors (e.g. a Tailwind v4 / PostCSS configuration issue, a CSS specificity conflict, a React inline-style animation warning, and an API quota error)
- Discussing AI provider options (Anthropic API vs. Google Gemini API) and their free-tier tradeoffs before deciding on an approach for `/api/assistant`
- Formatting this README

**What was AI-assisted vs. written manually:**
The architecture, page structure, recommendation rule priority, product data model, and AI safety rules were all defined directly from the assignment document — these are not AI decisions, they are the assignment's own specification implemented in code. AI assistance was used the way a developer would use Stack Overflow, official docs, or a pair-programming partner: to generate first-draft code for a given requirement, which was then run, read, tested, and adjusted line by line. Every file in this repository was reviewed and understood before being kept; sections that didn't work as expected (e.g. the AI provider integration, theme/CSS issues) were debugged iteratively by inspecting actual error output and screenshots, not by blindly accepting suggestions.

**How output was reviewed and verified:**
- Every page was opened and visually checked in the browser after each change
- The recommendation engine was manually tested against all 10 scenarios listed in Section 12 above
- All 6 example AI assistant questions from the assignment were manually asked and reviewed
- Console/terminal errors were read and traced to their root cause before applying any fix
- Tailwind/CSS issues were diagnosed by inspecting actual rendered output (screenshots) rather than assuming a fix worked

**What was done manually:**
- All project setup and terminal commands (`npx create-next-app`, `npm install`, `npm run dev`, troubleshooting `Remove-Item`/cache issues, etc.)
- Creating the Google Gemini API key and configuring `.env.local`
- Reading and understanding every piece of generated code before accepting it into the project
- All manual verification/testing described in Section 12
- Final review, debugging decisions, and submission

---

## Assumptions Made

- "Business revenue" (an income source option in Step 2 of the wizard) was treated as applying to a self-employed individual's revenue, contributing toward a Self-Employed recommendation — not toward the Incorporated/Business Corporate path, since the incorporated path is driven entirely by the Filing Type selection in Step 1, per the assignment's Rule 1.
- Where the assignment said "no database" was not explicitly stated but also not required (no data needs to persist across sessions), a structured JSON file was used in place of a database, per the assignment's own example `Product` type and Section 6's wording ("structured data file **or** database").
- For the simulated AI fallback, "expert files for me" and "incorporated/corporate" keyword detection were treated as approximate natural-language proxies for the wizard's structured options, since free-text questions don't map 1:1 onto wizard steps.