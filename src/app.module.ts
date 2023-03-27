import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot()],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
