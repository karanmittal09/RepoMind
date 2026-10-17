import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Post()
  async search(
    @Body()
    body: {
      repositoryId: string;
      question: string;
      topK?: number;
    },
  ) {
    if (
      !body.repositoryId?.trim() ||
      !body.question?.trim()
    ) {
      throw new BadRequestException(
        'repositoryId and question are required',
      );
    }

    const topK = body.topK ?? 5;

    if (!Number.isInteger(topK) || topK < 1 || topK > 20) {
      throw new BadRequestException(
        'topK must be an integer between 1 and 20',
      );
    }

    const results = await this.searchService.searchCode(
      body.repositoryId,
      body.question,
      topK,
    );

    return {
      question: body.question,
      resultCount: results.length,
      results,
    };
  }
}
