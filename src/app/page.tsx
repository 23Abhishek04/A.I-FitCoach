"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Dumbbell,
  Eye,
  EyeOff,
  FilePlus2,
  KeyRound,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "signin" | "register"
  >("signin");

  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#080D17] text-white">
      <div className="min-h-screen">
        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <section className="relative min-h-screen w-full">
          <div className="mx-auto w-full max-w-300 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-12 lg:pt-25">
            {/* =================================================
                BRAND
            ================================================== */}

            <div className="mb-10 sm:mb-13">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex h-12 w-12 items-center justify-center text-3xl sm:h-15.5 sm:w-15.5 sm:text-[43px]">
                  🏋️
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-[#2DB4F0] sm:text-[42px]">
                  AI FitCoach
                </h1>
              </div>

              <p className="mt-3 text-sm text-[#91A0B7] sm:mt-4 sm:text-[18px]">
                Generative AI Based Personal Fitness Assistant
              </p>
            </div>

            {/* =================================================
                AUTHENTICATION
            ================================================== */}

            <div className="mx-auto w-full max-w-140">
              {/* Tabs */}

              <div className="flex overflow-x-auto border-b border-[#293750]">
                {/* Sign In */}

                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className={`relative flex shrink-0 items-center gap-2 pb-3 pr-6 text-sm font-medium transition sm:pr-7 ${
                    activeTab === "signin"
                      ? "text-[#22AAFF]"
                      : "text-[#CBD5E1]"
                  }`}
                >
                  <KeyRound size={16} />

                  Sign In

                  {activeTab === "signin" && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#22AAFF]" />
                  )}
                </button>

                {/* Register */}

                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className={`relative flex shrink-0 items-center gap-2 pb-3 text-sm font-medium transition ${
                    activeTab === "register"
                      ? "text-[#22AAFF]"
                      : "text-[#CBD5E1]"
                  }`}
                >
                  <FilePlus2 size={16} />

                  Create New Account

                  {activeTab === "register" && (
                    <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#22AAFF]" />
                  )}
                </button>
              </div>

              {/* Forms */}

              {activeTab === "signin" ? (
                <SignInForm
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              ) : (
                <RegisterForm />
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   SIGN IN FORM
============================================================ */

function SignInForm({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-7 sm:pt-8">
      <h2 className="text-2xl font-bold text-[#F5F7FA] sm:text-[27px]">
        Welcome Back!
      </h2>

      <form
        onSubmit={handleLogin}
        className="mt-6 space-y-5 sm:mt-6.25 sm:space-y-5.5"
      >
        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Username or Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="Enter your email"
            autoComplete="email"
            disabled={loading}
            className="h-11 w-full rounded-lg border border-[#293750] bg-[#1A263A] px-3 text-sm text-white outline-none transition placeholder:text-[#6F8099] focus:border-[#22AAFF] focus:ring-1 focus:ring-[#22AAFF]/30 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Password
          </label>

          <div className="relative">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              className="h-11 w-full rounded-lg border border-[#293750] bg-[#1A263A] px-3 pr-12 text-sm text-white outline-none transition placeholder:text-[#6F8099] focus:border-[#22AAFF] focus:ring-1 focus:ring-[#22AAFF]/30 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              disabled={loading}
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-r-lg text-[#9AA7BB] hover:text-white disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Forgot Password */}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() =>
              setError(
                "Password reset is not configured yet."
              )
            }
            className="text-xs text-[#22AAFF] hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Login */}

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-lg bg-[#2DB4F0] text-sm font-semibold text-white transition hover:bg-[#20A5DF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Signing In..."
            : "Log In"}
        </button>
      </form>
    </div>
  );
}

/* ============================================================
   REGISTER FORM
============================================================ */

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    /* ========================================================
       VALIDATION
    ======================================================== */

    if (
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      setError(
        "Please fill in all fields."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      /* ======================================================
         CREATE USER
      ====================================================== */

      const response = await fetch(
        "/api/user",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),

            email: email
              .trim()
              .toLowerCase(),

            password,
          }),
        }
      );

      const data = await response.json();

      /* ======================================================
         REGISTRATION ERROR
      ====================================================== */

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.error ||
            "Unable to create account."
        );

        return;
      }

      /* ======================================================
         AUTOMATIC LOGIN
      ====================================================== */

      const loginResult =
        await signIn(
          "credentials",
          {
            email: email
              .trim()
              .toLowerCase(),

            password,

            redirect: false,
          }
        );

      /* ======================================================
         LOGIN ERROR
      ====================================================== */

      if (loginResult?.error) {
        setError(
          "Account created, but automatic login failed. Please sign in manually."
        );

        return;
      }

      /* ======================================================
         SUCCESS
      ====================================================== */

      window.location.href =
        "/dashboard";
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-7 sm:pt-8">
      <h2 className="text-2xl font-bold text-[#F5F7FA] sm:text-[27px]">
        Create Your Account
      </h2>

      <p className="mt-2 text-sm text-[#91A0B7]">
        Start your personalized fitness journey.
      </p>

      <form
        onSubmit={handleRegister}
        className="mt-6 space-y-4"
      >
        {/* Full Name */}

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Enter your full name"
            autoComplete="name"
            disabled={loading}
            className="h-11 w-full rounded-lg border border-[#293750] bg-[#1A263A] px-3 text-sm text-white outline-none placeholder:text-[#6F8099] focus:border-[#22AAFF] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            placeholder="Enter your email"
            autoComplete="email"
            disabled={loading}
            className="h-11 w-full rounded-lg border border-[#293750] bg-[#1A263A] px-3 text-sm text-white outline-none placeholder:text-[#6F8099] focus:border-[#22AAFF] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            disabled={loading}
            className="h-11 w-full rounded-lg border border-[#293750] bg-[#1A263A] px-3 text-sm text-white outline-none placeholder:text-[#6F8099] focus:border-[#22AAFF] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Error */}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Create Account */}

        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-lg bg-[#2DB4F0] text-sm font-semibold text-white transition hover:bg-[#20A5DF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>
    </div>
  );
}