import {
  Bot,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function AISection() {
  return (
    <section id="ai-coach" className="py-24 sm:py-28">

      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-3xl border border-[#293750] bg-[#131E32]">

          <div className="grid items-center lg:grid-cols-2">

            {/* Content */}
            <div className="p-7 sm:p-10 lg:p-14">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
                <Bot size={24} />
              </div>

              <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[#22AAFF]">
                AI Coach
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Your fitness questions,
                <span className="text-[#22AAFF]"> answered.</span>
              </h2>

              <p className="mt-5 leading-7 text-[#9AA7BB]">
                Ask AI FitCoach about workouts, exercise routines,
                healthy habits or your fitness progress and receive
                guidance based on your profile.
              </p>

              <a
                href="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#22AAFF] px-5 py-3 text-sm font-semibold text-white hover:bg-[#159BEA]"
              >
                Try AI Coach
                <ArrowRight size={16} />
              </a>

            </div>

            {/* Chat preview */}
            <div className="border-t border-[#293750] bg-[#0D1524] p-6 lg:border-l lg:border-t-0 lg:p-10">

              <div className="rounded-2xl border border-[#293750] bg-[#131E32] p-5">

                <div className="flex items-center gap-3 border-b border-[#293750] pb-4">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#22AAFF] text-white">
                    <Bot size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      AI FitCoach
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#16D66B]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16D66B]" />
                      Online
                    </div>
                  </div>

                </div>

                <div className="space-y-4 py-5">

                  <div className="rounded-2xl rounded-tl-md bg-[#0D1524] p-4">
                    <p className="text-xs leading-5 text-[#9AA7BB]">
                      Hi! I'm your AI fitness coach. What would
                      you like help with today?
                    </p>
                  </div>

                  <div className="ml-8 rounded-2xl rounded-tr-md bg-[#22AAFF] p-4">
                    <p className="text-xs leading-5 text-white">
                      Can you create a workout for today?
                    </p>
                  </div>

                  <div className="rounded-2xl rounded-tl-md bg-[#0D1524] p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-[#22AAFF]" />
                      <p className="text-xs font-semibold text-white">
                        Creating your plan...
                      </p>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-[#9AA7BB]">
                      I'll personalize it according to your goal
                      and current activity level.
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-2 rounded-xl border border-[#293750] bg-[#0D1524] p-3">

                  <MessageCircle
                    size={16}
                    className="text-[#6F8099]"
                  />

                  <span className="text-xs text-[#6F8099]">
                    Ask your fitness coach...
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}