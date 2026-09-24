"use client";

import { Menu, X, Dumbbell } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#293750]/70 bg-[#080D17]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22AAFF] text-[#080D17]">
            <Dumbbell size={21} strokeWidth={2.5} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              AI Fit<span className="text-[#22AAFF]">Coach</span>
            </h1>

            <p className="hidden text-[10px] text-[#6F8099] sm:block">
              PERSONAL AI FITNESS ASSISTANT
            </p>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-[#9AA7BB] transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm text-[#9AA7BB] transition hover:text-white"
          >
            How It Works
          </a>

          <a
            href="#ai-coach"
            className="text-sm text-[#9AA7BB] transition hover:text-white"
          >
            AI Coach
          </a>

          <a
            href="#about"
            className="text-sm text-[#9AA7BB] transition hover:text-white"
          >
            About
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/login"
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#9AA7BB] transition hover:text-white"
          >
            Login
          </a>

          <a
            href="/register"
            className="rounded-xl bg-[#22AAFF] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#22AAFF]/10 transition hover:bg-[#159BEA]"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#293750] bg-[#131E32] text-white md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-[#293750] bg-[#0B1220] px-5 py-5 md:hidden">

          <nav className="flex flex-col gap-2">

            <a
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-[#9AA7BB] hover:bg-[#131E32] hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-[#9AA7BB] hover:bg-[#131E32] hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#ai-coach"
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-3 text-sm text-[#9AA7BB] hover:bg-[#131E32] hover:text-white"
            >
              AI Coach
            </a>

            <a
              href="/login"
              className="mt-2 rounded-xl border border-[#293750] px-4 py-3 text-center text-sm text-white"
            >
              Login
            </a>

            <a
              href="/register"
              className="rounded-xl bg-[#22AAFF] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Get Started
            </a>

          </nav>
        </div>
      )}
    </header>
  );
}