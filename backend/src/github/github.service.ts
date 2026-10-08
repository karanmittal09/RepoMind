import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GithubService {
  constructor(private prisma: PrismaService) {}

  async getRepositoryFiles(
    githubId: string,
    owner: string,
    repo: string,
    branch: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        githubId,
      },
    });

    if (!user || !user.githubToken) {
      throw new Error('GitHub user or token not found');
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      {
        headers: {
          Authorization: `Bearer ${user.githubToken}`,
          Accept: 'application/vnd.github+json',
        },
      },
    );

    return response.json();
  }


  async getFileContent(
  githubId: string,
  owner: string,
  repo: string,
  path: string,
) {
  const user = await this.prisma.user.findUnique({
    where: {
      githubId,
    },
  });

  if (!user || !user.githubToken) {
    throw new Error('GitHub user or token not found');
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${user.githubToken}`,
        Accept: 'application/vnd.github+json',
      },
    },
  );

  const data = await response.json();

  if (!data.content) {
    return data;
  }

  const content = Buffer.from(data.content, 'base64').toString('utf-8');

  return {
    path: data.path,
    content,
  };
}


}