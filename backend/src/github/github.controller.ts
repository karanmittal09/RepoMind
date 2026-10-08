import { Controller, Get, Param, Query } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private githubService: GithubService) {}

  @Get('repositories/:owner/:repo/files')
  getRepositoryFiles(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Query('githubId') githubId: string,
  ) {
    return this.githubService.getRepositoryFiles(
      githubId,
      owner,
      repo,
      'main',
    );
  }
}