import { NextRequest, NextResponse } from "next/server";
import { generateGeminiResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, data } = body;

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    if (!type || !data) {
      return NextResponse.json(
        {
          success: false,
          error: "Type and data are required",
        },
        {
          status: 400,
        }
      );
    }

    let prompt = "";

    // =========================================================
    // WORKOUT
    // =========================================================

    if (type === "workout") {
      prompt = `
You are AI FitCoach, an AI personal fitness assistant.

Create a personalized workout plan using the information below.

Goal: ${data.goal}
Fitness Level: ${data.level}
Workout Duration: ${data.duration} minutes

Return ONLY valid JSON.

Do NOT use:
- Markdown
- Code fences
- Explanations outside the JSON
- Comments

Return EXACTLY this structure:

{
  "goal": "string",
  "duration": 60,
  "estimatedCalories": 300,
  "exercises": [
    {
      "name": "string",
      "sets": 3,
      "reps": "12",
      "rest": "60 sec"
    }
  ],
  "recommendation": "string"
}

Requirements:
- Create a realistic workout that fits the requested duration.
- Match the exercises to the fitness level.
- Include appropriate warm-up and cooldown.
- Include a reasonable number of exercises.
- Keep estimatedCalories as a number.
- Keep duration as a number.
- Keep sets as a number.
- Keep reps and rest as strings.
- Do not make medical claims.
- Do not prescribe medication.
`;
    }

    // =========================================================
    // DIET
    // =========================================================

    else if (type === "diet") {
      prompt = `
You are AI FitCoach, an AI nutrition assistant.

Create a practical personalized daily meal plan.

USER INFORMATION:

Goal: ${data.goal}
Diet Type: ${data.dietType}
Daily Calories: ${data.calories}

IMPORTANT:
Return ONLY valid JSON.

Do NOT return:
- Markdown
- Code fences
- \`\`\`json
- Explanations outside JSON
- Comments

Return EXACTLY this structure:

{
  "goal": "${data.goal}",
  "dietType": "${data.dietType}",
  "dailyCalories": ${Number(data.calories)},
  "meals": [
    {
      "name": "Breakfast",
      "time": "08:00 AM",
      "calories": 400,
      "protein": 25,
      "foods": [
        "Food item 1",
        "Food item 2",
        "Food item 3"
      ]
    },
    {
      "name": "Lunch",
      "time": "01:00 PM",
      "calories": 550,
      "protein": 30,
      "foods": [
        "Food item 1",
        "Food item 2",
        "Food item 3"
      ]
    },
    {
      "name": "Evening Snack",
      "time": "05:00 PM",
      "calories": 200,
      "protein": 15,
      "foods": [
        "Food item 1",
        "Food item 2"
      ]
    },
    {
      "name": "Dinner",
      "time": "08:00 PM",
      "calories": 500,
      "protein": 30,
      "foods": [
        "Food item 1",
        "Food item 2",
        "Food item 3"
      ]
    }
  ],
  "recommendation": "string"
}

STRICT REQUIREMENTS:

1. Return exactly 4 meals:
   - Breakfast
   - Lunch
   - Evening Snack
   - Dinner

2. "dailyCalories" MUST be a number.

3. "calories" MUST be a number for every meal.

4. "protein" MUST be a number representing grams.

5. "foods" MUST be an array of strings.

6. Keep the combined meal calories reasonably close to the requested daily calorie target.

7. Respect the selected diet type:

Balanced:
- Include a balanced combination of protein, carbohydrates, vegetables and healthy fats.

Vegetarian:
- Do not include meat or fish.
- Eggs and dairy may be used unless the user specifies otherwise.

High Protein:
- Prioritize protein-rich foods.

Low Carb:
- Keep carbohydrates relatively low.
- Prioritize protein, vegetables and healthy fats.

Vegan:
- Do not include meat, fish, eggs or dairy.
- Use plant-based protein sources.

8. Respect the fitness goal.

Weight Loss:
- Use filling, nutrient-dense meals with controlled calories.

Muscle Gain:
- Prioritize adequate protein and energy intake.

Maintain Weight:
- Provide balanced meals around the requested calorie target.

General Fitness:
- Provide balanced nutrition with adequate protein and micronutrient-rich foods.

9. Use practical foods that are commonly available.

10. Do not provide medical treatment.

11. Do not diagnose medical conditions.

12. Do not prescribe medication.

13. Do not use markdown.

14. Return ONLY the JSON object.
`;
    }

    // =========================================================
    // CHAT
    // =========================================================

    else if (type === "chat") {
      prompt = `
You are AI FitCoach, a personal fitness assistant.

Answer the user's fitness question clearly, practically and concisely.

User question:
${data.message}

Guidelines:
- Give practical fitness and lifestyle guidance.
- Keep the response concise.
- Do not diagnose medical conditions.
- Do not prescribe medication.
- Do not make unsupported medical claims.
- If the question requires medical diagnosis or treatment, recommend consulting an appropriate healthcare professional.
`;
    }

    // =========================================================
    // INVALID TYPE
    // =========================================================

    else {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported AI type",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // GEMINI
    // =========================================================

    const response = await generateGeminiResponse(prompt);

    if (!response) {
      return NextResponse.json(
        {
          success: false,
          error: "Gemini returned an empty response",
        },
        {
          status: 500,
        }
      );
    }

    // =========================================================
    // CLEAN RESPONSE
    // =========================================================

    let cleanedResponse = response.trim();

    // Remove markdown code fences if Gemini adds them
    cleanedResponse = cleanedResponse
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // =========================================================
    // VALIDATE JSON FOR WORKOUT + DIET
    // =========================================================

    if (type === "workout" || type === "diet") {
      try {
        const parsed = JSON.parse(cleanedResponse);

        // -----------------------------------------------
        // DIET VALIDATION
        // -----------------------------------------------

        if (type === "diet") {
          if (
            !parsed.goal ||
            !parsed.dietType ||
            typeof parsed.dailyCalories !== "number" ||
            !Array.isArray(parsed.meals) ||
            parsed.meals.length === 0 ||
            !parsed.recommendation
          ) {
            throw new Error(
              "Invalid diet response structure"
            );
          }

          for (const meal of parsed.meals) {
            if (
              !meal.name ||
              !meal.time ||
              typeof meal.calories !== "number" ||
              typeof meal.protein !== "number" ||
              !Array.isArray(meal.foods)
            ) {
              throw new Error(
                "Invalid meal structure"
              );
            }
          }
        }

        // -----------------------------------------------
        // WORKOUT VALIDATION
        // -----------------------------------------------

        if (type === "workout") {
          if (
            !parsed.goal ||
            typeof parsed.duration !== "number" ||
            typeof parsed.estimatedCalories !== "number" ||
            !Array.isArray(parsed.exercises) ||
            parsed.exercises.length === 0 ||
            !parsed.recommendation
          ) {
            throw new Error(
              "Invalid workout response structure"
            );
          }

          for (const exercise of parsed.exercises) {
            if (
              !exercise.name ||
              typeof exercise.sets !== "number" ||
              !exercise.reps ||
              !exercise.rest
            ) {
              throw new Error(
                "Invalid exercise structure"
              );
            }
          }
        }

        // Return normalized JSON
        return NextResponse.json({
          success: true,
          response: JSON.stringify(parsed),
        });
      } catch (validationError) {
        console.error(
          "Invalid Gemini JSON:",
          validationError
        );

        console.error(
          "Gemini response:",
          cleanedResponse
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "AI returned an invalid response format. Please try again.",
          },
          {
            status: 502,
          }
        );
      }
    }

    // =========================================================
    // CHAT RESPONSE
    // =========================================================

    return NextResponse.json({
      success: true,
      response: cleanedResponse,
    });
} catch (error) {
  console.error("AI API error:", error);

  return NextResponse.json(
    {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown AI API error",
    },
    { status: 500 }
  );
}
}