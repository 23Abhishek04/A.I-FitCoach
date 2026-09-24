"use client";

import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  Bot,
  Check,
  Clock3,
  Dumbbell,
  Flame,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";

type Exercise = {
  name: string;
  sets: number;
  reps: string;
  rest: string;
};

type WorkoutPlan = {
  goal: string;
  duration: number;
  estimatedCalories: number;
  exercises: Exercise[];
  recommendation: string;
};

export default function WorkoutPage() {
  const [goal, setGoal] = useState("Weight Loss");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("30");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);

  const [completed, setCompleted] = useState<number[]>([]);

  const generateWorkout = async () => {
    setLoading(true);
    setError("");
    setCompleted([]);
    setWorkoutPlan(null);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "workout",
          data: {
            goal,
            level,
            duration: Number(duration),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate workout");
      }

      if (!data.response) {
        throw new Error("AI returned an empty response");
      }

      let parsed: WorkoutPlan;

      try {
        parsed = JSON.parse(data.response);
      } catch {
        const cleaned = data.response
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        parsed = JSON.parse(cleaned);
      }

      if (
        !parsed.goal ||
        typeof parsed.duration !== "number" ||
        typeof parsed.estimatedCalories !== "number" ||
        !Array.isArray(parsed.exercises) ||
        parsed.exercises.length === 0 ||
        !parsed.recommendation
      ) {
        throw new Error("Invalid workout data received from AI");
      }

      setWorkoutPlan(parsed);
    } catch (err) {
      console.error("Workout generation error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate your workout right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetWorkout = () => {
    setWorkoutPlan(null);
    setCompleted([]);
    setError("");
  };

  const toggleExercise = (index: number) => {
    setCompleted((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

  const completion =
    workoutPlan && workoutPlan.exercises.length > 0
      ? Math.round(
          (completed.length / workoutPlan.exercises.length) * 100
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#080D17] text-white">
      {/* HEADER */}
      <header className="border-b border-[#293750] bg-[#0B1220]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293750] bg-[#131E32] text-[#9AA7BB] transition hover:text-white"
            >
              <ArrowLeft size={17} />
            </a>

            <div>
              <p className="text-xs text-[#6F8099]">
                AI Fitness Tools
              </p>

              <h1 className="text-xl font-bold sm:text-2xl">
                Workout Generator
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

      {/* CONTENT */}
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-10">
        {/* INTRO */}
        <section className="max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
              <Dumbbell size={21} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[#22AAFF]">
                Personalized Training
              </p>

              <h2 className="text-2xl font-bold">
                Create Your Workout
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-[#9AA7BB]">
            Choose your fitness preferences and generate a workout
            plan designed around your current goal and fitness level.
          </p>
        </section>

        {/* GENERATOR */}
        <section className="mt-8 rounded-2xl border border-[#293750] bg-[#131E32] p-5 sm:p-7">
          <div className="grid gap-5 md:grid-cols-3">
            {/* GOAL */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#B9C5D6]">
                <Target size={15} className="text-[#22AAFF]" />
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

            {/* LEVEL */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#B9C5D6]">
                <Activity size={15} className="text-[#22AAFF]" />
                Fitness Level
              </label>

              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#293750] bg-[#0D1524] px-3 text-sm text-white outline-none focus:border-[#22AAFF]"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            {/* DURATION */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#B9C5D6]">
                <Clock3 size={15} className="text-[#22AAFF]" />
                Workout Duration
              </label>

              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#293750] bg-[#0D1524] px-3 text-sm text-white outline-none focus:border-[#22AAFF]"
              >
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="90">90 Minutes</option>
              </select>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={generateWorkout}
              disabled={loading}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#22AAFF] text-sm font-semibold transition hover:bg-[#159BEA] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Sparkles size={17} />

              {loading ? "Generating Workout..." : "Generate AI Workout"}
            </button>

            {workoutPlan && (
              <button
                onClick={resetWorkout}
                disabled={loading}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#293750] bg-[#0D1524] px-5 text-sm text-[#9AA7BB] transition hover:text-white"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="mt-5 rounded-xl border border-[#293750] bg-[#0D1524] p-4 text-center">
              <div className="mx-auto mb-2 h-5 w-5 animate-spin rounded-full border-2 border-[#293750] border-t-[#22AAFF]" />

              <p className="text-sm text-[#9AA7BB]">
                AI FitCoach is creating your personalized workout...
              </p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}
        </section>

        {/* WORKOUT */}
        {workoutPlan && (
          <section className="mt-6">
            {/* SUMMARY */}
            <div className="grid gap-3 sm:grid-cols-3">
              <Summary
                icon={<Target size={18} />}
                title="Goal"
                value={workoutPlan.goal}
              />

              <Summary
                icon={<Timer size={18} />}
                title="Duration"
                value={`${workoutPlan.duration} min`}
              />

              <Summary
                icon={<Flame size={18} />}
                title="Estimated Calories"
                value={`${workoutPlan.estimatedCalories} kcal`}
              />
            </div>

            {/* PROGRESS */}
            <div className="mt-5 rounded-2xl border border-[#293750] bg-[#131E32] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#6F8099]">
                    Workout Progress
                  </p>

                  <p className="mt-1 text-lg font-bold">
                    {completed.length} / {workoutPlan.exercises.length}{" "}
                    Exercises
                  </p>
                </div>

                <span className="text-xl font-bold text-[#22AAFF]">
                  {completion}%
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#293750]">
                <div
                  className="h-full rounded-full bg-[#22AAFF] transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            {/* EXERCISES */}
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#22AAFF]">
                    Today&apos;s Session
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {level} {workoutPlan.goal} Workout
                  </h2>
                </div>

                <span className="hidden text-xs text-[#6F8099] sm:block">
                  {workoutPlan.duration} minutes
                </span>
              </div>

              <div className="space-y-3">
                {workoutPlan.exercises.map((exercise, index) => {
                  const isComplete = completed.includes(index);

                  return (
                    <div
                      key={`${exercise.name}-${index}`}
                      className={`rounded-2xl border p-4 transition sm:p-5 ${
                        isComplete
                          ? "border-[#16D66B]/30 bg-[#16D66B]/5"
                          : "border-[#293750] bg-[#131E32]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* CHECK */}
                        <button
                          onClick={() => toggleExercise(index)}
                          aria-label={
                            isComplete
                              ? `Mark ${exercise.name} incomplete`
                              : `Mark ${exercise.name} complete`
                          }
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                            isComplete
                              ? "border-[#16D66B] bg-[#16D66B] text-[#080D17]"
                              : "border-[#293750] bg-[#0D1524] text-transparent hover:border-[#22AAFF]"
                          }`}
                        >
                          <Check size={18} />
                        </button>

                        {/* NAME */}
                        <div className="min-w-0 flex-1">
                          <h3
                            className={`font-semibold ${
                              isComplete
                                ? "text-[#9AA7BB] line-through"
                                : "text-white"
                            }`}
                          >
                            {exercise.name}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-[#6F8099]">
                            <span>{exercise.sets} Sets</span>

                            <span>{exercise.reps} Reps</span>

                            <span>{exercise.rest} Rest</span>
                          </div>
                        </div>

                        {/* NUMBER */}
                        <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-[#22AAFF]/10 text-xs font-bold text-[#22AAFF] sm:flex">
                          {String(index + 1).padStart(2, "0")}
                        </div>
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
                    Workout Recommendation
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#9AA7BB]">
                    {workoutPlan.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* EMPTY STATE */}
        {!workoutPlan && !loading && (
          <section className="mt-6 rounded-2xl border border-dashed border-[#293750] bg-[#0D1524] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#22AAFF]/10 text-[#22AAFF]">
              <Dumbbell size={26} />
            </div>

            <h3 className="mt-5 font-bold">
              Your personalized workout is waiting
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#6F8099]">
              Select your goal, fitness level and workout duration,
              then let AI FitCoach generate your session.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

/* ============================================================
   SUMMARY
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
      <div className="flex items-center gap-2 text-[#22AAFF]">
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