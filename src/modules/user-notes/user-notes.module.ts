import { Module } from '@nestjs/common';
import { UserNotesService } from './user-notes.service';
import { UserNotesController } from './user-notes.controller';
import { UsersModule } from '../users/users.module';
import { NotesModule } from '../notes/notes.module';
import { BlobStorage } from '../../shared/blob-storage/blob-storage.storage';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule, NotesModule, ConfigModule],
  providers: [
    UserNotesService,
    BlobStorage,
    {
      provide: BlobStorage,
      useFactory: (configService: ConfigService) =>
        new BlobStorage(configService.get('AZURE_STORAGE_URI'), 'user-notes'),
      inject: [ConfigService],
    },
  ],
  controllers: [UserNotesController],
})
export class UserNotesModule {}
