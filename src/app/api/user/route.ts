import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      name,
      email,
      password,
      age,
      gender,
      height,
      weight,
      targetWeight,
      fitnessGoal,
      activity,
      fitnessLevel,
      dietType,
      dailyCalories,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Name and email are required",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email)
      .toLowerCase()
      .trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    /*
     * ============================================================
     * EXISTING USER
     * Used by Profile page to update fitness information.
     * Password is NOT required here.
     * ============================================================
     */

    if (existingUser) {
      existingUser.name = String(name).trim();

      if (age !== undefined) {
        existingUser.age =
          age === "" || age === null ? null : Number(age);
      }

      if (gender !== undefined) {
        existingUser.gender = String(gender);
      }

      if (height !== undefined) {
        existingUser.height =
          height === "" || height === null
            ? null
            : Number(height);
      }

      if (weight !== undefined) {
        existingUser.weight =
          weight === "" || weight === null
            ? null
            : Number(weight);
      }

      if (targetWeight !== undefined) {
        existingUser.targetWeight =
          targetWeight === "" || targetWeight === null
            ? null
            : Number(targetWeight);
      }

      if (fitnessGoal !== undefined) {
        existingUser.fitnessGoal =
          String(fitnessGoal);
      }

      if (activity !== undefined) {
        existingUser.activity =
          String(activity);
      }

      if (fitnessLevel !== undefined) {
        existingUser.fitnessLevel =
          String(fitnessLevel);
      }

      if (dietType !== undefined) {
        existingUser.dietType =
          String(dietType);
      }

      if (dailyCalories !== undefined) {
        existingUser.dailyCalories =
          dailyCalories === "" || dailyCalories === null
            ? 2000
            : Number(dailyCalories);
      }

      /*
       * Only change password if one was explicitly supplied.
       */
      if (password) {
        if (String(password).length < 6) {
          return NextResponse.json(
            {
              success: false,
              error:
                "Password must be at least 6 characters",
            },
            { status: 400 }
          );
        }

        existingUser.password = await bcrypt.hash(
          String(password),
          12
        );
      }

      await existingUser.save();

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          age: existingUser.age,
          gender: existingUser.gender,
          height: existingUser.height,
          weight: existingUser.weight,
          targetWeight: existingUser.targetWeight,
          fitnessGoal: existingUser.fitnessGoal,
          activity: existingUser.activity,
          fitnessLevel: existingUser.fitnessLevel,
          dietType: existingUser.dietType,
          dailyCalories: existingUser.dailyCalories,
        },
      });
    }

    /*
     * ============================================================
     * NEW USER
     * Registration requires a password.
     * ============================================================
     */

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password is required when creating a new account",
        },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password must be at least 6 characters",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      String(password),
      12
    );

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,

      age:
        age === "" || age === undefined || age === null
          ? null
          : Number(age),

      gender: gender || "",

      height:
        height === "" || height === undefined || height === null
          ? null
          : Number(height),

      weight:
        weight === "" || weight === undefined || weight === null
          ? null
          : Number(weight),

      targetWeight:
        targetWeight === "" ||
        targetWeight === undefined ||
        targetWeight === null
          ? null
          : Number(targetWeight),

      fitnessGoal:
        fitnessGoal || "General Fitness",

      activity:
        activity || "Moderately Active",

      fitnessLevel:
        fitnessLevel || "Beginner",

      dietType:
        dietType || "Balanced",

      dailyCalories:
        dailyCalories === "" ||
        dailyCalories === undefined ||
        dailyCalories === null
          ? 2000
          : Number(dailyCalories),
    });

    console.log("USER CREATED:", {
      id: user._id.toString(),
      email: user.email,
      hasPassword: !!user.password,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          age: user.age,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          targetWeight: user.targetWeight,
          fitnessGoal: user.fitnessGoal,
          activity: user.activity,
          fitnessLevel: user.fitnessLevel,
          dietType: user.dietType,
          dailyCalories: user.dailyCalories,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("User API POST error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save user",
      },
      { status: 500 }
    );
  }
}


/*
 * ================================================================
 * GET USER
 * ================================================================
 */

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const email =
      request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    })
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("User API GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user",
      },
      { status: 500 }
    );
  }
}