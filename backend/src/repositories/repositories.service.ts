import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RepositoriesService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('repository-ingestion')
    private repositoryQueue: Queue,
  ) {}

  async findAll() {
    return this.prisma.repository.findMany();
  }

  async create(data: {
    githubId: string;
    githubRepoId: string;
    fullName: string;
    branch?: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        githubId: data.githubId,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const repository = await this.prisma.repository.create({
      data: {
        userId: user.id,
        githubRepoId: data.githubRepoId,
        fullName: data.fullName,
        branch: data.branch ?? 'main',
      },
    });

    await this.repositoryQueue.add('ingest-repository', {
      repositoryId: repository.id,
    });

    return repository;
  }
}