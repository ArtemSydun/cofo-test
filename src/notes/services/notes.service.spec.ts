import { Test } from '@nestjs/testing';
import {
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesRepository } from '../repositories/notes.repository';
import { createMock } from '@golevelup/ts-jest';
import { Note } from '../entities/note.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteQueryDto } from '../dto/note.query.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

describe('NotesService', () => {
  let notesService: NotesService;
  let notesRepository: NotesRepository;

  const noteStub: Note = {
    id: 'note-id',
    title: 'Test Note',
    content: 'Some content',
    tags: ['test'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        NotesService,
        { provide: NotesRepository, useValue: createMock<NotesRepository>() },
      ],
    }).compile();

    notesService = moduleRef.get<NotesService>(NotesService);
    notesRepository = moduleRef.get<NotesRepository>(NotesRepository);
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const createDto: CreateNoteDto = {
        title: 'Test Note',
        content: 'Text',
        tags: [],
      };

      jest.spyOn(notesRepository, 'findOneByTitle').mockResolvedValue(null);
      jest.spyOn(notesRepository, 'create').mockResolvedValue(noteStub);

      const result = await notesService.createNote(createDto);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data).toEqual(noteStub);
    });

    it('should throw ConflictException if note with title exists', async () => {
      jest.spyOn(notesRepository, 'findOneByTitle').mockResolvedValue(noteStub);

      await expect(
        notesService.createNote({ title: 'Test Note', content: '', tags: [] }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return paginated notes', async () => {
      const mockResponse = {
        total: 1,
        totalPages: 1,
        limitPerPage: 10,
        currentPage: 1,
        data: [noteStub],
      };

      jest.spyOn(notesRepository, 'getAll').mockResolvedValue(mockResponse);

      const result = await notesService.findAll({} as NoteQueryDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findNoteById', () => {
    it('should return a note by ID', async () => {
      jest.spyOn(notesRepository, 'findOneById').mockResolvedValue(noteStub);
      const result = await notesService.findNoteById('note-id');
      expect(result).toEqual(noteStub);
    });

    it('should throw NotFoundException if note not found', async () => {
      jest.spyOn(notesRepository, 'findOneById').mockResolvedValue(null);
      await expect(notesService.findNoteById('bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findNoteByTitle', () => {
    it('should return a note by title', async () => {
      jest.spyOn(notesRepository, 'findOneByTitle').mockResolvedValue(noteStub);
      const result = await notesService.findNoteByTitle('Test Note');
      expect(result).toEqual(noteStub);
    });

    it('should throw NotFoundException if note not found by title', async () => {
      jest.spyOn(notesRepository, 'findOneByTitle').mockResolvedValue(null);
      await expect(notesService.findNoteByTitle('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteNoteById', () => {
    it('should delete a note', async () => {
      jest.spyOn(notesRepository, 'findOneById').mockResolvedValue(noteStub);
      jest.spyOn(notesRepository, 'delete').mockResolvedValue();

      const result = await notesService.deleteNoteById('note-id');

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.message).toContain(noteStub.title);
    });
  });

  describe('updateNote', () => {
    it('should update a note', async () => {
      const updateDto: UpdateNoteDto = { content: 'Updated' };

      jest.spyOn(notesRepository, 'findOneById').mockResolvedValue(noteStub);
      jest
        .spyOn(notesRepository, 'updateById')
        .mockResolvedValue({ ...noteStub, ...updateDto });

      const result = await notesService.updateNote('note-id', updateDto);

      expect(result.statusCode).toBe(HttpStatus.OK);
      expect(result.data.content).toBe('Updated');
    });
  });

  describe('doesNoteExistByTitle', () => {
    it('should return true if note exists', async () => {
      jest.spyOn(notesRepository, 'existsByTitle').mockResolvedValue(true);
      const result = await notesService.doesNoteExistByTitle('Test Note');
      expect(result).toBe(true);
    });
  });
});
