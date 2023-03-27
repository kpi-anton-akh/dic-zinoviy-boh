import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule.forRoot(), UsersModule],
})
export class AppModule {}
