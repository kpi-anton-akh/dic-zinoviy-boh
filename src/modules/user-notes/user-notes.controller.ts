import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Param } from '@nestjs/common';
import { UserNotesService } from './user-notes.service';

@ApiTags('User Notes')
@Controller('/user')
export class UserNotesController {
  constructor(private userNotesService: UserNotesService) {}

  @Get('/:userId/notes')
  getNotesByUserId(@Param('userId') userId: number) {
    return this.userNotesService.getNotes(userId);
  }

  @Post('/:userId/notes/:noteId')
  createUserNote(
    @Param('userId') userId: number,
    @Param('noteId') noteId: string,
  ) {
    return this.userNotesService.createUserNote(userId, noteId);
  }
}
