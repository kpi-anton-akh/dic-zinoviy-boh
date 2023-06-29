import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDatabaseModule } from './databases/postgres-database.module';
import { MongodbDatabaseModule } from './databases/mongodb-database.module';
import { UsersModule } from './modules/users/users.module';
import { NotesModule } from './modules/notes/notes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongodbDatabaseModule,
    PostgresDatabaseModule,
    UsersModule,
    NotesModule,
  ],
})
export class AppModule {}
