import { Module } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { RepositoriesController } from './repositories.controller';
import { PrismaService } from 'src/prisma.service';
import { BullModule } from '@nestjs/bullmq';
import { RepositoryProcessor } from './repository.processor';
import { GithubModule } from 'src/github/github.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'repository-ingestion',
    }),
    GithubModule,
  ],
  providers: [RepositoriesService, PrismaService, RepositoryProcessor],
  controllers: [RepositoriesController]
})
export class RepositoriesModule {}
