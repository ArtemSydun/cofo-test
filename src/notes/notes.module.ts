import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesController } from './controllers/notes.controller';
import { Note, NoteSchema } from './entities/note.entity';
import { NotesRepository } from './repositories/notes.repository';
import { NotesService } from './services/notes.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
  ],
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
  exports: [NotesService, NotesRepository],
})
export class NotesModule {}
