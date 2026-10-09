import { Body, Controller, Get, Post } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';
import { CreateRepositoryDto } from './create-repository.dto';

@Controller('repositories')
export class RepositoriesController {
  constructor(private repositoriesService: RepositoriesService) {}

  @Get()
  findAll(){
    return this.repositoriesService.findAll();
  }

  @Post() 
  create(@Body() data: CreateRepositoryDto){
    return this.repositoriesService.create(data);
  }
}
