import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('github')
  githubLogin(@Res() res: Response) {
    const url =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&redirect_uri=${process.env.GITHUB_CALLBACK_URL}` +
      `&scope=read:user%20user:email%20repo`;

    return res.redirect(url);
  }

  @Get('github/callback')
  githubCallback(@Query('code') code: string) {
    return this.authService.githubCallback(code);
  }

  @Get('github/repositories')
  getGithubRepositories(@Query('githubId') githubId: string) {
    return this.authService.getGithubRepositories(githubId);
  }
}
