"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Check,
  Edit3,
  Ruler,
  Save,
  Target,
  User,
  Weight,
} from "lucide-react";

type Profile = {
  name: string;
  username: string;
  email: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  targetWeight: string;
  goal: string;
  activity: string;
  fitnessLevel: string;
  dietType: string;
  dailyCalories: string;
};

const defaultProfile: Profile = {
  name: "",
  username: "",
  email: "",
  age: "",
  gender: "Male",
  height: "",
  weight: "",
  targetWeight: "",
  goal: "General Fitness",
  activity: "Moderately Active",
  fitnessLevel: "Beginner",
  dietType: "Balanced",
  dailyCalories: "2000",
};

export default function ProfilePage() {
  const { data: session, status } = useSession();

  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (
    field: keyof Profile,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* ============================================================
     LOAD AUTHENTICATED USER
  ============================================================ */

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      window.location.href = "/";
      return;
    }

    if (status !== "authenticated" || !session?.user?.email) {
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/user?email=${encodeURIComponent(
            session.user.email!
          )}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Failed to load profile"
          );
        }

        const user = data.user;

        setProfile({
          name: user.name ?? "",
          username:
            user.username ??
            user.email?.split("@")[0] ??
            "",
          email: user.email ?? session.user.email ?? "",
          age:
            user.age !== null && user.age !== undefined
              ? String(user.age)
              : "",
          gender: user.gender ?? "Male",
          height:
            user.height !== null &&
            user.height !== undefined
              ? String(user.height)
              : "",
          weight:
            user.weight !== null &&
            user.weight !== undefined
              ? String(user.weight)
              : "",
          targetWeight:
            user.targetWeight !== null &&
            user.targetWeight !== undefined
              ? String(user.targetWeight)
              : "",
          goal:
            user.fitnessGoal ?? "General Fitness",
          activity:
            user.activity ?? "Moderately Active",
          fitnessLevel:
            user.fitnessLevel ?? "Beginner",
          dietType:
            user.dietType ?? "Balanced",
          dailyCalories:
            user.dailyCalories !== null &&
            user.dailyCalories !== undefined
              ? String(user.dailyCalories)
              : "2000",
        });
      } catch (error) {
        console.error("Profile loading error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [status, session?.user?.email]);

  /* ============================================================
     SAVE PROFILE
  ============================================================ */

  const saveProfile = async () => {
    if (!session?.user?.email) {
      setError("You must be logged in to save your profile.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          email: session.user.email,

          age: profile.age
            ? Number(profile.age)
            : null,

          gender: profile.gender,

          height: profile.height
            ? Number(profile.height)
            : null,

          weight: profile.weight
            ? Number(profile.weight)
            : null,

          targetWeight: profile.targetWeight
            ? Number(profile.targetWeight)
            : null,

          fitnessGoal: profile.goal,
          activity: profile.activity,
          fitnessLevel: profile.fitnessLevel,
          dietType: profile.dietType,

          dailyCalories: profile.dailyCalories
            ? Number(profile.dailyCalories)
            : 2000,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Failed to save profile"
        );
      }

      const user = data.user;

      setProfile((current) => ({
        ...current,
        name: user.name ?? current.name,
        email: user.email ?? current.email,

        age:
          user.age !== null &&
          user.age !== undefined
            ? String(user.age)
            : "",

        gender: user.gender ?? current.gender,

        height:
          user.height !== null &&
          user.height !== undefined
            ? String(user.height)
            : "",

        weight:
          user.weight !== null &&
          user.weight !== undefined
            ? String(user.weight)
            : "",

        targetWeight:
          user.targetWeight !== null &&
          user.targetWeight !== undefined
            ? String(user.targetWeight)
            : "",

        goal:
          user.fitnessGoal ?? current.goal,

        activity:
          user.activity ?? current.activity,

        fitnessLevel:
          user.fitnessLevel ?? current.fitnessLevel,

        dietType:
          user.dietType ?? current.dietType,

        dailyCalories:
          user.dailyCalories !== null &&
          user.dailyCalories !== undefined
            ? String(user.dailyCalories)
            : current.dailyCalories,
      }));

      setEditing(false);
      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Profile save error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     BMI
  ============================================================ */

  const bmi =
    Number(profile.height) > 0 &&
    Number(profile.weight) > 0
      ? (
          Number(profile.weight) /
          Math.pow(Number(profile.height) / 100, 2)
        ).toFixed(2)
      : "0.00";

  /* ============================================================
     LOADING
  ============================================================ */

  if (status === "loading" || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080D17] text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#293750] border-t-[#22AAFF]" />

          <p className="mt-4 text-sm text-[#9AA7BB]">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#080D17] text-white">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

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
                Account
              </p>

              <h1 className="text-xl font-bold sm:text-2xl">
                My Profile
              </h1>
            </div>

          </div>

          <button
            onClick={() => {
              if (editing) {
                saveProfile();
              } else {
                setEditing(true);
                setError("");
                setSuccess("");
              }
            }}
            disabled={saving}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
              editing
                ? "bg-[#22AAFF] text-white hover:bg-[#159BEA]"
                : "bg-[#22AAFF] text-white hover:bg-[#159BEA]"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {editing ? (
              <>
                <Save size={15} />
                {saving ? "Saving..." : "Save Changes"}
              </>
            ) : (
              <>
                <Edit3 size={15} />
                Edit Profile
              </>
            )}
          </button>

        </div>
      </header>

      {/* CONTENT */}

      <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8 sm:py-10">

        {/* PROFILE HEADER */}

        <section className="rounded-2xl border border-[#293750] bg-[#131E32] p-5 sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#22AAFF]/10 text-[#22AAFF] sm:h-20 sm:w-20">
                <User size={32} />
              </div>

              <div>

                <h2 className="text-xl font-bold sm:text-2xl">
                  {profile.name || "Your Name"}
                </h2>

                <p className="mt-1 text-sm text-[#6F8099]">
                  @{profile.username || "username"}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#16D66B]" />

                  <span className="text-xs text-[#16D66B]">
                    Active Fitness Profile
                  </span>
                </div>

              </div>
            </div>

            <div className="rounded-xl border border-[#293750] bg-[#0D1524] px-5 py-4">

              <p className="text-[10px] uppercase tracking-wider text-[#6F8099]">
                Current Goal
              </p>

              <p className="mt-1 text-lg font-bold text-[#22AAFF]">
                {profile.goal}
              </p>

            </div>

          </div>
        </section>

        {/* STATUS */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#16D66B]/30 bg-[#16D66B]/10 px-4 py-3 text-sm text-[#16D66B]">
            <Check size={16} />
            {success}
          </div>
        )}

        {/* PERSONAL INFORMATION */}

        <section className="mt-6 rounded-2xl border border-[#293750] bg-[#131E32] p-5 sm:p-7">

          <SectionHeading
            icon={<User size={19} />}
            title="Personal Information"
            description="Basic information associated with your fitness profile."
          />

          <div className="mt-7 grid gap-5 md:grid-cols-2">

            <InputField
              label="Full Name"
              value={profile.name}
              editing={editing}
              onChange={(value) =>
                updateField("name", value)
              }
            />

            <InputField
              label="Username"
              value={profile.username}
              editing={false}
              onChange={(value) =>
                updateField("username", value)
              }
            />

            <InputField
              label="Email"
              value={profile.email}
              editing={false}
              onChange={(value) =>
                updateField("email", value)
              }
              type="email"
            />

            <InputField
              label="Age"
              value={profile.age}
              editing={editing}
              onChange={(value) =>
                updateField("age", value)
              }
              type="number"
            />

            <SelectField
              label="Gender"
              value={profile.gender}
              editing={editing}
              options={[
                "Male",
                "Female",
                "Other",
              ]}
              onChange={(value) =>
                updateField("gender", value)
              }
            />

          </div>
        </section>

        {/* FITNESS INFORMATION */}

        <section className="mt-6 rounded-2xl border border-[#293750] bg-[#131E32] p-5 sm:p-7">

          <SectionHeading
            icon={<Activity size={19} />}
            title="Fitness Information"
            description="Your physical information and fitness preferences."
          />

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <InputField
              label="Height (cm)"
              value={profile.height}
              editing={editing}
              onChange={(value) =>
                updateField("height", value)
              }
              type="number"
              icon={<Ruler size={15} />}
            />

            <InputField
              label="Current Weight (kg)"
              value={profile.weight}
              editing={editing}
              onChange={(value) =>
                updateField("weight", value)
              }
              type="number"
              icon={<Weight size={15} />}
            />

            <InputField
              label="Target Weight (kg)"
              value={profile.targetWeight}
              editing={editing}
              onChange={(value) =>
                updateField("targetWeight", value)
              }
              type="number"
              icon={<Target size={15} />}
            />

            <SelectField
              label="Fitness Goal"
              value={profile.goal}
              editing={editing}
              options={[
                "Weight Loss",
                "Muscle Gain",
                "Maintain Weight",
                "General Fitness",
              ]}
              onChange={(value) =>
                updateField("goal", value)
              }
            />

            <SelectField
              label="Activity Level"
              value={profile.activity}
              editing={editing}
              options={[
                "Sedentary",
                "Lightly Active",
                "Moderately Active",
                "Very Active",
              ]}
              onChange={(value) =>
                updateField("activity", value)
              }
            />

            <SelectField
              label="Fitness Level"
              value={profile.fitnessLevel}
              editing={editing}
              options={[
                "Beginner",
                "Intermediate",
                "Advanced",
              ]}
              onChange={(value) =>
                updateField("fitnessLevel", value)
              }
            />

            <SelectField
              label="Diet Type"
              value={profile.dietType}
              editing={editing}
              options={[
                "Balanced",
                "Vegetarian",
                "High Protein",
                "Low Carb",
                "Vegan",
              ]}
              onChange={(value) =>
                updateField("dietType", value)
              }
            />

            <InputField
              label="Daily Calories"
              value={profile.dailyCalories}
              editing={editing}
              onChange={(value) =>
                updateField("dailyCalories", value)
              }
              type="number"
            />

          </div>
        </section>

        {/* FITNESS SUMMARY */}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <SummaryCard
            icon={<Weight size={19} />}
            title="Current Weight"
            value={`${profile.weight || 0} kg`}
          />

          <SummaryCard
            icon={<Target size={19} />}
            title="Target Weight"
            value={`${profile.targetWeight || 0} kg`}
          />

          <SummaryCard
            icon={<Activity size={19} />}
            title="BMI"
            value={bmi}
            green
          />

          <SummaryCard
            icon={<Calendar size={19} />}
            title="Fitness Goal"
            value={profile.goal}
          />

        </section>

      </div>
    </main>
  );
}

/* ============================================================
   SECTION HEADING
============================================================ */

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
        {icon}
      </div>

      <div>
        <h2 className="font-bold text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-[#6F8099]">
          {description}
        </p>
      </div>

    </div>
  );
}

/* ============================================================
   INPUT
============================================================ */

function InputField({
  label,
  value,
  editing,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-[#B9C5D6]">
        {icon}
        {label}
      </label>

      <input
        type={type}
        value={value}
        disabled={!editing}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 w-full rounded-lg border px-3 text-sm outline-none transition ${
          editing
            ? "border-[#293750] bg-[#0D1524] text-white focus:border-[#22AAFF] focus:ring-1 focus:ring-[#22AAFF]/20"
            : "border-[#293750] bg-[#0D1524]/70 text-[#9AA7BB]"
        }`}
      />

    </div>
  );
}

/* ============================================================
   SELECT
============================================================ */

function SelectField({
  label,
  value,
  editing,
  options,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs font-medium text-[#B9C5D6]">
        {label}
      </label>

      <select
        value={value}
        disabled={!editing}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 w-full rounded-lg border px-3 text-sm outline-none transition ${
          editing
            ? "border-[#293750] bg-[#0D1524] text-white focus:border-[#22AAFF]"
            : "border-[#293750] bg-[#0D1524]/70 text-[#9AA7BB]"
        }`}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#131E32]"
          >
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}

/* ============================================================
   SUMMARY CARD
============================================================ */

function SummaryCard({
  icon,
  title,
  value,
  green = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#293750] bg-[#131E32] p-5">

      <div className="flex items-center gap-2 text-[#22AAFF]">
        {icon}

        <span className="text-xs text-[#6F8099]">
          {title}
        </span>
      </div>

      <p
        className={`mt-4 text-xl font-bold ${
          green
            ? "text-[#16D66B]"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}