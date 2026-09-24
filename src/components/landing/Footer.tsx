import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="about"
      className="border-t border-[#293750]/70 bg-[#070C15]"
    >

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">

        <div className="flex flex-col justify-between gap-8 md:flex-row">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#22AAFF] text-[#080D17]">
                <Dumbbell size={18} />
              </div>

              <span className="font-bold text-white">
                AI Fit<span className="text-[#22AAFF]">Coach</span>
              </span>

            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#6F8099]">
              Generative AI based personal fitness assistant
              for personalized fitness guidance and progress tracking.
            </p>

          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#9AA7BB]">

            <a href="#features" className="hover:text-white">
              Features
            </a>

            <a href="#how-it-works" className="hover:text-white">
              How It Works
            </a>

            <a href="#ai-coach" className="hover:text-white">
              AI Coach
            </a>

            <a href="/login" className="hover:text-white">
              Login
            </a>

          </div>

        </div>

        <div className="mt-10 border-t border-[#293750]/60 pt-6">

          <p className="text-xs text-[#6F8099]">
            © 2026 AI FitCoach. General fitness guidance only.
          </p>

        </div>

      </div>

    </footer>
  );
}