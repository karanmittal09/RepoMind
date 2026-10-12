
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: "Repomind helps developers understand code repositories",
    config: {
      outputDimensionality: 768,
    },
  });

  console.log("Embedding dimensions:", result.embeddings[0].values.length);
  console.log("First 5 values:", result.embeddings[0].values.slice(0, 5));
}

main().catch(console.error);
