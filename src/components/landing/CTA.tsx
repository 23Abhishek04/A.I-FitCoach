import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="px-5 py-24 sm:px-6 sm:py-28">

      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[#293750] bg-[#131E32] px-6 py-16 text-center sm:px-10">

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
          <Sparkles size={23} />
        </div>

        <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
          Start building your
          <span className="text-[#22AAFF]"> better routine.</span>
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-[#9AA7BB]">
          Create your fitness profile and let AI FitCoach
          personalize your fitness journey.
        </p>

        <a
          href="/register"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#22AAFF] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#159BEA]"
        >
          Create Your Profile
          <ArrowRight size={17} />
        </a>

      </div>

    </section>
  );
}