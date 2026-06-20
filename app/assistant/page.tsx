"use client";

import { useState, useRef, useEffect } from "react";

type AssistantResponse = {
  answer: string;
  recommendedProduct: string | null;
  confidence: "low" | "medium" | "high";
  reasons: string[];
  disclaimer: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  data?: AssistantResponse;
};

const EXAMPLE_QUESTIONS = [
  "I have salary income and donations. Which product should I use?",
  "I am a freelancer with home-office expenses. Can I use Free?",
  "I own an incorporated company with no revenue. What should I choose?",
  "What is the difference between Premier and Self-Employed?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(question: string) {
    if (!question.trim()) return;

    setError("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.answer, data }]);
    } catch {
      setError("Failed to reach the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] max-w-2xl mx-auto px-6 sm:px-10 py-16 flex flex-col">
      <div className="mb-10">
        <p className="text-xs tracking-[0.25em] uppercase text-[#C9A24B] mb-3">
          AI Assistant
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: "Georgia, serif" }}>
          Ask away.
        </h1>
        <p className="text-[#F2EFE9]/55">
          Describe your situation in plain language — I'll match it against product rules.
        </p>
      </div>

      {/* Example Questions */}
      {messages.length === 0 && (
        <div className="mb-8 animate-fade-up">
          <p className="text-xs font-semibold text-[#F2EFE9]/35 uppercase tracking-wider mb-3">
            Try asking
          </p>
          <div className="flex flex-col gap-2.5">
            {EXAMPLE_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="text-left text-sm px-4 py-3 rounded-xl border border-[#F2EFE9]/15 text-[#F2EFE9]/75 hover:border-[#C9A24B]/40 hover:bg-[#C9A24B]/5 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 space-y-4 mb-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex animate-fade-up ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#C9A24B] text-[#0B0E14] font-medium"
                  : "bg-white/[0.04] border border-[#F2EFE9]/10 text-[#F2EFE9]/90"
              }`}
            >
              <p>{msg.content}</p>

              {msg.data && (
                <div className="mt-3 pt-3 border-t border-[#0B0E14]/10 text-xs space-y-1.5">
                  {msg.data.recommendedProduct && (
                    <p className="font-semibold text-[#0B0E14]/70">
                      Suggested: {msg.data.recommendedProduct}
                    </p>
                  )}
                  {msg.data.reasons?.length > 0 && (
                    <ul className="space-y-1">
                      {msg.data.reasons.map((r, idx) => (
                        <li key={idx} className="flex gap-1.5">
                          <span>•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="italic opacity-60 pt-1">{msg.data.disclaimer}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-up">
            <div className="bg-white/[0.04] border border-[#F2EFE9]/10 rounded-2xl px-5 py-3.5 text-sm text-[#F2EFE9]/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-2.5 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-2 sticky bottom-6"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about products..."
          className="flex-1 px-5 py-3.5 rounded-full border border-[#F2EFE9]/15 bg-white/[0.03] text-[#F2EFE9] placeholder:text-[#F2EFE9]/30 text-sm focus:outline-none focus:border-[#C9A24B]/50 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 rounded-full bg-[#C9A24B] text-[#0B0E14] font-semibold disabled:opacity-40 hover:scale-[1.03] transition-transform"
        >
          Send
        </button>
      </form>
    </div>
  );
}