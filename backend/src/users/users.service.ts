import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService){}

  async findAll(){
    return this.prisma.user.findMany();
  }

   async create() {
    return this.prisma.user.create({
      data: {
        githubId: 'test-github-id',
        githubLogin: 'karan-test',
        email: 'test@example.com',
      },
    });
  }

  
}
