import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-40 sm:pb-28">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-20 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#22AAFF]/[0.07] blur-[130px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

          {/* Left */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#22AAFF]/20 bg-[#22AAFF]/[0.08] px-4 py-2 text-xs font-medium text-[#22AAFF]">
              <Sparkles size={14} />
              GENERATIVE AI FITNESS ASSISTANT
            </div>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-6xl lg:text-[72px]">

              Your fitness.
              <br />

              <span className="text-[#22AAFF]">
                Smarter with AI.
              </span>

            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#9AA7BB] sm:text-lg">
              AI FitCoach creates personalized workout plans, nutrition
              suggestions and fitness guidance based on your goals,
              activity level and progress.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22AAFF] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#22AAFF]/10 transition hover:bg-[#159BEA]"
              >
                Start Your Journey
                <ArrowRight size={17} />
              </a>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-[#293750] bg-[#131E32] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-[#22AAFF]/40 hover:bg-[#17243A]"
              >
                Explore Features
              </a>

            </div>

            {/* Trust points */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">

              <div className="flex items-center gap-2 text-xs text-[#9AA7BB]">
                <CheckCircle2 size={15} className="text-[#16D66B]" />
                Personalized plans
              </div>

              <div className="flex items-center gap-2 text-xs text-[#9AA7BB]">
                <CheckCircle2 size={15} className="text-[#16D66B]" />
                AI-powered guidance
              </div>

              <div className="flex items-center gap-2 text-xs text-[#9AA7BB]">
                <CheckCircle2 size={15} className="text-[#16D66B]" />
                Progress tracking
              </div>

            </div>

          </div>

          {/* Right Dashboard Preview */}
          <div className="relative">

            <div className="absolute -inset-5 rounded-[32px] bg-[#22AAFF]/5 blur-3xl" />

            <div className="relative rounded-3xl border border-[#293750] bg-[#131E32] p-3 shadow-2xl">

              <div className="rounded-2xl border border-[#293750]/80 bg-[#0D1524] p-5 sm:p-6">

                {/* Top bar */}
                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs text-[#6F8099]">
                      AI FITCOACH
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      Fitness Overview
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-[#16D66B]/20 bg-[#16D66B]/10 px-3 py-1.5 text-[11px] text-[#16D66B]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16D66B]" />
                    AI Connected
                  </div>

                </div>

                {/* Greeting */}
                <div className="mt-7">

                  <p className="text-xs text-[#6F8099]">
                    Good morning
                  </p>

                  <h3 className="mt-1 text-2xl font-bold text-white">
                    Welcome back, Abhishek 👋
                  </h3>

                </div>

                {/* Metrics */}
                <div className="mt-6 grid grid-cols-2 gap-3">

                  <Metric
                    title="Current Weight"
                    value="70.0 kg"
                    detail="Starting: 70 kg"
                  />

                  <Metric
                    title="Target Weight"
                    value="65.0 kg"
                    detail="Goal: Weight Loss"
                  />

                  <Metric
                    title="BMI"
                    value="24.22"
                    detail="Category: Normal"
                    highlight
                  />

                  <Metric
                    title="Workout"
                    value="Pending"
                    detail="Today's Session"
                  />

                </div>

                {/* AI recommendation */}
                <div className="mt-3 rounded-2xl border border-[#293750] bg-[#131E32] p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
                      <Bot size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        AI Recommendation
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#9AA7BB]">
                        Stay consistent today. Complete your planned
                        workout and keep your hydration on track.
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

function Metric({
  title,
  value,
  detail,
  highlight = false,
}: {
  title: string;
  value: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#293750] bg-[#131E32] p-4">

      <p className="text-[10px] font-medium uppercase tracking-wider text-[#6F8099]">
        {title}
      </p>

      <p
        className={`mt-3 text-xl font-bold ${
          highlight ? "text-[#16D66B]" : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-[10px] text-[#22AAFF]">
        {detail}
      </p>

    </div>
  );
}