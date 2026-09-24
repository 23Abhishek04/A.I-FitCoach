import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProgressEntry from "@/models/ProgressEntry";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    const entries = await ProgressEntry.find({
      email: email.toLowerCase().trim(),
    })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      entries,
    });
  } catch (error) {
    console.error("Progress GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load progress",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      email,
      date,
      weight,
      water,
      workout,
      calories,
      note,
    } = body;

    if (!email || !date) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and date are required",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email)
      .toLowerCase()
      .trim();

    const parsedWeight =
      weight === null ||
      weight === undefined ||
      weight === ""
        ? null
        : Number(weight);

    const parsedWater =
      water === null ||
      water === undefined ||
      water === ""
        ? 0
        : Number(water);

    const parsedCalories =
      calories === null ||
      calories === undefined ||
      calories === ""
        ? null
        : Number(calories);

    if (
      parsedWeight !== null &&
      (!Number.isFinite(parsedWeight) ||
        parsedWeight <= 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid weight",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(parsedWater) ||
      parsedWater < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid water intake",
        },
        { status: 400 }
      );
    }

    const validWorkouts = [
      "Completed",
      "Rest Day",
      "Skipped",
    ];

    const safeWorkout = validWorkouts.includes(workout)
      ? workout
      : "Completed";

    await ProgressEntry.findOneAndUpdate(
      {
        email: normalizedEmail,
        date: String(date),
      },
      {
        $set: {
          weight: parsedWeight,
          water: parsedWater,
          workout: safeWorkout,
          calories: parsedCalories,
          note: String(note || ""),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    const entries = await ProgressEntry.find({
      email: normalizedEmail,
    })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      message: "Progress saved successfully",
      entries,
    });
  } catch (error) {
    console.error("Progress POST error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save progress",
      },
      { status: 500 }
    );
  }
}
