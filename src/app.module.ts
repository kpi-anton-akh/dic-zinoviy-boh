import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDatabaseModule } from './databases/postgres-database.module';
import { MongodbDatabaseModule } from './databases/mongodb-database.module';
import { UsersModule } from './modules/users/users.module';
import { NotesModule } from './modules/notes/notes.module';
import { UserNotesModule } from './modules/user-notes/user-notes.module';
import { UserStatsModule } from './modules/user-stats/user-stats.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongodbDatabaseModule,
    PostgresDatabaseModule,
    UsersModule,
    NotesModule,
    UserNotesModule,
    UserStatsModule,
  ],
})
export class AppModule {}
