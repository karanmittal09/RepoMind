import { Controller, Get } from '@nestjs/common';
import { VectorService } from './vector.service';

@Controller('vector')
export class VectorController {
  constructor(private vectorService: VectorService) {}

  @Get('stats')
  getStats() {
    return this.vectorService.getIndexStats();
  }
}