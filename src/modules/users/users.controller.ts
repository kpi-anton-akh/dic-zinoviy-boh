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
import { User } from './user.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { CreateUserDto, UpdateUserDto } from './dtos';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 200, type: [User] })
  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @ApiResponse({ status: 200, type: User })
  @Get(':id')
  async get(@Param('id') id: number): Promise<User> {
    return this.usersService.get(id);
  }

  @ApiResponse({ status: 201, type: User })
  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    const userToCreate = plainToClass(User, user);

    return this.usersService.create(userToCreate);
  }

  @ApiResponse({ status: 200, type: User })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    const userToUpdate = plainToClass(User, user);

    return this.usersService.update(id, userToUpdate);
  }

  @ApiResponse({ status: 200 })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.usersService.delete(id);
  }
}
