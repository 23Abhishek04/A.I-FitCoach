"use client";

import { useState } from "react";
import {
  Activity,
  ArrowLeft,
  Calculator,
  RotateCcw,
  Scale,
  Ruler,
  HeartPulse,
} from "lucide-react";

export default function BMICalculatorPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);

  const calculateBMI = () => {
    const heightValue = Number(height);
    const weightValue = Number(weight);

    if (!heightValue || !weightValue || heightValue <= 0 || weightValue <= 0) {
      return;
    }

    const result =
      weightValue / Math.pow(heightValue / 100, 2);

    setBmi(Number(result.toFixed(2)));
  };

  const reset = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
  };

  const getCategory = () => {
    if (bmi === null) return null;

    if (bmi < 18.5) {
      return {
        label: "Underweight",
        color: "text-[#22AAFF]",
        bg: "bg-[#22AAFF]/10",
      };
    }

    if (bmi < 25) {
      return {
        label: "Normal",
        color: "text-[#16D66B]",
        bg: "bg-[#16D66B]/10",
      };
    }

    if (bmi < 30) {
      return {
        label: "Overweight",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
      };
    }

    return {
      label: "Obese",
      color: "text-red-400",
      bg: "bg-red-400/10",
    };
  };

  const category = getCategory();

  return (
    <main className="min-h-screen bg-[#080D17] text-white">

      {/* ================= HEADER ================= */}

      <header className="border-b border-[#293750] bg-[#0B1220]">

        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-5 sm:px-8">

          <div className="flex items-center gap-3">

            <a
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#293750] bg-[#131E32] text-[#9AA7BB] transition hover:text-white"
            >
              <ArrowLeft size={17} />
            </a>

            <div>

              <p className="text-xs text-[#6F8099]">
                Fitness Tools
              </p>

              <h1 className="text-xl font-bold sm:text-2xl">
                BMI Calculator
              </h1>

            </div>

          </div>


          <div className="hidden items-center gap-2 rounded-full bg-[#16D66B]/10 px-3 py-2 sm:flex">

            <span className="h-2 w-2 rounded-full bg-[#16D66B]" />

            <span className="text-xs font-medium text-[#16D66B]">
              AI Connected
            </span>

          </div>

        </div>

      </header>


      {/* ================= CONTENT ================= */}

      <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 sm:py-10">


        {/* INTRO */}

        <div className="max-w-2xl">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
              <Calculator size={21} />
            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-[#22AAFF]">
                Health Metric
              </p>

              <h2 className="text-2xl font-bold">
                Calculate Your BMI
              </h2>

            </div>

          </div>

          <p className="mt-4 text-sm leading-6 text-[#9AA7BB]">
            Enter your height and current weight to calculate your
            Body Mass Index and view your BMI category.
          </p>

        </div>


        {/* ================= GRID ================= */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">


          {/* ================= INPUT CARD ================= */}

          <section className="rounded-2xl border border-[#293750] bg-[#131E32] p-5 sm:p-7">

            <h3 className="text-lg font-bold">
              Your Measurements
            </h3>

            <p className="mt-1 text-xs text-[#6F8099]">
              Enter your current measurements.
            </p>


            <div className="mt-7 space-y-5">

              {/* Height */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#B9C5D6]">

                  <Ruler
                    size={15}
                    className="text-[#22AAFF]"
                  />

                  Height (cm)

                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 170"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#293750] bg-[#0D1524] px-4 text-sm text-white outline-none placeholder:text-[#53647D] transition focus:border-[#22AAFF] focus:ring-1 focus:ring-[#22AAFF]/20"
                />

              </div>


              {/* Weight */}

              <div>

                <label className="mb-2 flex items-center gap-2 text-xs font-medium text-[#B9C5D6]">

                  <Scale
                    size={15}
                    className="text-[#22AAFF]"
                  />

                  Weight (kg)

                </label>

                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-12 w-full rounded-xl border border-[#293750] bg-[#0D1524] px-4 text-sm text-white outline-none placeholder:text-[#53647D] transition focus:border-[#22AAFF] focus:ring-1 focus:ring-[#22AAFF]/20"
                />

              </div>


              {/* Buttons */}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                <button
                  onClick={calculateBMI}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#22AAFF] text-sm font-semibold text-white transition hover:bg-[#159BEA] active:scale-[0.99]"
                >
                  <Calculator size={17} />
                  Calculate BMI
                </button>

                <button
                  onClick={reset}
                  className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#293750] bg-[#0D1524] px-5 text-sm font-medium text-[#9AA7BB] transition hover:text-white"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

              </div>

            </div>

          </section>


          {/* ================= RESULT CARD ================= */}

          <section className="rounded-2xl border border-[#293750] bg-[#131E32] p-5 sm:p-7">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider text-[#6F8099]">
                  Your Result
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  Body Mass Index
                </h3>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
                <HeartPulse size={20} />
              </div>

            </div>


            {!bmi ? (

              /* Empty state */

              <div className="flex min-h-[290px] flex-col items-center justify-center text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0D1524] text-[#53647D]">

                  <Activity size={28} />

                </div>

                <h4 className="mt-5 font-semibold">
                  No BMI calculated yet
                </h4>

                <p className="mt-2 max-w-sm text-xs leading-5 text-[#6F8099]">
                  Enter your height and weight, then click
                  "Calculate BMI" to see your result.
                </p>

              </div>

            ) : (

              /* Result */

              <div className="mt-8">

                <div className="text-center">

                  <p className="text-6xl font-extrabold tracking-tight text-[#22AAFF]">
                    {bmi}
                  </p>

                  <p className="mt-2 text-xs text-[#6F8099]">
                    Body Mass Index
                  </p>

                </div>


                {/* Category */}

                {category && (
                  <div
                    className={`mx-auto mt-6 w-fit rounded-full px-5 py-2 ${category.bg}`}
                  >

                    <span
                      className={`text-sm font-semibold ${category.color}`}
                    >
                      {category.label}
                    </span>

                  </div>
                )}


                {/* BMI Scale */}

                <div className="mt-8">

                  <div className="flex h-3 overflow-hidden rounded-full">

                    <div className="w-[18%] bg-[#22AAFF]" />

                    <div className="w-[31%] bg-[#16D66B]" />

                    <div className="w-[25%] bg-yellow-400" />

                    <div className="w-[26%] bg-red-500" />

                  </div>


                  <div className="mt-2 flex justify-between text-[9px] text-[#6F8099]">

                    <span>
                      &lt; 18.5
                    </span>

                    <span>
                      18.5–24.9
                    </span>

                    <span>
                      25–29.9
                    </span>

                    <span>
                      30+
                    </span>

                  </div>

                </div>


                {/* Measurements */}

                <div className="mt-7 grid grid-cols-2 gap-3">

                  <ResultItem
                    label="Height"
                    value={`${height} cm`}
                  />

                  <ResultItem
                    label="Weight"
                    value={`${weight} kg`}
                  />

                </div>

              </div>

            )}

          </section>

        </div>


        {/* ================= BMI INFORMATION ================= */}

        <section className="mt-6 rounded-2xl border border-[#293750] bg-[#131E32] p-5 sm:p-7">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22AAFF]/10 text-[#22AAFF]">
              <Activity size={19} />
            </div>

            <div>

              <h3 className="font-bold">
                BMI Categories
              </h3>

              <p className="text-xs text-[#6F8099]">
                BMI ranges used by the calculator
              </p>

            </div>

          </div>


          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <CategoryCard
              title="Underweight"
              range="Below 18.5"
              color="blue"
            />

            <CategoryCard
              title="Normal"
              range="18.5 – 24.9"
              color="green"
            />

            <CategoryCard
              title="Overweight"
              range="25 – 29.9"
              color="yellow"
            />

            <CategoryCard
              title="Obese"
              range="30 or above"
              color="red"
            />

          </div>

        </section>


        {/* ================= NOTE ================= */}

        <p className="mt-6 text-center text-[10px] leading-5 text-[#53647D]">
          BMI is a general screening measurement and does not
          directly measure body fat or overall health.
        </p>

      </div>

    </main>
  );
}


/* ============================================================
   RESULT ITEM
============================================================ */

function ResultItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#293750] bg-[#0D1524] p-4">

      <p className="text-[10px] text-[#6F8099]">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-white">
        {value}
      </p>

    </div>
  );
}


/* ============================================================
   CATEGORY CARD
============================================================ */

function CategoryCard({
  title,
  range,
  color,
}: {
  title: string;
  range: string;
  color: "blue" | "green" | "yellow" | "red";
}) {
  const styles = {
    blue: {
      bg: "bg-[#22AAFF]/10",
      text: "text-[#22AAFF]",
      border: "border-[#22AAFF]/20",
    },
    green: {
      bg: "bg-[#16D66B]/10",
      text: "text-[#16D66B]",
      border: "border-[#16D66B]/20",
    },
    yellow: {
      bg: "bg-yellow-400/10",
      text: "text-yellow-400",
      border: "border-yellow-400/20",
    },
    red: {
      bg: "bg-red-400/10",
      text: "text-red-400",
      border: "border-red-400/20",
    },
  };

  const style = styles[color];

  return (
    <div
      className={`rounded-xl border ${style.border} ${style.bg} p-4`}
    >

      <p className={`text-sm font-semibold ${style.text}`}>
        {title}
      </p>

      <p className="mt-2 text-xs text-[#9AA7BB]">
        {range}
      </p>

    </div>
  );
}