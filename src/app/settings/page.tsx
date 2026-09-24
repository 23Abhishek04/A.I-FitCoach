"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Settings,
  KeyRound,
  User,
  Bell,
  Shield,
  Palette,
  LogOut,
  Eye,
  EyeOff,
  Check,
  Save,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [dailyTips, setDailyTips] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);

  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#080D17] text-[#F5F7FA]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-[#293750] bg-[#080D17]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
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
                Settings
              </h1>

              <p className="text-xs text-[#6F8099]">
                Manage your AI FitCoach preferences
              </p>
            </div>
          </div>

          <Settings size={20} className="text-[#6F8099]" />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:py-7">
        {/* Account */}
        <SettingsSection
          icon={<User size={19} />}
          title="Account"
          description="Manage your account information"
        >
          <SettingRow
            title="Profile"
            description="Update your personal and fitness information"
            action={
              <button
                onClick={() => (window.location.href = "/profile")}
                className="flex items-center gap-1 rounded-lg border border-[#293750] bg-[#0D1524] px-3 py-2 text-xs font-medium text-[#9AA7BB] transition hover:border-[#22AAFF] hover:text-[#22AAFF]"
              >
                Open
                <ChevronRight size={14} />
              </button>
            }
          />

          <SettingRow
            title="Username"
            description="abhishek"
            action={
              <span className="text-xs text-[#52627A]">
                Account
              </span>
            }
          />

          <SettingRow
            title="Email"
            description="Your registered email address"
            action={
              <span className="text-xs text-[#52627A]">
                Account
              </span>
            }
          />
        </SettingsSection>

        {/* Gemini API */}
        <SettingsSection
          icon={<KeyRound size={19} />}
          title="Gemini API"
          description="Connect your Google Gemini API for AI-powered features"
        >
          <div className="rounded-xl border border-[#293750] bg-[#0D1524] p-4 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">
                  Gemini API Key
                </p>

                <p className="mt-1 text-xs leading-5 text-[#6F8099]">
                  Your API key is used to power the workout, diet and
                  fitness chatbot features.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#16D66B]/20 bg-[#16D66B]/10 px-2.5 py-1 text-[10px] text-[#16D66B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16D66B]" />
                Connected
              </div>
            </div>

            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter Gemini API key"
                className="w-full rounded-xl border border-[#293750] bg-[#131E32] px-4 py-3 pr-12 text-sm text-white outline-none placeholder:text-[#52627A] focus:border-[#22AAFF]"
              />

              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F8099] transition hover:text-white"
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[11px] leading-5 text-[#52627A]">
                Never share your API key publicly or commit it to
                GitHub.
              </p>

              <button
                onClick={saveSettings}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#22AAFF] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1698E8]"
              >
                <Save size={15} />
                Save API Key
              </button>
            </div>
          </div>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          icon={<Bell size={19} />}
          title="Notifications"
          description="Choose which reminders you want to receive"
        >
          <ToggleRow
            title="Notifications"
            description="Enable fitness-related notifications"
            enabled={notifications}
            onChange={() => setNotifications(!notifications)}
          />

          <ToggleRow
            title="Daily Fitness Tips"
            description="Receive your daily fitness tip"
            enabled={dailyTips}
            onChange={() => setDailyTips(!dailyTips)}
          />

          <ToggleRow
            title="Workout Reminders"
            description="Get reminders about your planned workouts"
            enabled={workoutReminders}
            onChange={() =>
              setWorkoutReminders(!workoutReminders)
            }
          />
        </SettingsSection>

        {/* Appearance */}
        <SettingsSection
          icon={<Palette size={19} />}
          title="Appearance"
          description="Customize your AI FitCoach experience"
        >
          <SettingRow
            title="Theme"
            description="Dark mode"
            action={
              <div className="rounded-lg border border-[#22AAFF]/30 bg-[#22AAFF]/10 px-3 py-2 text-xs font-medium text-[#22AAFF]">
                Dark
              </div>
            }
          />

          <SettingRow
            title="Interface"
            description="AI FitCoach dark interface"
            action={
              <span className="text-xs text-[#16D66B]">
                Active
              </span>
            }
          />
        </SettingsSection>

        {/* Privacy */}
        <SettingsSection
          icon={<Shield size={19} />}
          title="Privacy & Security"
          description="Manage your data and account security"
        >
          <SettingRow
            title="Password"
            description="Keep your account secure"
            action={
              <button className="rounded-lg border border-[#293750] bg-[#0D1524] px-3 py-2 text-xs text-[#9AA7BB] transition hover:border-[#22AAFF] hover:text-[#22AAFF]">
                Change
              </button>
            }
          />

          <SettingRow
            title="Fitness Data"
            description="Your profile, progress and fitness information"
            action={
              <span className="flex items-center gap-1.5 text-xs text-[#16D66B]">
                <Check size={14} />
                Protected
              </span>
            }
          />
        </SettingsSection>

        {/* Save notification */}
        {saved && (
          <div className="fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-[#16D66B]/30 bg-[#131E32] px-4 py-3 text-sm text-[#16D66B] shadow-xl">
            <Check size={17} />
            Settings saved successfully
          </div>
        )}

        {/* Logout */}
        <section className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Sign Out</h2>
              <p className="mt-1 text-xs leading-5 text-[#6F8099]">
                Sign out of your AI FitCoach account on this device.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </section>

        <p className="pb-5 pt-6 text-center text-[10px] text-[#52627A] sm:text-xs">
          AI FitCoach • Personal Fitness Assistant
        </p>
      </div>
    </main>
  );
}

/* --------------------------------
   Settings Section
--------------------------------- */

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5 overflow-hidden rounded-2xl border border-[#293750] bg-[#131E32]">
      <div className="flex items-center gap-3 border-b border-[#293750] p-4 sm:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
          {icon}
        </div>

        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-[#6F8099]">
            {description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-[#293750] px-4 sm:px-5">
        {children}
      </div>
    </section>
  );
}

/* --------------------------------
   Setting Row
--------------------------------- */

function SettingRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-5 text-[#6F8099]">
          {description}
        </p>
      </div>

      <div className="shrink-0">{action}</div>
    </div>
  );
}

/* --------------------------------
   Toggle
--------------------------------- */

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-1 text-xs leading-5 text-[#6F8099]">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-[#22AAFF]" : "bg-[#293750]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}