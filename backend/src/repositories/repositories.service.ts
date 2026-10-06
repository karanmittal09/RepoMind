import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RepositoriesService {
  constructor(private prisma: PrismaService) {}

  async findALL(){
    return this.prisma.repository.findMany();
  }

  async create(data: {userId: string, githubRepoId: string, fullName: string, branch?: string}){
    return this.prisma.repository.create({ data, });
  }
}
