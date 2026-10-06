import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async githubCallback(code: string) {
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: process.env.GITHUB_CALLBACK_URL,
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    const githubUser = await userResponse.json();

    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    const emails = await emailResponse.json();

    console.log('GitHub email response:', emails);

    const primaryEmail = emails.find(
      (email: { email: string; primary: boolean }) => email.primary,
    );

    const user = await this.prisma.user.upsert({
      where: {
        githubId: githubUser.id.toString(),
      },
      update: {
        githubLogin: githubUser.login,
        email: primaryEmail?.email,
        avatarUrl: githubUser.avatar_url,
        githubToken: tokenData.access_token,
      },
      create: {
        githubId: githubUser.id.toString(),
        githubLogin: githubUser.login,
        email: primaryEmail?.email,
        avatarUrl: githubUser.avatar_url,
        githubToken: tokenData.access_token,
      },
    });

    return user;
  }
}
