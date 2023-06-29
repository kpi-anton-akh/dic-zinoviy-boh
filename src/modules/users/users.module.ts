import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStatsModule } from '../user-stats/user-stats.module';

@Module({
  imports: [TypeOrmModule.forFeature([User], 'postgres-db'), UserStatsModule],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersRepository, UsersService],
})
export class UsersModule {}
