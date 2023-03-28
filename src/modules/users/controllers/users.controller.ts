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
import { ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { CreateUserDto, UpdateUserDto } from '../dtos';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 200, type: [UserEntity] })
  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @ApiResponse({ status: 200, type: UserEntity })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @ApiResponse({ status: 201, type: UserEntity })
  @Post()
  async create(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(user);
  }

  @ApiResponse({ status: 200, type: UserEntity })
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() user: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(id, user);
  }

  @ApiResponse({ status: 200 })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
