"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Dumbbell,
  Apple,
  Droplets,
  Moon,
  Brain,
  HeartPulse,
  Check,
  RefreshCw,
} from "lucide-react";

type Tip = {
  category: string;
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
};

const tips: Tip[] = [
  {
    category: "Nutrition",
    title: "Prioritize Protein With Every Meal",
    description:
      "Consuming enough high-quality protein throughout the day can support muscle maintenance and help you stay satisfied between meals.",
    action:
      "Try including eggs, chicken, fish, paneer, Greek yogurt, beans, or other protein-rich foods in your meals.",
    icon: <Apple size={22} />,
  },
  {
    category: "Workout",
    title: "Focus on Proper Form",
    description:
      "Good exercise technique helps you perform movements efficiently and reduces unnecessary stress on your joints and muscles.",
    action:
      "Slow down your repetitions and focus on controlled movement instead of simply trying to lift more weight.",
    icon: <Dumbbell size={22} />,
  },
  {
    category: "Hydration",
    title: "Stay Hydrated Throughout the Day",
    description:
      "Your body needs adequate fluids to support normal physical performance and everyday body functions.",
    action:
      "Keep a water bottle nearby and drink regularly instead of waiting until you become very thirsty.",
    icon: <Droplets size={22} />,
  },
  {
    category: "Recovery",
    title: "Give Your Body Time to Recover",
    description:
      "Recovery is an important part of a consistent training routine. Rest allows your body to adapt to training stress.",
    action:
      "Aim for quality sleep and include rest or lighter activity when your body needs it.",
    icon: <Moon size={22} />,
  },
  {
    category: "Mindset",
    title: "Consistency Beats Perfection",
    description:
      "Progress usually comes from repeatedly following sustainable habits rather than trying to make every day perfect.",
    action:
      "If you miss a workout or meal target, simply return to your routine at the next opportunity.",
    icon: <Brain size={22} />,
  },
  {
    category: "Wellness",
    title: "Add More Daily Movement",
    description:
      "Small amounts of movement throughout the day can complement your structured workouts.",
    action:
      "Take short walking breaks, use stairs when practical, or add a short walk after a meal.",
    icon: <HeartPulse size={22} />,
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  Nutrition: <Apple size={16} />,
  Workout: <Dumbbell size={16} />,
  Hydration: <Droplets size={16} />,
  Recovery: <Moon size={16} />,
  Mindset: <Brain size={16} />,
  Wellness: <HeartPulse size={16} />,
};

export default function DailyTipPage() {
  const [currentTip, setCurrentTip] = useState(0);
  const [completed, setCompleted] = useState(false);

  const tip = tips[currentTip];

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
    setCompleted(false);
  };

  return (
    <main className="min-h-screen bg-[#080D17] text-[#F5F7FA]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#293750] bg-[#080D17]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293750] bg-[#131E32] text-[#9AA7BB] transition hover:border-[#22AAFF] hover:text-white"
              aria-label="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-base font-bold sm:text-lg">
                Daily Fitness Tip
              </h1>

              <p className="text-xs text-[#6F8099]">
                Small habits. Better results.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-lg border border-[#293750] bg-[#131E32] px-3 py-2 text-xs text-[#22AAFF] sm:flex">
            <Sparkles size={14} />
            AI Powered
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:py-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-[#293750] bg-[#131E32] p-5 sm:p-8">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#22AAFF]/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[#16D66B]/5 blur-3xl" />

          <div className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22AAFF]/10 text-[#22AAFF]">
                <Sparkles size={27} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22AAFF]">
                Today's Tip
              </p>

              <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
                Build habits that support your fitness goals
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#9AA7BB]">
                Your daily AI FitCoach tip gives you one practical idea
                you can apply to your fitness routine today.
              </p>
            </div>
          </div>
        </section>

        {/* Tip Card */}
        <section className="mt-5 rounded-3xl border border-[#293750] bg-[#131E32] p-5 sm:p-7">
          {/* Category */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[#22AAFF]/20 bg-[#22AAFF]/10 px-3 py-1.5 text-xs font-medium text-[#22AAFF]">
              {categoryIcons[tip.category]}
              {tip.category}
            </div>

            <span className="text-xs text-[#52627A]">
              Tip {currentTip + 1} of {tips.length}
            </span>
          </div>

          {/* Main tip */}
          <div className="mt-7 grid gap-6 md:grid-cols-[auto_1fr]">
            <div className="hidden h-16 w-16 items-center justify-center rounded-2xl bg-[#0D1524] text-[#22AAFF] md:flex">
              {tip.icon}
            </div>

            <div>
              <h3 className="text-xl font-bold sm:text-2xl">
                {tip.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#9AA7BB] sm:text-base">
                {tip.description}
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="mt-6 rounded-2xl border border-[#293750] bg-[#0D1524] p-4 sm:p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#16D66B]/10 text-[#16D66B]">
                <Check size={17} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#16D66B]">
                  Try This Today
                </p>

                <p className="mt-2 text-sm leading-6 text-[#B6C0CF]">
                  {tip.action}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setCompleted(!completed)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                completed
                  ? "bg-[#16D66B] text-[#06100A]"
                  : "border border-[#293750] bg-[#0D1524] text-[#D7DEEA] hover:border-[#16D66B] hover:text-[#16D66B]"
              }`}
            >
              <Check size={17} />

              {completed ? "Completed Today" : "Mark as Completed"}
            </button>

            <button
              onClick={nextTip}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#22AAFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1698E8]"
            >
              <RefreshCw size={17} />
              Next Tip
            </button>
          </div>
        </section>

        {/* Categories */}
        <section className="mt-5">
          <div className="mb-3">
            <h2 className="font-semibold">Explore Fitness Topics</h2>
            <p className="mt-1 text-xs text-[#6F8099]">
              Tips across different areas of your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tips.map((item, index) => {
              const active = index === currentTip;

              return (
                <button
                  key={item.category}
                  onClick={() => {
                    setCurrentTip(index);
                    setCompleted(false);
                  }}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-[#22AAFF]/50 bg-[#22AAFF]/10"
                      : "border-[#293750] bg-[#131E32] hover:border-[#22AAFF]/30"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      active
                        ? "bg-[#22AAFF]/15 text-[#22AAFF]"
                        : "bg-[#0D1524] text-[#6F8099]"
                    }`}
                  >
                    {categoryIcons[item.category]}
                  </div>

                  <p className="mt-3 text-sm font-medium">
                    {item.category}
                  </p>

                  <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-[#6F8099]">
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Daily reminder */}
        <section className="mt-5 rounded-2xl border border-[#293750] bg-[#131E32] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#22AAFF]" />
                <h2 className="font-semibold">Your Daily Reminder</h2>
              </div>

              <p className="mt-2 text-xs leading-5 text-[#6F8099] sm:text-sm">
                You don't need to change everything at once. Focus on one
                useful habit and stay consistent with it.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="rounded-xl border border-[#293750] bg-[#0D1524] px-4 py-2.5 text-xs font-medium text-[#9AA7BB] transition hover:border-[#22AAFF] hover:text-[#22AAFF]"
            >
              Back to Dashboard
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}