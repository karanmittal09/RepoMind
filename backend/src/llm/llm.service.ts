
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class LlmService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateAnswer(question: string, context: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `
You are RepoMind, an assistant that answers questions about source code.

Answer the user's question using only the provided code context.
If the context does not contain enough information, say so.
Do not invent files, functions, or implementation details.
Mention relevant file paths and line ranges when available.

Question:
${question}

Code context:
${context}
`,
      });

      return response.text ?? 'No answer was generated.';
    } catch (error){
       console.error('Gemini generation error:', error);
      throw new InternalServerErrorException(
        'Failed to generate an answer',
      );
    }
  }
}
