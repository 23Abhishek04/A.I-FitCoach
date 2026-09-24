import {
  Activity,
  Apple,
  Bot,
  Calculator,
  Dumbbell,
  LineChart,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Dumbbell,
    title: "AI Workout Plans",
    description:
      "Generate personalized workout plans according to your fitness goal, activity level and profile.",
  },
  {
    icon: Apple,
    title: "Diet Suggestions",
    description:
      "Get practical meal suggestions designed around your selected fitness goal.",
  },
  {
    icon: Calculator,
    title: "BMI Calculator",
    description:
      "Calculate your BMI and view the corresponding BMI category.",
  },
  {
    icon: Bot,
    title: "AI Fitness Coach",
    description:
      "Ask fitness-related questions and receive AI-generated guidance.",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    description:
      "Track weight, activity and workout progress through your personal dashboard.",
  },
  {
    icon: Sparkles,
    title: "Personalized Insights",
    description:
      "Generate updated suggestions using your profile and progress information.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-y border-[#293750]/60 bg-[#0B1220] py-24 sm:py-28">

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="max-w-2xl">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#22AAFF]">
            Powerful Features
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to
            <span className="text-[#22AAFF]"> stay on track.</span>
          </h2>

          <p className="mt-5 leading-7 text-[#9AA7BB]">
            AI FitCoach combines personalized fitness guidance,
            nutrition suggestions and progress tracking into one
            intelligent platform.
          </p>

        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[#293750] bg-[#131E32] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#22AAFF]/40 hover:bg-[#17243A]"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF] transition group-hover:bg-[#22AAFF] group-hover:text-white">
                  <Icon size={21} />
                </div>

                <h3 className="mt-6 text-lg font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#9AA7BB]">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}