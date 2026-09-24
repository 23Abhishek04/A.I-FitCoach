"use client";

import { useEffect, useState } from "react";
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
  RefreshCw,
  Settings,
  Sparkles,
  User,
  UserCircle,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    icon: BarChart3,
    href: "/dashboard",
  },
  {
    label: "My Profile",
    icon: UserCircle,
    href: "/profile",
  },
  {
    label: "BMI Calculator",
    icon: Calculator,
    href: "/bmi-calculator",
  },
  {
    label: "Workout Generator",
    icon: Dumbbell,
    href: "/workout",
  },
  {
    label: "Diet Generator",
    icon: Apple,
    href: "/diet",
  },
  {
    label: "Fitness Chatbot",
    icon: MessageCircle,
    href: "/chatbot",
  },
  {
    label: "Progress Tracking",
    icon: Activity,
    href: "/progress",
  },
  {
    label: "Daily Fitness Tip",
    icon: Lightbulb,
    href: "/daily-tip",
  },
];

type Tip = {
  category: string;
  title: string;
  tip: string;
  action: string;
};

export default function DailyTipPage() {
  const { data: session, status } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const [userData, setUserData] = useState<any>(null);

  const [tip, setTip] = useState<Tip | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * ============================================================
   * AUTH PROTECTION
   * ============================================================
   */

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  /*
   * ============================================================
   * LOAD USER FROM MONGODB
   * ============================================================
   */

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !session?.user?.email
    ) {
      return;
    }

    const email = session.user.email;

    const loadUser = async () => {
      try {
        const response = await fetch(
          `/api/user?email=${encodeURIComponent(
            email
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setUserData(data.user);
        } else {
          console.error(
            "Failed to load user:",
            data.error
          );
        }
      } catch (error) {
        console.error(
          "Daily tip user fetch error:",
          error
        );
      }
    };

    loadUser();
  }, [status, session?.user?.email]);

  /*
   * ============================================================
   * GENERATE DAILY FITNESS TIP
   * ============================================================
   */

  const generateTip = async () => {
    if (!session?.user?.email) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/daily-tip",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: {
              name:
                userData?.name ||
                session.user?.name ||
                "User",

              age:
                userData?.age ?? null,

              gender:
                userData?.gender || "",

              height:
                userData?.height ?? null,

              weight:
                userData?.weight ?? null,

              targetWeight:
                userData?.targetWeight ?? null,

              fitnessGoal:
                userData?.fitnessGoal ||
                "General Fitness",

              activity:
                userData?.activity ||
                "Moderately Active",

              fitnessLevel:
                userData?.fitnessLevel ||
                "Beginner",

              dietType:
                userData?.dietType ||
                "Balanced",

              dailyCalories:
                userData?.dailyCalories ||
                2000,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Failed to generate today's fitness tip."
        );
      }

      setTip(data.tip);
    } catch (error) {
      console.error(
        "Daily tip generation error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to generate today's fitness tip."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * AUTO GENERATE FIRST TIP
   * ============================================================
   */

  useEffect(() => {
    if (
      status === "authenticated" &&
      userData &&
      !tip
    ) {
      generateTip();
    }
  }, [status, userData]);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080D17] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#293750] border-t-[#22AAFF]" />

          <p className="text-sm text-[#91A0B7]">
            Loading AI FitCoach...
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

      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() =>
            setMobileSidebarOpen(false)
          }
        />
      )}

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen flex-col
          border-r border-[#293750]
          bg-[#1D293D]
          transition-all duration-300

          ${
            sidebarCollapsed
              ? "w-19"
              : "w-43.5"
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
          className={`
            flex h-20.5 shrink-0 items-center
            border-b border-[#293750]

            ${
              sidebarCollapsed
                ? "justify-center"
                : "justify-between px-5"
            }
          `}
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

          {/* DESKTOP COLLAPSE */}

          <button
            type="button"
            onClick={() =>
              setSidebarCollapsed(
                (value) => !value
              )
            }
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-[#9AA7BB] transition hover:bg-[#293750] hover:text-white lg:flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9AA7BB] hover:bg-[#293750] hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* SIDEBAR CONTENT */}

        <div className="flex-1 overflow-y-auto px-3 py-5">

          {!sidebarCollapsed && (
            <div className="mb-5 rounded-lg border border-[#3A4A62] bg-[#182438] p-3">

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
                Level:{" "}
                {userData?.fitnessLevel ||
                  "Beginner"}
              </p>

            </div>
          )}

          {/* NAVIGATION */}

          <nav className="space-y-0.5">

            {navigation.map((item) => {

              const Icon = item.icon;

              const active =
                pathname === item.href;

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => {
                    setMobileSidebarOpen(false);

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
                    group flex w-full items-center
                    rounded-md transition

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
            })}

          </nav>
        </div>

        {/* SIDEBAR FOOTER */}

        <div className="border-t border-[#293750] p-3">

          <button
            type="button"
            onClick={() =>
              router.push("/settings")
            }
            className={`
              flex h-9 w-full items-center
              rounded-md border
              border-[#3A4A62]
              bg-[#182438]
              text-[#B9C5D6]
              transition
              hover:text-white

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
              mt-3 flex h-8 w-full
              items-center rounded-md
              border border-[#3A4A62]
              text-[#B9C5D6]
              transition
              hover:bg-[#253650]
              hover:text-white

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

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className={`
          min-h-screen transition-all duration-300

          ${
            sidebarCollapsed
              ? "lg:pl-19"
              : "lg:pl-43.5"
          }
        `}
      >

        {/* MOBILE HEADER */}

        <header className="sticky top-0 z-30 border-b border-[#293750] bg-[#080D17]/95 backdrop-blur lg:hidden">

          <div className="flex h-16 items-center justify-between px-4">

            <button
              type="button"
              onClick={() =>
                setMobileSidebarOpen(true)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293750] bg-[#131E32]"
            >
              <Menu size={18} />
            </button>

            <span className="text-sm font-bold">
              AI Fit
              <span className="text-[#22AAFF]">
                Coach
              </span>
            </span>

            <span className="h-2 w-2 rounded-full bg-[#16D66B]" />

          </div>
        </header>

        {/* DESKTOP HEADER */}

        <div className="hidden border-b border-[#293750] lg:block">

          <div className="flex h-20.5 items-center justify-between px-6 xl:px-8">

            <div>

              <p className="text-[8px] text-[#6F8099]">
                AI Fitness
              </p>

              <h1 className="text-[18px] font-bold">
                Daily Fitness Tip
              </h1>

            </div>

            <button
              type="button"
              onClick={generateTip}
              disabled={loading}
              className="flex h-8 items-center gap-2 rounded-lg bg-[#22AAFF] px-4 text-[10px] font-semibold text-[#080D17] transition hover:bg-[#40B8FF] disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RefreshCw
                size={12}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              {loading
                ? "Generating..."
                : "New Tip"}

            </button>

          </div>
        </div>

        {/* PAGE */}

        <div className="mx-auto max-w-300 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

          {/* PAGE TITLE */}

          <section className="mb-7">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
                <Lightbulb size={24} />
              </div>

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#22AAFF]">
                  AI FitCoach
                </p>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  Daily Fitness Tip
                </h1>

              </div>

            </div>

            <p className="mt-3 max-w-2xl text-xs leading-5 text-[#91A0B7]">
              Get a personalized fitness,
              nutrition, hydration or recovery
              tip based on your profile and
              current fitness goal.
            </p>

          </section>

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">

              <p className="font-semibold">
                Unable to generate tip
              </p>

              <p className="mt-1 text-xs">
                {error}
              </p>

              <button
                type="button"
                onClick={generateTip}
                className="mt-3 rounded-lg border border-red-500/30 px-3 py-2 text-xs hover:bg-red-500/10"
              >
                Try Again
              </button>

            </div>
          )}

          {/* MAIN TIP CARD */}

          <section className="overflow-hidden rounded-2xl border border-[#293750] bg-[#131E32]">

            {/* CARD HEADER */}

            <div className="border-b border-[#293750] bg-[#0D1524] px-5 py-4 sm:px-7">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <Sparkles
                    size={17}
                    className="text-[#22AAFF]"
                  />

                  <div>

                    <p className="text-[9px] uppercase tracking-wider text-[#22AAFF]">
                      Personalized for you
                    </p>

                    <p className="mt-1 text-xs text-[#91A0B7]">
                      Goal:{" "}
                      {userData?.fitnessGoal ||
                        "General Fitness"}
                    </p>

                  </div>

                </div>

                <p className="text-[9px] text-[#6F8099]">
                  {new Date().toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </p>

              </div>

            </div>

            {/* GENERATING */}

            {loading && !tip && (
              <div className="flex min-h-87.5 items-center justify-center px-6">

                <div className="text-center">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#22AAFF]/10 text-[#22AAFF]">

                    <Sparkles
                      size={28}
                      className="animate-pulse"
                    />

                  </div>

                  <h2 className="mt-5 text-lg font-bold">
                    Creating your personalized tip...
                  </h2>

                  <p className="mt-2 text-xs text-[#6F8099]">
                    AI FitCoach is generating a
                    recommendation based on
                    your profile.
                  </p>

                </div>

              </div>
            )}

            {/* TIP */}

            {!loading && tip && (
              <div className="p-5 sm:p-7">

                <div className="grid gap-6 lg:grid-cols-[1fr_280px]">

                  <div>

                    <span className="inline-flex rounded-full bg-[#16D66B]/10 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-[#16D66B]">
                      💡 {tip.category}
                    </span>

                    <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                      {tip.title}
                    </h2>

                    <div className="mt-5 rounded-xl border-l-4 border-[#16D66B] bg-[#003D31] p-5">

                      <p className="text-sm leading-7 text-[#D5E9E4]">
                        {tip.tip}
                      </p>

                    </div>

                    <div className="mt-5 rounded-xl border border-[#293750] bg-[#0D1524] p-5">

                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#22AAFF]">
                        TODAY&apos;S ACTION
                      </p>

                      <p className="mt-2 text-sm leading-6 text-white">
                        {tip.action}
                      </p>

                    </div>

                  </div>

                  {/* RIGHT CARD */}

                  <div className="rounded-xl border border-[#293750] bg-[#0D1524] p-5">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
                      <Sparkles size={21} />
                    </div>

                    <h3 className="mt-5 font-bold">
                      AI FitCoach
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-[#91A0B7]">
                      This tip is generated
                      according to your current
                      fitness goal, activity level,
                      fitness level and profile.
                    </p>

                    <button
                      type="button"
                      onClick={generateTip}
                      disabled={loading}
                      className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#293750] bg-[#131E32] text-xs font-semibold text-white transition hover:border-[#22AAFF] hover:text-[#22AAFF] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      <RefreshCw
                        size={13}
                        className={
                          loading
                            ? "animate-spin"
                            : ""
                        }
                      />

                      Generate Another Tip

                    </button>

                  </div>

                </div>

              </div>
            )}

            {/* EMPTY */}

            {!loading && !tip && !error && (
              <div className="flex min-h-87.5 items-center justify-center px-6 text-center">

                <div>

                  <Lightbulb
                    size={36}
                    className="mx-auto text-[#22AAFF]"
                  />

                  <h2 className="mt-5 text-lg font-bold">
                    Your daily tip is ready
                  </h2>

                  <p className="mt-2 text-xs text-[#6F8099]">
                    Generate a personalized tip
                    based on your fitness profile.
                  </p>

                  <button
                    type="button"
                    onClick={generateTip}
                    className="mt-5 rounded-lg bg-[#22AAFF] px-5 py-3 text-xs font-semibold text-[#080D17] transition hover:bg-[#40B8FF]"
                  >
                    Generate Daily Tip
                  </button>

                </div>

              </div>
            )}

          </section>

          <p className="mt-5 text-center text-[9px] leading-4 text-[#6F8099]">
            AI-generated fitness guidance is
            informational and does not replace
            professional medical or fitness advice.
          </p>

        </div>
      </div>
    </main>
  );
}