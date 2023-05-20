import { Module } from '@nestjs/common';
import { UserNotesService } from './user-notes.service';
import { UserNotesController } from './user-notes.controller';
import { UsersModule } from '../users/users.module';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [UsersModule, NotesModule],
  providers: [UserNotesService],
  controllers: [UserNotesController],
})
export class UserNotesModule {}
