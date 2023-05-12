import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { CreateUserDto, UpdateUserDto } from './dtos';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 200, type: [UserEntity] })
  @Get()
  async getAll(): Promise<UserEntity[]> {
    return this.usersService.getAll();
  }

  @ApiResponse({ status: 200, type: UserEntity })
  @Get(':id')
  async get(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.get(id);
  }

  @ApiResponse({ status: 201, type: UserEntity })
  @Post()
  async create(@Body() user: CreateUserDto): Promise<UserEntity> {
    const userToCreate = plainToClass(UserEntity, user);

    return this.usersService.create(userToCreate);
  }

  @ApiResponse({ status: 200, type: UserEntity })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<UserEntity> {
    const userToUpdate = plainToClass(UserEntity, user);

    return this.usersService.update(id, userToUpdate);
  }

  @ApiResponse({ status: 200 })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.usersService.delete(id);
  }
}
