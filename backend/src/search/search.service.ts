
import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';
import { PrismaService } from '../prisma.service';
import { LlmService } from 'src/llm/llm.service';

@Injectable()
export class SearchService {
  constructor(
    private embeddingsService: EmbeddingsService,
    private vectorService: VectorService,
    private prisma: PrismaService,
    private llmService: LlmService
  ) {}

  
  async searchCode(repositoryId: string, question: string, topK = 5) {
    const values = await this.embeddingsService.generateEmbedding(question);

    const matches = await this.vectorService.searchVectors(
      repositoryId,
      values,
      topK,
    );

    const results = await Promise.all(
      matches.map(async (match) => {
        const chunk = await this.prisma.codeChunk.findFirst({
          where: {
            repositoryId,
            filePath: String(match.filePath),
            chunkIndex: match.chunkIndex,
          },
        });

        return {
          ...match,
          content: chunk?.content ?? null,
        };
      }),
    );

    const context = results
      .filter((result) => result.content !== null)
      .map(
        (result) =>
          `File: ${result.filePath}
   Lines: ${result.startLine}-${result.endLine}
   Similarity: ${result.score}

  Code:
   ${result.content}`,
      )
      .join('\n\n---\n\n');

    const answer = await this.llmService.generateAnswer(question, context);

    return {
      question,
      answer,
      resultCount: results.length,
      sources: results.map((result) => ({
        filePath: result.filePath,
        startLine: result.startLine,
        endLine: result.endLine,
        score: result.score,
      })),
      results,
    };
  }

}
