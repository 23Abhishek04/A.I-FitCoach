import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const models = [
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
];

export async function generateGeminiResponse(prompt: string) {
  let lastError: unknown = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(
          `Trying Gemini model: ${model}, attempt ${attempt + 1}`
        );

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        const text = response.text ?? "";

        if (!text) {
          throw new Error("Gemini returned an empty response");
        }

        console.log(`Gemini success: ${model}`);

        return text;
      } catch (error) {
        lastError = error;

        const errorMessage =
          error instanceof Error
            ? error.message
            : String(error);

        console.error(
          `Gemini ${model} failed:`,
          errorMessage
        );

        const isTemporaryError =
          errorMessage.includes("503") ||
          errorMessage.includes("UNAVAILABLE") ||
          errorMessage.includes("429") ||
          errorMessage.includes("RESOURCE_EXHAUSTED") ||
          errorMessage.includes("500") ||
          errorMessage.includes("502") ||
          errorMessage.includes("504");

        if (!isTemporaryError) {
          throw error;
        }

        if (attempt === 0) {
          await sleep(2000);
        }
      }
    }

    console.log(
      `Switching from ${model} to next Gemini model...`
    );
  }

  throw (
    lastError ??
    new Error("All Gemini models failed")
  );
}