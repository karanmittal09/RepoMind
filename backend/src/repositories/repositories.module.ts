import { Module } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { RepositoriesController } from './repositories.controller';
import { PrismaService } from 'src/prisma.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'repository-ingestion',
    })
  ],
  providers: [RepositoriesService, PrismaService],
  controllers: [RepositoriesController]
})
export class RepositoriesModule {}
