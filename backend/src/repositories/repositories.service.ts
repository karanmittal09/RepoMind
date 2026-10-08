import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RepositoriesService {
  constructor(private prisma: PrismaService) {}

  async findALL(){
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

    return this.prisma.repository.create({
      data: {
        userId: user.id,
        githubRepoId: data.githubRepoId,
        fullName: data.fullName,
        branch: data.branch ?? 'main',
      },
    });
  }
}
