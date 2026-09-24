"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  Send,
  Trash2,
  User,
  Sparkles,
  MessageCircle,
} from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const quickPrompts = [
  "What workout should I do today?",
  "Give me a healthy diet plan",
  "How can I lose weight?",
  "How much water should I drink?",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hi Abhishek! 👋 I'm your AI FitCoach. I can help you with workouts, nutrition, weight management, hydration, and general fitness questions. What would you like help with today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text?: string) => {
    const message = (text ?? input).trim();

    if (!message || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "chat",
          data: {
            message,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to get response from AI"
        );
      }

      if (!data.response) {
        throw new Error("AI returned an empty response");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: data.response,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            error instanceof Error
              ? `Sorry, I couldn't process that request. ${error.message}`
              : "Sorry, I couldn't process that request. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text: "Chat cleared. 👋 What fitness goal would you like to work on?",
      },
    ]);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-[#080D17] text-[#F5F7FA]">
      {/* HEADER */}
      <header className="sticky top-0 z-20 border-b border-[#293750] bg-[#080D17]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                (window.location.href = "/dashboard")
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293750] bg-[#131E32] text-[#9AA7BB] transition hover:border-[#22AAFF] hover:text-white"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-base font-bold sm:text-lg">
                Fitness Chatbot
              </h1>

              <div className="flex items-center gap-2 text-xs text-[#16D66B]">
                <span
                  className={`h-2 w-2 rounded-full ${
                    loading
                      ? "animate-pulse bg-[#22AAFF]"
                      : "bg-[#16D66B]"
                  }`}
                />

                {loading ? "AI Thinking..." : "Gemini Connected"}
              </div>
            </div>
          </div>

          <button
            onClick={clearChat}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-[#293750] bg-[#131E32] px-3 py-2 text-xs font-medium text-[#9AA7BB] transition hover:border-red-400/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">
              Clear Chat
            </span>
          </button>
        </div>
      </header>

      {/* CHAT */}
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl flex-col px-3 py-4 sm:px-6 sm:py-6">
        {/* CHAT HEADING */}
        <div className="mb-5 rounded-2xl border border-[#293750] bg-[#131E32] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="font-semibold">
                AI Fitness Assistant
              </h2>

              <p className="mt-1 text-xs text-[#9AA7BB] sm:text-sm">
                Ask me anything about your fitness journey.
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  isUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22AAFF]/10 text-[#22AAFF]">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[70%] ${
                    isUser
                      ? "rounded-br-md bg-[#22AAFF] text-white"
                      : "rounded-bl-md border border-[#293750] bg-[#131E32] text-[#D7DEEA]"
                  }`}
                >
                  {message.text}
                </div>

                {isUser && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A263A] text-[#9AA7BB]">
                    <User size={17} />
                  </div>
                )}
              </div>
            );
          })}

          {/* AI LOADING */}
          {loading && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#22AAFF]/10 text-[#22AAFF]">
                <Bot size={18} />
              </div>

              <div className="rounded-2xl rounded-bl-md border border-[#293750] bg-[#131E32] px-5 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#6F8099]" />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-[#6F8099]"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 animate-bounce rounded-full bg-[#6F8099]"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* QUICK PROMPTS */}
        <div className="mb-3">
          <div className="mb-2 flex items-center gap-2 text-xs text-[#6F8099]">
            <MessageCircle size={14} />
            Quick questions
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                className="shrink-0 rounded-full border border-[#293750] bg-[#0D1524] px-3 py-2 text-xs text-[#9AA7BB] transition hover:border-[#22AAFF] hover:text-[#22AAFF] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT */}
        <div className="rounded-2xl border border-[#293750] bg-[#131E32] p-2">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder={
                loading
                  ? "AI is thinking..."
                  : "Ask your fitness question..."
              }
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-[#6F8099] disabled:opacity-50"
            />

            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#22AAFF] text-white transition hover:bg-[#1698E8] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-[10px] text-[#52627A] sm:text-xs">
          AI FitCoach can make mistakes. Use professional medical
          advice for health-related concerns.
        </p>
      </section>
    </main>
  );
}