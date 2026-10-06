export class CreateRepositoryDto {
  userId: string;
  githubRepoId: string;
  fullName: string;
  branch?: string;
}