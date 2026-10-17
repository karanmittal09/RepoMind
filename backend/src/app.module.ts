import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { AuthModule } from './auth/auth.module';
import { GithubModule } from './github/github.module';
import { BullModule } from '@nestjs/bullmq';
import { VectorModule } from './vector/vector.module';
import { EmbeddingsService } from './embeddings/embeddings.service';
import { EmbeddingsModule } from './embeddings/embeddings.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      }
    }),
    UsersModule,
    RepositoriesModule,
    AuthModule,
    GithubModule,
    VectorModule,
    EmbeddingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, EmbeddingsService],
})
export class AppModule {}