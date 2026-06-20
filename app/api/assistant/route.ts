import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import productsData from "@/data/products.json";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are a product-selection assistant for a fictional tax software company.

Your ONLY job is to help users pick the right product based on the data below.

PRODUCT DATA:
${JSON.stringify(productsData, null, 2)}

RECOMMENDATION RULES (priority order, higher overrides lower):
1. Incorporated company with revenue -> Business Corporate. Incorporated with no revenue -> Nil Corporate Return.
2. User wants an expert to file for them -> Expert Full Service.
3. User wants expert help while filing -> Expert Assist.
4. Freelance/gig-work/business/home-office/vehicle expenses -> Self-Employed.
5. Investment income/capital gains/rental income/foreign income -> Premier.
6. Medical expenses/donations/employment expenses -> Deluxe.
7. Simple salary/student income only, no special situations -> Free.

STRICT SAFETY RULES:
- You must NEVER provide real tax, legal, financial, or accounting advice.
- You must NEVER say things like "you are guaranteed a refund", "you definitely qualify for this deduction", "the tax authority will accept your return", "this is legal advice", "this is professional tax advice", or "you must use this product".
- Instead use phrases like: "Based on the provided product rules...", "This product appears suitable...", "Please consult a qualified tax professional for tax advice.", "This is general product guidance only."
- NEVER invent product features that are not in the product data above.
- If asked something outside product selection (e.g. actual tax calculations, guarantees, legal questions), politely decline and redirect to product guidance only.

RESPONSE FORMAT:
Respond with ONLY valid JSON (no markdown, no code fences, no extra text) in exactly this shape:
{
  "answer": "string - your natural language answer",
  "recommendedProduct": "string or null - product name if applicable",
  "confidence": "low" | "medium" | "high",
  "reasons": ["array of strings explaining the recommendation"],
  "disclaimer": "This is general product guidance only and is not tax, legal, or financial advice."
}`;

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "A question is required." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(question);
    const rawText = result.response.text();

    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        answer: rawText || "Sorry, I could not generate a response.",
        recommendedProduct: null,
        confidence: "low",
        reasons: [],
        disclaimer:
          "This is general product guidance only and is not tax, legal, or financial advice.",
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Assistant API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}