import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note } from './note.entity';
import { NotesRepository } from './notes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Note], 'mongo-db')],
  controllers: [NotesController],
  providers: [NotesRepository, NotesService],
  exports: [NotesRepository, NotesService],
})
export class NotesModule {}
