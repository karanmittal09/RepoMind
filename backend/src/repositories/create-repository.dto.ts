export class CreateRepositoryDto {
  githubId!: string;
  githubRepoId!: string;
  fullName!: string;
  branch?: string;
}