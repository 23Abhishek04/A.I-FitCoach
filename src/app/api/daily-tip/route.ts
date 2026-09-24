import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const user = body?.user || {};

    const prompt = `
You are AI FitCoach, an AI-powered personal fitness assistant.

Generate ONE personalized daily fitness tip for the user below.

USER PROFILE:
Name: ${user.name || "User"}
Age: ${user.age ?? "Not provided"}
Gender: ${user.gender || "Not provided"}
Height: ${user.height ?? "Not provided"} cm
Current Weight: ${user.weight ?? "Not provided"} kg
Target Weight: ${user.targetWeight ?? "Not provided"} kg
Fitness Goal: ${user.fitnessGoal || "General Fitness"}
Activity Level: ${user.activity || "Moderately Active"}
Fitness Level: ${user.fitnessLevel || "Beginner"}
Diet Type: ${user.dietType || "Balanced"}
Daily Calories: ${user.dailyCalories || 2000} kcal

IMPORTANT:
- Make the recommendation relevant to the user's fitness goal.
- Consider their fitness level and activity level.
- Keep the recommendation practical and easy to follow.
- The tip can be about exercise, nutrition, hydration, recovery, sleep, mobility, or healthy habits.
- Do not diagnose medical conditions.
- Do not recommend dangerous or extreme exercise.
- Do not recommend starvation, extreme calorie restriction, dehydration, or unsafe supplements.
- Keep the language simple and motivating.
- Give only ONE main tip.

RETURN ONLY VALID JSON.

Use exactly this structure:

{
  "category": "NUTRITION",
  "title": "Short and useful title",
  "tip": "Write 2 to 4 sentences explaining the personalized fitness tip.",
  "action": "Write one specific action the user should take today."
}

The category must be one of:

EXERCISE
NUTRITION
HYDRATION
RECOVERY
SLEEP
MOBILITY
MINDSET
GENERAL FITNESS
`;

    /*
     * Gemini API request
     */
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        apiKey
      )}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],

          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 500,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();

    /*
     * Gemini API error
     */
    if (!response.ok) {
      console.error(
        "Gemini Daily Tip API Error:",
        data
      );

      return NextResponse.json(
        {
          success: false,
          error:
            data?.error?.message ||
            "Gemini API request failed.",
        },
        {
          status: response.status,
        }
      );
    }

    /*
     * Extract Gemini response
     */
    const generatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.error(
        "Gemini returned no text:",
        data
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Gemini returned an empty response.",
        },
        {
          status: 502,
        }
      );
    }

    /*
     * Parse JSON
     */
    let tip;

    try {
      tip = JSON.parse(generatedText);
    } catch {
      try {
        const cleanedText = generatedText
          .replace(/```json/gi, "")
          .replace(/```/g, "")
          .trim();

        tip = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error(
          "Failed to parse Gemini response:",
          generatedText,
          parseError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Gemini returned an invalid response format.",
          },
          {
            status: 502,
          }
        );
      }
    }

    /*
     * Validate response
     */
    if (
      !tip ||
      !tip.category ||
      !tip.title ||
      !tip.tip ||
      !tip.action
    ) {
      console.error(
        "Invalid tip structure:",
        tip
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Gemini returned an incomplete fitness tip.",
        },
        {
          status: 502,
        }
      );
    }

    /*
     * Return clean response
     */
    return NextResponse.json({
      success: true,

      tip: {
        category: String(tip.category),
        title: String(tip.title),
        tip: String(tip.tip),
        action: String(tip.action),
      },
    });
  } catch (error) {
    console.error(
      "Daily Fitness Tip API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate daily fitness tip.",
      },
      {
        status: 500,
      }
    );
  }
}