import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.embedContent({
    model: "gemini-embedding-exp-03-07",
    contents: "What is the meaning of life?",
    config: {
      outputDimensionality: 1536,
    },
  });

  console.log(response.embeddings);
}

main();
