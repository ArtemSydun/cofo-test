import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';

import {
  DefaultPaginatedResponse,
  DefaultResponse,
} from 'src/common/interfaces/responses';
import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteQueryDto } from '../dto/note.query.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { Note } from '../entities/note.entity';
import { NotesRepository } from '../repositories/notes.repository';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(private readonly notesRepository: NotesRepository) {}

  public async getNote(note: string | Note): Promise<Note> {
    if (typeof note === 'string') {
      // If it's a string, fetch the note by ID
      return await this.findNoteById(note);
    }
    return note; // If it's already a Note object, return it as-is
  }

  public async createNote(
    createNoteDto: CreateNoteDto,
  ): Promise<DefaultResponse<Note>> {
    const { title } = createNoteDto;
    this.logger.log(`Creating note: ${title}`);

    const noteByTitle = await this.notesRepository.findOneByTitle(
      createNoteDto.title,
    );

    if (noteByTitle) {
      this.logger.warn(`Note ${title} already exists`);
      throw new ConflictException(`Note ${title} already exists`);
    }

    const createdNote = await this.notesRepository.create(createNoteDto);

    this.logger.log(`Note ${title} created successfully`);

    return {
      message: `Note ${createdNote.title} created successfully`,
      statusCode: HttpStatus.OK,
      data: createdNote,
    };
  }

  public async deleteNoteById(
    noteToDelete: string | Note,
  ): Promise<DefaultResponse<null>> {
    const targetNote = await this.getNote(noteToDelete);

    this.logger.log(`Deleting note with ID: ${targetNote.id}`);

    // Perform the note deletion
    await this.notesRepository.delete(targetNote.id);

    this.logger.log(`Note ${targetNote.title} deleted successfully`);
    return {
      message: `All note data ${targetNote.title} has been deleted successfully`,
      statusCode: HttpStatus.OK,
    };
  }

  public async findAll(
    filters: NoteQueryDto = {},
  ): Promise<DefaultPaginatedResponse<Note>> {
    return this.notesRepository.getAll(filters);
  }

  public async findTotal(): Promise<number> {
    return this.notesRepository.getTotal();
  }

  public async findNoteById(id: string): Promise<Note> {
    const note = await this.notesRepository.findOneById(id);
    if (!note) {
      this.logger.warn(`Note with ID ${id} not found`);
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return note;
  }

  public async findNoteByTitle(title: string): Promise<Note> {
    const note = await this.notesRepository.findOneByTitle(title);

    if (!note) {
      this.logger.warn(`Note ${title} not found`);
      throw new NotFoundException(`Note ${title} does not exists`);
    }

    return note;
  }

  public async doesNoteExistByTitle(title: string): Promise<boolean> {
    return await this.notesRepository.existsByTitle(title);
  }

  public async updateNote(
    note: string | Note,
    updateNoteDto: UpdateNoteDto,
  ): Promise<DefaultResponse<Note>> {
    const noteToUpdate = await this.getNote(note);

    if (updateNoteDto.title) {
      const updatedNote = await this.updateNote(note, updateNoteDto);
      return {
        message: `Note ${noteToUpdate.title} updated successfully`,
        statusCode: HttpStatus.OK,
        data: updatedNote.data,
      };
    }

    const updatedNoteProps: Partial<Note> = {};

    for (const [key, value] of Object.entries(updateNoteDto)) {
      if (value !== undefined) {
        updatedNoteProps[key] = value;
      }
    }

    const updatedNote = await this.notesRepository.updateById(
      noteToUpdate.id,
      updatedNoteProps,
    );

    return {
      message: `Note ${noteToUpdate.title} updated successfully`,
      statusCode: HttpStatus.OK,
      data: updatedNote,
    };
  }

  public async updateManyNotes(operations: any[]) {
    return await this.notesRepository.bulkUpdateNotes(operations);
  }
}
