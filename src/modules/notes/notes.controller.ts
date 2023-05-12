import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { NotesService } from './notes.service';
import { Note } from './note.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { CreateNoteDto, UpdateNoteDto } from './dtos';

@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiResponse({ status: 200, type: [Note] })
  @Get()
  async getAll(): Promise<Note[]> {
    return this.notesService.getAll();
  }

  @ApiResponse({ status: 200, type: Note })
  @Get(':id')
  async get(@Param('id') id: string): Promise<Note> {
    return this.notesService.get(id);
  }

  @ApiResponse({ status: 201, type: Note })
  @Post()
  async create(@Body() note: CreateNoteDto): Promise<Note> {
    const noteToCreate = plainToClass(Note, note);

    return this.notesService.create(noteToCreate);
  }

  @ApiResponse({ status: 200, type: Note })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() note: UpdateNoteDto,
  ): Promise<Note> {
    const noteToUpdate = plainToClass(Note, note);

    return this.notesService.update(id, noteToUpdate);
  }

  @ApiResponse({ status: 200 })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.notesService.delete(id);
  }
}
