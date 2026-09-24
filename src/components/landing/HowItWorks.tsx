import {
  UserRound,
  Target,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserRound,
    title: "Create Your Profile",
    description:
      "Enter your age, height, weight, activity level and basic fitness information.",
  },
  {
    number: "02",
    icon: Target,
    title: "Choose Your Goal",
    description:
      "Select your fitness goal such as weight loss, muscle gain or general fitness.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Generate Your Plan",
    description:
      "Generative AI creates personalized workout and nutrition recommendations.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Track Your Progress",
    description:
      "Record your progress and receive updated recommendations based on your data.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-28">

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="text-center">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22AAFF]">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            From your profile to your plan.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#9AA7BB]">
            AI FitCoach uses your personal fitness information and
            goals to generate personalized guidance.
          </p>

        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-[#293750] bg-[#131E32] p-6"
              >

                <div className="flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
                    <Icon size={20} />
                  </div>

                  <span className="text-3xl font-bold text-[#293750]">
                    {step.number}
                  </span>

                </div>

                <h3 className="mt-7 font-bold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#9AA7BB]">
                  {step.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}