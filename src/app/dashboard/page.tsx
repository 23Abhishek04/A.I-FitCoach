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
  Settings,
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

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileSidebarOpen, setMobileSidebarOpen] =
    useState(false);

  const { data: session, status } = useSession();

  const router = useRouter();
  const pathname = usePathname();

  const [userData, setUserData] =
    useState<UserData | null>(null);

  const [userLoading, setUserLoading] =
    useState(true);

  /* ============================================================
     REDIRECT UNAUTHENTICATED USERS
  ============================================================ */

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  /* ============================================================
     LOAD USER DATA
  ============================================================ */

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !session?.user?.email
    ) {
      return;
    }

    // Narrow the email before using it inside async code.
    const email = session.user.email;

    const loadUserData = async () => {
      try {
        setUserLoading(true);

        const response = await fetch(
          `/api/user?email=${encodeURIComponent(email)}`,
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
          "Dashboard user fetch error:",
          error
        );
      } finally {
        setUserLoading(false);
      }
    };

    loadUserData();
  }, [status, session?.user?.email]);

  /* ============================================================
     REFRESH USER DATA WHEN PAGE BECOMES VISIBLE
  ============================================================ */

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !session?.user?.email
    ) {
      return;
    }

    // Narrow the email before async code.
    const email = session.user.email;

    const refreshUser = async () => {
      try {
        const response = await fetch(
          `/api/user?email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setUserData(data.user);
        }
      } catch (error) {
        console.error(
          "Dashboard refresh error:",
          error
        );
      }
    };

    const handleVisibility = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        refreshUser();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, [status, session?.user?.email]);

  /* ============================================================
     BMI CALCULATION
  ============================================================ */

  const weight = Number(
    userData?.weight
  );

  const height = Number(
    userData?.height
  );

  const bmi =
    weight > 0 && height > 0
      ? weight /
        Math.pow(
          height / 100,
          2
        )
      : null;

  const bmiValue =
    bmi !== null
      ? bmi.toFixed(2)
      : "--";

  const bmiCategory =
    bmi === null
      ? "Not available"
      : bmi < 18.5
        ? "Underweight"
        : bmi < 25
          ? "Normal"
          : bmi < 30
            ? "Overweight"
            : "Obese";

  /* ============================================================
     LOADING
  ============================================================ */

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080D17] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#293750] border-t-[#22AAFF]" />

          <p className="text-sm text-[#91A0B7]">
            Loading your dashboard...
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
        {/* Sidebar top */}

        <div
          className={`flex h-[82px] shrink-0 items-center border-b border-[#293750]
          ${
            sidebarCollapsed
              ? "justify-center"
              : "justify-between px-5"
          }`}
        >
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="text-xl">
                🏋️
              </div>

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

        {/* =================================================
            SIDEBAR CONTENT
        ================================================== */}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {!sidebarCollapsed && (
            <>
              <p className="mb-5 px-2 text-[8px] leading-3 text-[#91A0B7]">
                Generative AI Based
                Personal Fitness
                Assistant
              </p>

              <p className="mb-4 px-2 text-[8px] text-[#6F8099]">
                v2.0.0 • Personal Fitness
                Assistant
              </p>

              {/* User card */}

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

          {/* Navigation */}

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

        {/* =================================================
            SIDEBAR BOTTOM
        ================================================== */}

        <div className="shrink-0 border-t border-[#293750] p-3">
          <button
            type="button"
            onClick={() => {
              setMobileSidebarOpen(
                false
              );

              router.push(
                "/settings"
              );
            }}
            title={
              sidebarCollapsed
                ? "Gemini API Settings"
                : undefined
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
                Gemini API Settings
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={async () => {
              await signOut({
                callbackUrl: "/",
              });
            }}
            title={
              sidebarCollapsed
                ? "Logout"
                : undefined
            }
            className={`
              mt-3 flex h-8 w-full items-center
              rounded-md border border-[#3A4A62]
              text-[#B9C5D6] transition hover:bg-[#253650]
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

      {/* =====================================================
          MAIN
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
        {/* =================================================
            MOBILE HEADER
        ================================================== */}

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

        {/* =================================================
            DESKTOP TOP BAR
        ================================================== */}

        <div className="hidden border-b border-[#293750] lg:block">
          <div className="flex h-[82px] items-center justify-between px-6 xl:px-8">
            {/* Logo */}

            <div className="flex items-center gap-2">
              <span className="text-xl">
                🏋️
              </span>

              <span className="text-[16px] font-bold">
                AI Fit
                <span className="text-[#22AAFF]">
                  Coach
                </span>
              </span>
            </div>

            {/* Right */}

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-[#16D66B]/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#16D66B]" />

                <span className="text-[9px] font-semibold text-[#16D66B]">
                  Gemini Connected
                </span>
              </div>

              <div className="text-right">
                <p className="text-[8px] text-[#6F8099]">
                  User:{" "}
                  {userData?.name ||
                    session.user?.name ||
                    "User"}
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await signOut({
                    callbackUrl: "/",
                  });
                }}
                className="flex h-7 min-w-[145px] items-center justify-center gap-2 rounded-md border border-[#3A4A62] bg-[#0E1625] text-[9px] text-white hover:bg-[#182438]"
              >
                <LogOut size={10} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            DASHBOARD CONTENT
        ================================================== */}

        <div className="mx-auto max-w-[1800px] px-4 py-7 sm:px-6 lg:px-7 xl:px-8">
          {/* WELCOME */}

          <section>
            <h1 className="text-2xl font-bold sm:text-3xl lg:text-[27px]">
              Welcome back,{" "}
              {userData?.name ||
                session.user?.name ||
                "User"}
              !
            </h1>

            <p className="mt-2 text-xs text-[#91A0B7]">
              Here is your personal fitness
              and wellness overview for today.
            </p>
          </section>

          {/* FITNESS METRICS */}

          <section className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">
                📊
              </span>

              <h2 className="text-lg font-bold">
                Your Fitness Metrics
              </h2>
            </div>

            <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
              <MetricCard
                title="CURRENT WEIGHT"
                value={
                  userData?.weight
                    ? `${userData.weight} kg`
                    : "--"
                }
                description={
                  userData?.weight
                    ? "Current body weight"
                    : "Add your weight in Profile"
                }
              />

              <MetricCard
                title="TARGET WEIGHT"
                value={
                  userData?.targetWeight
                    ? `${userData.targetWeight} kg`
                    : "--"
                }
                description={
                  userData?.targetWeight
                    ? `Goal: ${
                        userData?.fitnessGoal ||
                        "Fitness"
                      }`
                    : "Add target weight in Profile"
                }
              />

              <MetricCard
                title="BMI"
                value={bmiValue}
                description={`Category: ${bmiCategory}`}
                green={
                  bmi !== null &&
                  bmi >= 18.5 &&
                  bmi < 25
                }
              />

              <MetricCard
                title="FITNESS GOAL"
                value={
                  userData?.fitnessGoal ||
                  "General Fitness"
                }
                description="Active Program"
              />

              <MetricCard
                title="FITNESS LEVEL"
                value={
                  userData?.fitnessLevel ||
                  "Beginner"
                }
                description={
                  userData?.activity ||
                  "Activity level not set"
                }
              />

              <MetricCard
                title="DAILY CALORIES"
                value={
                  userData?.dailyCalories
                    ? `${userData.dailyCalories} kcal`
                    : "--"
                }
                description="Daily calorie target"
              />
            </div>
          </section>

          {/* DIVIDER */}

          <div className="my-6 border-t border-[#293750]" />

          {/* PROGRESS + DAILY TIP */}

          <section className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
            {/* Weight Progress */}

            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">
                  📈
                </span>

                <h2 className="text-lg font-bold">
                  Weight Progress Trend
                </h2>
              </div>

              <div className="flex min-h-[32px] items-center rounded-md bg-[#16304E] px-3 py-2">
                <p className="text-[9px] text-[#22AAFF]">
                  Start tracking your
                  progress to see charts and
                  AI recommendations.
                </p>
              </div>
            </div>

            {/* Right column */}

            <div className="space-y-4">
              {/* Daily Fitness Tip */}

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">
                    💡
                  </span>

                  <h2 className="text-lg font-bold">
                    Daily Fitness Tip
                  </h2>
                </div>

                <div className="rounded-md border-l-4 border-[#16D66B] bg-[#003D31] px-3 py-3">
                  <p className="text-[8px] font-bold uppercase text-[#16D66B]">
                    💡 DAILY FITNESS TIP
                    (NUTRITION)
                  </p>

                  <p className="mt-2 text-[9px] leading-4 text-[#D5E9E4]">
                    Consume 20–35g of
                    high-quality protein per
                    meal to trigger muscle
                    protein synthesis and
                    maintain prolonged
                    satiety.
                  </p>
                </div>
              </div>

              {/* AI Recommendation */}

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-base">
                    🤖
                  </span>

                  <h2 className="text-lg font-bold">
                    AI Recommendation
                  </h2>
                </div>

                <div className="rounded-md bg-[#16304E] px-3 py-3">
                  <p className="text-[9px] text-[#22AAFF]">
                    Start tracking your
                    progress to see charts and
                    AI recommendations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* DIVIDER */}

          <div className="my-6 border-t border-[#293750]" />

          {/* RECENT ACTIVITY */}

          <section>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xl">
                🕘
              </span>

              <h2 className="text-lg font-bold">
                Recent Activity
              </h2>
            </div>

            <div className="rounded-md bg-[#16304E] px-3 py-3">
              <p className="text-[9px] text-[#22AAFF]">
                No activity recorded yet. Go
                to Progress Tracking to log
                today&apos;s workout, water,
                and weight.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   METRIC CARD
============================================================ */

function MetricCard({
  title,
  value,
  description,
  green = false,
}: {
  title: string;
  value: string;
  description: string;
  green?: boolean;
}) {
  return (
    <div className="min-h-[79px] rounded-lg border border-[#293750] bg-[#111C30] px-3 py-3 sm:px-4">
      <p className="text-[8px] font-medium tracking-wider text-[#91A0B7]">
        {title}
      </p>

      <p
        className={`mt-2 text-lg font-bold sm:text-[17px] ${
          green
            ? "text-[#16D66B]"
            : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-[8px] text-[#22AAFF]">
        {description}
      </p>
    </div>
  );
}