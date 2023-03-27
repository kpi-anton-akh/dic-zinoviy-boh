import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserEntity } from '../entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() user: UserEntity): Promise<UserEntity> {
    return this.usersService.create(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() user: UserEntity,
  ): Promise<UserEntity> {
    return this.usersService.update(id, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
