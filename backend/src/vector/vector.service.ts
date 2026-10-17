import { Injectable } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class VectorService {
  private pinecone: Pinecone;
  private indexName: string;

  constructor() {
    const apiKey = process.env.PINECONE_API_KEY;
    const indexName = process.env.PINECONE_INDEX_NAME;

    if (!apiKey || !indexName) {
      throw new Error('Pinecone environment variables are missing');
    }

    this.pinecone = new Pinecone({ apiKey });
    this.indexName = indexName;
  }

  async getIndexStats() {
    const index = this.pinecone.index({
      name: this.indexName,
    });

    return index.describeIndexStats();
  }

  async upsertVector(
    id: string,
    values: number[],
    metadata: {
      repositoryId: string;
      filePath: string;
      language: string;
      startLine: number;
      endLine: number;
    },
  ) {
    if (values.length !== 768) {
      throw new Error(
        `Expected 768 dimensions, received ${values.length}`,
      );
    }

    const index = this.pinecone.index({
      name: this.indexName,
      namespace: metadata.repositoryId,
    });

    await index.upsert({
      records: [
        {
          id,
          values,
          metadata,
        },
      ],
    });
  }

  
  async searchVectors(
  repositoryId: string,
  values: number[],
  topK = 5,
  ) {
  if (values.length !== 768) {
    throw new Error(
      `Expected 768 dimensions, received ${values.length}`,
    );
  }

  const index = this.pinecone.index({
    name: this.indexName,
    namespace: repositoryId,
  });

  const result = await index.query({
    vector: values,
    topK,
    includeMetadata: true,
  });

  return result.matches?.map((match) => ({
    id: match.id,
    score: match.score,
    filePath: match.metadata?.filePath,
    language: match.metadata?.language,
    startLine: match.metadata?.startLine,
    endLine: match.metadata?.endLine,
    chunkIndex: Number(
      match.id.slice(match.id.lastIndexOf(':') + 1),
    ),
   })) ?? [];
  }

}