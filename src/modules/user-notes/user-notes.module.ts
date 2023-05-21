import { Module } from '@nestjs/common';
import { UserNotesService } from './user-notes.service';
import { UserNotesController } from './user-notes.controller';
import { UsersModule } from '../users/users.module';
import { NotesModule } from '../notes/notes.module';
import { UserNotesStorage } from './user-note.storage';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, NotesModule, ConfigModule],
  providers: [
    UserNotesService,
    UserNotesStorage,
    {
      provide: UserNotesStorage,
      useFactory: (configService: ConfigService) =>
        new UserNotesStorage(
          configService.get('AZURE_STORAGE_URI'),
          'user-notes',
        ),
      inject: [ConfigService],
    },
  ],
  controllers: [UserNotesController],
})
export class UserNotesModule {}
