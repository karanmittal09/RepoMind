
import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { VectorService } from '../vector/vector.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SearchService {
  constructor(
    private embeddingsService: EmbeddingsService,
    private vectorService: VectorService,
    private prisma: PrismaService,
  ) {}

  async searchCode(
    repositoryId: string,
    question: string,
    topK = 5,
  ) {
    const values =
      await this.embeddingsService.generateEmbedding(question);

    const matches = await this.vectorService.searchVectors(
      repositoryId,
      values,
      topK,
    );

    return Promise.all(
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
  }
}
