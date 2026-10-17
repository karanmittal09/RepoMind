import { Body, Controller, Post } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';

@Controller('embeddings')
export class EmbeddingsController {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Post('test')
  async testEmbedding(@Body('text') text: string) {
    if (!text || !text.trim()) {
      return { error: 'Please provide text' };
    }

    const values = await this.embeddingsService.generateEmbedding(text);

    return {
      dimensions: values.length,
      firstFiveValues: values.slice(0, 5),
    };
  }
}
