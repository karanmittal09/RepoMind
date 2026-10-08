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

  @Get('repositories/:owner/:repo/file')
 getFileContent(
  @Param('owner') owner: string,
  @Param('repo') repo: string,
  @Query('githubId') githubId: string,
  @Query('path') path: string,
 ) {
  return this.githubService.getFileContent(
    githubId,
    owner,
    repo,
    path,
  );
 }


}