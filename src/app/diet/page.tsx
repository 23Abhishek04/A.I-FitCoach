"use client";

import { useState } from "react";
import {
  Apple,
  ArrowLeft,
  Bot,
  Check,
  Clock3,
  Flame,
  RotateCcw,
  Sparkles,
  Target,
  Utensils,
  Coffee,
  Sun,
  Moon,
} from "lucide-react";

type AIMeal = {
  name: string;
  time: string;
  calories: number;
  protein: number;
  foods: string[];
};

type DietPlan = {
  goal: string;
  dietType: string;
  dailyCalories: number;
  meals: AIMeal[];
  recommendation: string;
};

export default function DietPage() {
  const [goal, setGoal] = useState("Weight Loss");
  const [dietType, setDietType] = useState("Balanced");
  const [calories, setCalories] = useState("1800");

  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  const [completedMeals, setCompletedMeals] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================================
  // GENERATE DIET
  // ============================================================

  const generateDiet = async () => {
    setLoading(true);
    setError("");
    setCompletedMeals([]);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "diet",
          data: {
            goal,
            dietType,
            calories: Number(calories),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to generate diet plan"
        );
      }

      let parsed: DietPlan;

      try {
        parsed = JSON.parse(data.response);
      } catch {
        const cleaned = data.response
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        parsed = JSON.parse(cleaned);
      }

      setDietPlan(parsed);
    } catch (err) {
      console.error("Diet generation error:", err);

      setError(
        "Unable to generate your diet plan right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESET
  // ============================================================

  const resetDiet = () => {
    setDietPlan(null);
    setCompletedMeals([]);
    setError("");
  };

  // ============================================================
  // TOGGLE MEAL
  // ============================================================

  const toggleMeal = (index: number) => {
    setCompletedMeals((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

  // ============================================================
  // PROGRESS
  // ============================================================

  const totalMeals = dietPlan?.meals?.length ?? 0;

  const progress =
    totalMeals > 0
      ? Math.round((completedMeals.length / totalMeals) * 100)
      : 0;

  // ============================================================
  // ICON
  // ============================================================

  const getMealIcon = (index: number) => {
    if (index === 0) return <Coffee size={19} />;
    if (index === 1) return <Sun size={19} />;
    if (index === 2) return <Apple size={19} />;
    if (index === 3) return <Moon size={19} />;

    return <Utensils size={19} />;
  };

  return (
    <main className="min-h-screen bg-[#080D17] text-white">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-[#293750] bg-[#0B1220]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293750] bg-[#131E32] text-[#9AA7BB] transition hover:border-[#22AAFF] hover:text-white"
            >
              <ArrowLeft size={17} />
            </a>

            <div>
              <p className="text-xs text-[#6F8099]">
                AI Fitness Tools
              </p>

              <h1 className="text-xl font-bold sm:text-2xl">
                Diet Generator
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-[#16D66B]/10 px-3 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#16D66B]" />

            <span className="text-xs font-medium text-[#16D66B]">
              AI Connected
            </span>
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-10">
        {/* ===================================================
            INTRO
        ==================================================== */}

        <section className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#16D66B]/10 text-[#16D66B]">
              <Apple size={21} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#16D66B]">
                Personalized Nutrition
              </p>

              <h2 className="text-2xl font-bold">
                Create Your Diet Plan
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#9AA7BB]">
            Generate a personalized daily meal plan based on your
            fitness goal, preferred diet type and calorie target.
          </p>
        </section>

        {/* ===================================================
            GENERATOR
        ==================================================== */}

        <section className="mt-8 rounded-2xl border border-[#293750] bg-[#131E32] p-5 sm:p-7">
          <div className="grid gap-5 md:grid-cols-3">
            {/* GOAL */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#B9C5D6]">
                <Target
                  size={15}
                  className="text-[#22AAFF]"
                />

                Fitness Goal
              </label>

              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#293750] bg-[#0D1524] px-3 text-sm text-white outline-none focus:border-[#22AAFF]"
              >
                <option>Weight Loss</option>
                <option>Muscle Gain</option>
                <option>Maintain Weight</option>
                <option>General Fitness</option>
              </select>
            </div>

            {/* DIET TYPE */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#B9C5D6]">
                <Utensils
                  size={15}
                  className="text-[#16D66B]"
                />

                Diet Type
              </label>

              <select
                value={dietType}
                onChange={(e) => setDietType(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#293750] bg-[#0D1524] px-3 text-sm text-white outline-none focus:border-[#22AAFF]"
              >
                <option>Balanced</option>
                <option>Vegetarian</option>
                <option>High Protein</option>
                <option>Low Carb</option>
                <option>Vegan</option>
              </select>
            </div>

            {/* CALORIES */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#B9C5D6]">
                <Flame
                  size={15}
                  className="text-orange-400"
                />

                Daily Calories
              </label>

              <select
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#293750] bg-[#0D1524] px-3 text-sm text-white outline-none focus:border-[#22AAFF]"
              >
                <option value="1500">1500 kcal</option>
                <option value="1800">1800 kcal</option>
                <option value="2000">2000 kcal</option>
                <option value="2200">2200 kcal</option>
                <option value="2500">2500 kcal</option>
              </select>
            </div>
          </div>

          {/* BUTTONS */}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={generateDiet}
              disabled={loading}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#16D66B] text-sm font-semibold text-[#06130D] transition hover:bg-[#13C760] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#06130D]/30 border-t-[#06130D]" />

                  Generating Diet Plan...
                </>
              ) : (
                <>
                  <Sparkles size={17} />

                  Generate AI Diet Plan
                </>
              )}
            </button>

            {dietPlan && (
              <button
                onClick={resetDiet}
                disabled={loading}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#293750] bg-[#0D1524] px-5 text-sm text-[#9AA7BB] transition hover:text-white disabled:opacity-50"
              >
                <RotateCcw size={16} />

                Reset
              </button>
            )}
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-center text-xs text-red-400">
              {error}
            </div>
          )}
        </section>

        {/* ===================================================
            GENERATED PLAN
        ==================================================== */}

        {dietPlan && (
          <section className="mt-6">
            {/* SUMMARY */}

            <div className="grid gap-3 sm:grid-cols-3">
              <Summary
                icon={<Target size={18} />}
                title="Goal"
                value={dietPlan.goal}
              />

              <Summary
                icon={<Utensils size={18} />}
                title="Diet Type"
                value={dietPlan.dietType}
              />

              <Summary
                icon={<Flame size={18} />}
                title="Daily Target"
                value={`${dietPlan.dailyCalories} kcal`}
              />
            </div>

            {/* PROGRESS */}

            <div className="mt-5 rounded-2xl border border-[#293750] bg-[#131E32] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#6F8099]">
                    Daily Meal Progress
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {completedMeals.length} / {totalMeals} Meals
                  </p>
                </div>

                <span className="text-xl font-bold text-[#16D66B]">
                  {progress}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#293750]">
                <div
                  className="h-full rounded-full bg-[#16D66B] transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {/* MEALS */}

            <div className="mt-6">
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-[#16D66B]">
                  Today's Nutrition
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {dietPlan.dietType} {dietPlan.goal} Meal Plan
                </h2>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {dietPlan.meals?.map((meal, index) => {
                  const completed =
                    completedMeals.includes(index);

                  return (
                    <div
                      key={`${meal.name}-${index}`}
                      className={`rounded-2xl border p-5 transition ${
                        completed
                          ? "border-[#16D66B]/30 bg-[#16D66B]/5"
                          : "border-[#293750] bg-[#131E32]"
                      }`}
                    >
                      {/* TOP */}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                              completed
                                ? "bg-[#16D66B]/15 text-[#16D66B]"
                                : "bg-[#16D66B]/10 text-[#16D66B]"
                            }`}
                          >
                            {getMealIcon(index)}
                          </div>

                          <div>
                            <h3 className="font-semibold">
                              {meal.name}
                            </h3>

                            <div className="mt-1 flex items-center gap-2 text-[11px] text-[#6F8099]">
                              <Clock3 size={12} />

                              {meal.time}
                            </div>
                          </div>
                        </div>

                        {/* CHECK */}

                        <button
                          onClick={() => toggleMeal(index)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                            completed
                              ? "border-[#16D66B] bg-[#16D66B] text-[#080D17]"
                              : "border-[#293750] bg-[#0D1524] text-transparent hover:border-[#16D66B]"
                          }`}
                          aria-label={
                            completed
                              ? "Mark meal incomplete"
                              : "Mark meal complete"
                          }
                        >
                          <Check size={17} />
                        </button>
                      </div>

                      {/* NUTRITION */}

                      <div className="mt-5 flex gap-3">
                        <div className="rounded-lg bg-[#0D1524] px-3 py-2">
                          <p className="text-[9px] text-[#6F8099]">
                            Calories
                          </p>

                          <p className="mt-1 text-xs font-semibold text-orange-400">
                            {meal.calories} kcal
                          </p>
                        </div>

                        <div className="rounded-lg bg-[#0D1524] px-3 py-2">
                          <p className="text-[9px] text-[#6F8099]">
                            Protein
                          </p>

                          <p className="mt-1 text-xs font-semibold text-[#22AAFF]">
                            {meal.protein}g
                          </p>
                        </div>
                      </div>

                      {/* FOOD ITEMS */}

                      <div className="mt-5 space-y-2">
                        {meal.foods?.map(
                          (food, foodIndex) => (
                            <div
                              key={`${food}-${foodIndex}`}
                              className="flex items-center gap-2 text-xs text-[#B9C5D6]"
                            >
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#16D66B]" />

                              {food}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI COACH */}

            <div className="mt-6 rounded-2xl border border-[#293750] bg-[#131E32] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
                  <Bot size={21} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-[#22AAFF]">
                    AI FitCoach
                  </p>

                  <h3 className="mt-1 font-bold">
                    Nutrition Recommendation
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#9AA7BB]">
                    {dietPlan.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            EMPTY STATE
        ==================================================== */}

        {!dietPlan && !loading && (
          <section className="mt-6 rounded-2xl border border-dashed border-[#293750] bg-[#0D1524] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16D66B]/10 text-[#16D66B]">
              <Apple size={26} />
            </div>

            <h3 className="mt-5 font-bold">
              Your personalized meal plan is waiting
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#6F8099]">
              Choose your goal, diet type and calorie target,
              then let AI FitCoach generate your daily nutrition
              plan.
            </p>
          </section>
        )}

        {/* ===================================================
            LOADING STATE
        ==================================================== */}

        {loading && (
          <section className="mt-6 rounded-2xl border border-[#293750] bg-[#0D1524] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16D66B]/10 text-[#16D66B]">
              <Sparkles
                size={26}
                className="animate-pulse"
              />
            </div>

            <h3 className="mt-5 font-bold">
              Creating your diet plan...
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#6F8099]">
              AI FitCoach is preparing meals based on your goal,
              diet preference and calorie target.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function Summary({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#293750] bg-[#131E32] p-4">
      <div className="flex items-center gap-2 text-[#16D66B]">
        {icon}

        <span className="text-xs text-[#6F8099]">
          {title}
        </span>
      </div>

      <p className="mt-3 text-lg font-bold text-white">
        {value}
      </p>
    </div>
  );
}