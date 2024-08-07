import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ForExampleRepo } from './for-example.repo';
import { UserCreateModel } from './models/input.model';

@Controller('users')
export class ForExampleController {
  constructor(private repo: ForExampleRepo) {}

  @Get()
  async getAllUsers() {
    return await this.repo.getAllUser();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() inputUserModel: UserCreateModel) {
    return await this.repo.createUser(
      inputUserModel.name,
      inputUserModel.email,
    );
  }
}
