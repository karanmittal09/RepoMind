import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma.service';
import { GithubService } from '../github/github.service';

@Processor('repository-ingestion')
export class RepositoryProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private githubService: GithubService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    if (job.name !== 'ingest-repository') {
      return;
    }

    const repositoryId = job.data.repositoryId;

    const repository = await this.prisma.repository.findUnique({
      where: { id: repositoryId },
      include: { user: true },
    });

    if (!repository) {
      throw new Error('Repository not found');
    }

    await this.prisma.repository.update({
      where: { id: repositoryId },
      data: { status: 'PROCESSING' },
    });

    const [owner, repoName] = repository.fullName.split('/');

    const treeData = await this.githubService.getRepositoryFiles(
      repository.user.githubId,
      owner,
      repoName,
      repository.branch,
    );

    if (!Array.isArray(treeData.tree)) {
      throw new Error(
        `Failed to fetch repository files: ${treeData.message ?? 'Invalid response'}`,
      );
    }

    const fileCount = treeData.tree.filter(
      (item: { type: string }) => item.type === 'blob',
    ).length;

    await this.prisma.repository.update({
      where: { id: repositoryId },
      data: { fileCount },
    });

    console.log('Repository ID:', repositoryId);
    console.log('Files discovered:', fileCount);

    const ignoredDirectories = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      '.next',
    ];

    const textFilePattern =
      /\.(ts|tsx|js|jsx|mjs|cjs|json|md|mdx|html|css|scss|py|java|go|rs|php|sql|prisma|xml|yaml|yml)$/i;

    const filesToProcess = treeData.tree.filter(
      (item: { type: string; path: string }) => {
        const parts = item.path.split('/');
        const fileName = parts[parts.length - 1];

        return (
          item.type === 'blob' &&
          textFilePattern.test(item.path) &&
          !parts.some((part) => ignoredDirectories.includes(part)) &&
          !/^(package-lock\.json|yarn\.lock|pnpm-lock\.yaml)$/i.test(fileName) &&
          !/^\.env(?:\.|$)/i.test(fileName)
        );
      },
    );

    let fetchedCount = 0;

    for (const file of filesToProcess) {
      const result = await this.githubService.getFileContent(
        repository.user.githubId,
        owner,
        repoName,
        file.path,
      );

      if (typeof result.content === 'string') {
        fetchedCount++;
      }
    }

    console.log('Text files selected:', filesToProcess.length);
    console.log('File contents fetched:', fetchedCount);
  }
}