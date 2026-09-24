"use client";

import { useEffect, useMemo, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Apple,
  BarChart3,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Lightbulb,
  LogOut,
  Menu,
  MessageCircle,
  Save,
  Settings,
  User,
  UserCircle,
  X,
  Droplets,
  Scale,
  Flame,
  CheckCircle2,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", icon: BarChart3, href: "/dashboard" },
  { label: "My Profile", icon: UserCircle, href: "/profile" },
  { label: "BMI Calculator", icon: Calculator, href: "/bmi-calculator" },
  { label: "Workout Generator", icon: Dumbbell, href: "/workout" },
  { label: "Diet Generator", icon: Apple, href: "/diet" },
  { label: "Fitness Chatbot", icon: MessageCircle, href: "/chatbot" },
  { label: "Progress Tracking", icon: Activity, href: "/progress" },
  { label: "Daily Fitness Tip", icon: Lightbulb, href: "/daily-tip" },
];

type ProgressEntry = {
  _id?: string;
  date: string;
  weight: number | null;
  water: number;
  workout: "Completed" | "Rest Day" | "Skipped";
  calories: number | null;
  note: string;
};

type UserData = {
  name?: string;
  email?: string;
  age?: number | null;
  gender?: string;
  height?: number | null;
  weight?: number | null;
  targetWeight?: number | null;
  fitnessGoal?: string;
  activity?: string;
  fitnessLevel?: string;
  dietType?: string;
  dailyCalories?: number;
};

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [userData, setUserData] =
    useState<UserData | null>(null);

  const [entries, setEntries] =
    useState<ProgressEntry[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const [weight, setWeight] = useState("");
  const [water, setWater] = useState("0");

  const [workout, setWorkout] =
    useState<ProgressEntry["workout"]>(
      "Completed"
    );

  const [calories, setCalories] = useState("");
  const [note, setNote] = useState("");

  /* ============================================================
     REDIRECT IF NOT AUTHENTICATED
  ============================================================ */

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  /* ============================================================
     LOAD USER + PROGRESS
  ============================================================ */

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !session?.user?.email
    ) {
      return;
    }

    // Store the narrowed value before entering async code.
    const email = session.user.email;

    const loadData = async () => {
      try {
        setLoading(true);
        setMessage("");

        const [userResponse, progressResponse] =
          await Promise.all([
            fetch(
              `/api/user?email=${encodeURIComponent(
                email
              )}`,
              {
                cache: "no-store",
              }
            ),

            fetch(
              `/api/progress?email=${encodeURIComponent(
                email
              )}`,
              {
                cache: "no-store",
              }
            ),
          ]);

        const userResult =
          await userResponse.json();

        const progressResult =
          await progressResponse.json();

        /* USER */

        if (
          userResponse.ok &&
          userResult.success
        ) {
          setUserData(userResult.user);

          if (
            userResult.user.weight !== null &&
            userResult.user.weight !== undefined
          ) {
            setWeight(
              String(userResult.user.weight)
            );
          }
        }

        /* PROGRESS */

        if (
          progressResponse.ok &&
          progressResult.success
        ) {
          const loadedEntries =
            progressResult.entries || [];

          setEntries(loadedEntries);

          const todayEntry =
            loadedEntries.find(
              (entry: ProgressEntry) =>
                entry.date === today
            );

          if (todayEntry) {
            setWeight(
              todayEntry.weight !== null
                ? String(todayEntry.weight)
                : ""
            );

            setWater(
              String(todayEntry.water ?? 0)
            );

            setWorkout(
              todayEntry.workout ||
                "Completed"
            );

            setCalories(
              todayEntry.calories !== null &&
                todayEntry.calories !== undefined
                ? String(todayEntry.calories)
                : ""
            );

            setNote(
              todayEntry.note || ""
            );
          }
        }
      } catch (error) {
        console.error(
          "Progress load error:",
          error
        );

        setMessage(
          "Unable to load progress data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [
    status,
    session?.user?.email,
    today,
  ]);

  /* ============================================================
     SAVE PROGRESS
  ============================================================ */

  const saveProgress = async () => {
    if (
      !session?.user?.email
    ) {
      return;
    }

    // Narrow email before async operations.
    const email = session.user.email;

    const numericWeight =
      weight.trim() === ""
        ? null
        : Number(weight);

    const numericWater =
      Number(water);

    const numericCalories =
      calories.trim() === ""
        ? null
        : Number(calories);

    /* VALIDATE WEIGHT */

    if (
      numericWeight !== null &&
      (!Number.isFinite(
        numericWeight
      ) ||
        numericWeight <= 0)
    ) {
      setMessage(
        "Please enter a valid weight."
      );
      return;
    }

    /* VALIDATE WATER */

    if (
      !Number.isFinite(
        numericWater
      ) ||
      numericWater < 0
    ) {
      setMessage(
        "Please enter valid water intake."
      );
      return;
    }

    /* VALIDATE CALORIES */

    if (
      numericCalories !== null &&
      (!Number.isFinite(
        numericCalories
      ) ||
        numericCalories < 0)
    ) {
      setMessage(
        "Please enter valid calories."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      /* SAVE PROGRESS */

      const response = await fetch(
        "/api/progress",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            date: today,
            weight: numericWeight,
            water: numericWater,
            workout,
            calories:
              numericCalories,
            note: note.trim(),
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setMessage(
          data.error ||
            "Failed to save progress."
        );

        return;
      }

      setEntries(
        data.entries || []
      );

      setMessage(
        "Progress saved successfully."
      );

      /* ========================================================
         SYNC WEIGHT WITH USER PROFILE
      ======================================================== */

      if (
        numericWeight !== null
      ) {
        await fetch(
          "/api/user",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name:
                userData?.name ||
                session.user?.name ||
                "User",

              email,

              weight:
                numericWeight,
            }),
          }
        );

        setUserData(
          (previous) => ({
            ...previous,
            weight:
              numericWeight,
          })
        );
      }
    } catch (error) {
      console.error(
        "Progress save error:",
        error
      );

      setMessage(
        "Something went wrong while saving progress."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     CALCULATIONS
  ============================================================ */

  const currentWeight =
    entries.length > 0 &&
    entries[0].weight !== null
      ? entries[0].weight
      : userData?.weight ?? null;

  const targetWeight =
    userData?.targetWeight ?? null;

  const weightChange = useMemo(() => {
    const weights = entries
      .map(
        (entry) => entry.weight
      )
      .filter(
        (
          value
        ): value is number =>
          value !== null
      );

    if (weights.length < 2) {
      return null;
    }

    return Number(
      (
        weights[0] -
        weights[weights.length - 1]
      ).toFixed(1)
    );
  }, [entries]);

  const maxWeight = Math.max(
    targetWeight || 0,

    ...entries.map(
      (entry) =>
        entry.weight || 0
    ),

    currentWeight || 0,

    1
  );

  /* ============================================================
     LOADING
  ============================================================ */

  if (
    status === "loading" ||
    loading
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080D17] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#293750] border-t-[#22AAFF]" />

          <p className="text-sm text-[#91A0B7]">
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#080D17] text-white">
      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ====================================================== */}

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() =>
            setMobileSidebarOpen(false)
          }
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          border-r border-[#293750] bg-[#1D293D]
          transition-all duration-300
          ${
            sidebarCollapsed
              ? "w-[76px]"
              : "w-[174px]"
          }
          ${
            mobileSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* SIDEBAR HEADER */}

        <div
          className={`flex h-[82px] shrink-0 items-center border-b border-[#293750] ${
            sidebarCollapsed
              ? "justify-center"
              : "justify-between px-5"
          }`}
        >
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <span className="text-xl">
                🏋️
              </span>

              <span className="text-[15px] font-bold">
                AI Fit
                <span className="text-[#22AAFF]">
                  Coach
                </span>
              </span>
            </div>
          )}

          {/* Desktop collapse */}

          <button
            type="button"
            onClick={() => {
              setSidebarCollapsed(
                (value) => !value
              );

              setMobileSidebarOpen(
                false
              );
            }}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-[#9AA7BB] transition hover:bg-[#293750] hover:text-white lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight
                size={16}
              />
            ) : (
              <ChevronLeft
                size={16}
              />
            )}
          </button>

          {/* Mobile close */}

          <button
            type="button"
            onClick={() =>
              setMobileSidebarOpen(
                false
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9AA7BB] hover:bg-[#293750] hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* SIDEBAR CONTENT */}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {!sidebarCollapsed && (
            <>
              <p className="mb-5 px-2 text-[8px] leading-3 text-[#91A0B7]">
                Generative AI Based
                Personal Fitness
                Assistant
              </p>

              <div className="mb-4 rounded-lg border border-[#3A4A62] bg-[#182438] p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#22AAFF]/10 text-[#22AAFF]">
                    <User size={13} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[9px] font-semibold">
                      {userData?.name ||
                        session.user?.name ||
                        "User"}
                    </p>

                    <p className="text-[7px] text-[#22AAFF]">
                      Goal:{" "}
                      {userData?.fitnessGoal ||
                        "General Fitness"}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-[7px] text-[#91A0B7]">
                  Weight:{" "}
                  {userData?.weight
                    ? `${userData.weight} kg`
                    : "Not set"}{" "}
                  • Height:{" "}
                  {userData?.height
                    ? `${userData.height} cm`
                    : "Not set"}
                </p>
              </div>
            </>
          )}

          {/* NAVIGATION */}

          <nav className="space-y-0.5">
            {navigation.map(
              (item) => {
                const Icon =
                  item.icon;

                const active =
                  pathname ===
                  item.href;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setMobileSidebarOpen(
                        false
                      );

                      router.push(
                        item.href
                      );
                    }}
                    title={
                      sidebarCollapsed
                        ? item.label
                        : undefined
                    }
                    className={`
                      group flex w-full items-center rounded-md transition
                      ${
                        sidebarCollapsed
                          ? "justify-center px-2"
                          : "gap-2 px-2"
                      }
                      ${
                        active
                          ? "bg-[#253650] text-white"
                          : "text-[#B9C5D6] hover:bg-[#253650] hover:text-white"
                      }
                    `}
                    style={{
                      height: "28px",
                    }}
                  >
                    <Icon
                      size={12}
                      className={
                        active
                          ? "text-[#22AAFF]"
                          : "text-[#9AA7BB]"
                      }
                    />

                    {!sidebarCollapsed && (
                      <span className="text-[9px]">
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              }
            )}
          </nav>
        </div>

        {/* SIDEBAR FOOTER */}

        <div className="shrink-0 border-t border-[#293750] p-3">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/settings"
              )
            }
            className={`
              flex h-9 w-full items-center rounded-md
              border border-[#3A4A62] bg-[#182438]
              text-[#B9C5D6] transition hover:text-white
              ${
                sidebarCollapsed
                  ? "justify-center"
                  : "gap-2 px-3"
              }
            `}
          >
            <Settings size={13} />

            {!sidebarCollapsed && (
              <span className="text-[9px]">
                Settings
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
            className={`
              mt-3 flex h-8 w-full items-center rounded-md
              border border-[#3A4A62] text-[#B9C5D6]
              transition hover:bg-[#253650] hover:text-white
              ${
                sidebarCollapsed
                  ? "justify-center"
                  : "justify-center gap-2"
              }
            `}
          >
            <LogOut size={12} />

            {!sidebarCollapsed && (
              <span className="text-[9px]">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className={`
          min-h-screen transition-all duration-300
          ${
            sidebarCollapsed
              ? "lg:pl-[76px]"
              : "lg:pl-[174px]"
          }
        `}
      >
        {/* MOBILE HEADER */}

        <header className="sticky top-0 z-30 border-b border-[#293750] bg-[#080D17]/95 backdrop-blur lg:hidden">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              type="button"
              onClick={() =>
                setMobileSidebarOpen(
                  true
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293750] bg-[#131E32]"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-lg">
                🏋️
              </span>

              <span className="text-sm font-bold">
                AI Fit
                <span className="text-[#22AAFF]">
                  Coach
                </span>
              </span>
            </div>

            <div className="h-2 w-2 rounded-full bg-[#16D66B]" />
          </div>
        </header>

        {/* DESKTOP HEADER */}

        <div className="hidden border-b border-[#293750] lg:block">
          <div className="flex h-[82px] items-center justify-between px-6 xl:px-8">
            <div>
              <p className="text-[8px] text-[#6F8099]">
                Fitness
              </p>

              <h1 className="text-[18px] font-bold">
                Progress Tracking
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-[#16D66B]/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#16D66B]" />

                <span className="text-[9px] font-semibold text-[#16D66B]">
                  Tracking Active
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
                className="flex h-7 min-w-[120px] items-center justify-center gap-2 rounded-md border border-[#3A4A62] bg-[#0E1625] text-[9px] hover:bg-[#182438]"
              >
                <LogOut size={10} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* PAGE */}

        <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-7 xl:px-8">
          {/* PAGE TITLE */}

          <div className="mb-7">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#22AAFF]">
              Progress
            </p>

            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              Track your fitness
              journey
            </h1>

            <p className="mt-2 text-xs text-[#91A0B7]">
              Log your weight,
              hydration and workout
              activity and keep your
              progress connected to your
              dashboard.
            </p>
          </div>

          {/* MESSAGE */}

          {message && (
            <div
              className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
                message.includes(
                  "successfully"
                )
                  ? "border-[#16D66B]/30 bg-[#16D66B]/10 text-[#16D66B]"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {message}
            </div>
          )}

          {/* STAT CARDS */}

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={
                <Scale size={17} />
              }
              title="CURRENT WEIGHT"
              value={
                currentWeight !==
                null
                  ? `${currentWeight} kg`
                  : "--"
              }
              description={
                targetWeight
                  ? `Target: ${targetWeight} kg`
                  : "Set target in Profile"
              }
            />

            <StatCard
              icon={
                <Droplets size={17} />
              }
              title="TODAY'S WATER"
              value={`${water || 0} L`}
              description="Daily hydration"
            />

            <StatCard
              icon={
                <Flame size={17} />
              }
              title="WORKOUT"
              value={workout}
              description="Today's session"
            />

            <StatCard
              icon={
                <Activity size={17} />
              }
              title="WEIGHT CHANGE"
              value={
                weightChange === null
                  ? "--"
                  : `${
                      weightChange > 0
                        ? "+"
                        : ""
                    }${weightChange} kg`
              }
              description="First logged vs latest"
              green={
                weightChange !==
                null
              }
            />
          </section>

          {/* INPUT + HISTORY */}

          <section className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
            {/* LOG PROGRESS */}

            <div className="rounded-xl border border-[#293750] bg-[#111C30] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Log Today&apos;s
                    Progress
                  </h2>

                  <p className="mt-1 text-[10px] text-[#91A0B7]">
                    {today}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22AAFF]/10 text-[#22AAFF]">
                  <Activity
                    size={17}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Current Weight (kg)"
                  value={weight}
                  onChange={setWeight}
                  placeholder="e.g. 70"
                  type="number"
                  step="0.1"
                />

                <Field
                  label="Water Intake (litres)"
                  value={water}
                  onChange={setWater}
                  placeholder="e.g. 2.5"
                  type="number"
                  step="0.1"
                />

                <Field
                  label="Calories Consumed"
                  value={calories}
                  onChange={setCalories}
                  placeholder="e.g. 2000"
                  type="number"
                />

                <div>
                  <label className="mb-2 block text-xs font-medium text-white">
                    Workout Status
                  </label>

                  <select
                    value={workout}
                    onChange={(event) =>
                      setWorkout(
                        event.target
                          .value as ProgressEntry["workout"]
                      )
                    }
                    className="h-11 w-full rounded-lg border border-[#293750] bg-[#0D1524] px-3 text-sm text-white outline-none focus:border-[#22AAFF]"
                  >
                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Rest Day">
                      Rest Day
                    </option>

                    <option value="Skipped">
                      Skipped
                    </option>
                  </select>
                </div>
              </div>

              {/* NOTES */}

              <div className="mt-4">
                <label className="mb-2 block text-xs font-medium text-white">
                  Notes
                </label>

                <textarea
                  value={note}
                  onChange={(event) =>
                    setNote(
                      event.target.value
                    )
                  }
                  placeholder="How did you feel today?"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-[#293750] bg-[#0D1524] px-3 py-3 text-sm text-white outline-none placeholder:text-[#6F8099] focus:border-[#22AAFF]"
                />
              </div>

              {/* SAVE */}

              <button
                type="button"
                onClick={saveProgress}
                disabled={saving}
                className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#22AAFF] text-sm font-semibold text-[#080D17] transition hover:bg-[#40B8FF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />

                {saving
                  ? "Saving Progress..."
                  : "Save Today's Progress"}
              </button>
            </div>

            {/* WEIGHT HISTORY */}

            <div className="rounded-xl border border-[#293750] bg-[#111C30] p-5">
              <div className="mb-5 flex items-center gap-2">
                <span className="text-xl">
                  📈
                </span>

                <div>
                  <h2 className="text-lg font-bold">
                    Weight Progress
                  </h2>

                  <p className="text-[10px] text-[#91A0B7]">
                    Your latest logged
                    entries
                  </p>
                </div>
              </div>

              {entries.length ===
              0 ? (
                <div className="flex min-h-[220px] items-center justify-center rounded-lg bg-[#0D1524] px-5 text-center">
                  <div>
                    <Scale
                      className="mx-auto mb-3 text-[#22AAFF]"
                      size={28}
                    />

                    <p className="text-sm text-[#91A0B7]">
                      No progress
                      entries yet.
                    </p>

                    <p className="mt-1 text-[10px] text-[#6F8099]">
                      Save today&apos;s
                      weight to start
                      your chart.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {entries
                    .slice(0, 7)
                    .map((entry) => {
                      const percentage =
                        entry.weight !==
                        null
                          ? Math.max(
                              8,
                              Math.min(
                                100,
                                (entry.weight /
                                  maxWeight) *
                                  100
                              )
                            )
                          : 8;

                      return (
                        <div
                          key={`${entry.date}-${entry._id || "entry"}`}
                          className="rounded-lg bg-[#0D1524] p-3"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[10px] text-[#91A0B7]">
                              {entry.date}
                            </span>

                            <span className="text-xs font-bold text-white">
                              {entry.weight !==
                              null
                                ? `${entry.weight} kg`
                                : "--"}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-[#1A263A]">
                            <div
                              className="h-full rounded-full bg-[#22AAFF] transition-all"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          <div className="mt-2 flex items-center justify-between text-[9px]">
                            <span className="text-[#6F8099]">
                              💧{" "}
                              {
                                entry.water
                              }{" "}
                              L
                            </span>

                            <span
                              className={
                                entry.workout ===
                                "Completed"
                                  ? "text-[#16D66B]"
                                  : "text-[#91A0B7]"
                              }
                            >
                              🏋️{" "}
                              {
                                entry.workout
                              }
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </section>

          {/* SUMMARY */}

          <section className="mt-5 rounded-xl border border-[#293750] bg-[#111C30] p-5">
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2
                size={18}
                className="text-[#16D66B]"
              />

              <h2 className="text-lg font-bold">
                Progress Summary
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Summary
                label="Goal"
                value={
                  userData?.fitnessGoal ||
                  "General Fitness"
                }
              />

              <Summary
                label="Target Weight"
                value={
                  targetWeight
                    ? `${targetWeight} kg`
                    : "Not set"
                }
              />

              <Summary
                label="Fitness Level"
                value={
                  userData?.fitnessLevel ||
                  "Beginner"
                }
              />

              <Summary
                label="Activity"
                value={
                  userData?.activity ||
                  "Moderately Active"
                }
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  step,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder: string;
  type?: string;
  step?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-white">
        {label}
      </label>

      <input
        type={type}
        step={step}
        min={
          type === "number"
            ? "0"
            : undefined
        }
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-[#293750] bg-[#0D1524] px-3 text-sm text-white outline-none placeholder:text-[#6F8099] focus:border-[#22AAFF]"
      />
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  title,
  value,
  description,
  green = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  green?: boolean;
}) {
  return (
    <div className="rounded-lg border border-[#293750] bg-[#111C30] p-4">
      <div className="flex items-center gap-2 text-[#22AAFF]">
        {icon}

        <p className="text-[8px] font-medium tracking-wider text-[#91A0B7]">
          {title}
        </p>
      </div>

      <p
        className={`mt-3 text-lg font-bold ${
          green
            ? "text-[#16D66B]"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-[9px] text-[#22AAFF]">
        {description}
      </p>
    </div>
  );
}

/* ============================================================
   SUMMARY
============================================================ */

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-[#0D1524] p-4">
      <p className="text-[9px] uppercase tracking-wider text-[#6F8099]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}