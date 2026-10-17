
import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { VectorModule } from '../vector/vector.module';
import { PrismaService } from 'src/prisma.service';
import { LlmModule } from 'src/llm/llm.module';

@Module({
  imports: [EmbeddingsModule, VectorModule, LlmModule],
  controllers: [SearchController],
  providers: [SearchService, PrismaService],
})
export class SearchModule {}
