import {
  Controller,
  Body,
  Patch,
  Param,
  HttpStatus,
  Get,
  Delete,
  Query,
  Post,
} from '@nestjs/common';

import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';

import {
  ApiCustomConflictResponse,
  ApiCustomNotFoundResponse,
  ApiKeyAuth,
} from 'src/common/decorators/swagger.decorators';

import {
  DefaultPaginatedResponse,
  DefaultResponse,
} from 'src/common/interfaces/responses';
import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteQueryDto } from '../dto/note.query.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { Note } from '../entities/note.entity';
import { NotesService } from '../services/notes.service';

@ApiKeyAuth()
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all notes',
    description: 'This endpoint retrieves a list of all notes in the system',
  })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filter by title (case-insensitive)',
  })
  @ApiQuery({
    name: 'content',
    required: false,
    description: 'Filter by content (case-insensitive)',
  })
  @ApiQuery({
    name: 'tag',
    required: false,
    description: 'Filter by tag (case-insensitive)',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Date field to filter by (e.g., createdAt, lastLoginDate)',
  })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    description: 'Start of date range (ISO format)',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    description: 'End of date range (ISO format)',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Sorting order (asc or desc)',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    description: 'Field to order results by (default: createdAt)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiOkResponse({
    description: 'All notes list',
    type: [Note],
  })
  async findAll(
    @Query() queryParams: NoteQueryDto,
  ): Promise<DefaultPaginatedResponse<Note>> {
    return this.notesService.findAll(queryParams);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a note by ID',
    description:
      'This endpoint retrieves the details of a specific note by their ID.',
  })
  @ApiOkResponse({
    description: 'Note by id',
    type: Note,
  })
  @ApiCustomNotFoundResponse('Note', 'id')
  findOne(@Param('id') id: string): Promise<Note> {
    return this.notesService.findNoteById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a note by ID',
    description: 'This endpoint allows to create a note',
  })
  @ApiOkResponse({
    description: 'Note xxx created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Note xxx created successfully',
        },
        statusCode: {
          type: 'number',
          example: HttpStatus.OK,
        },
        data: {
          type: 'object',
          $ref: getSchemaPath(Note),
        },
      },
    },
  })
  @ApiCustomConflictResponse('note', 'id')
  createNote(
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<DefaultResponse<Note>> {
    return this.notesService.createNote(createNoteDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a note by ID',
    description: 'This endpoint allows to delete a note by their ID.',
  })
  @ApiOkResponse({
    description: 'Note deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Note {{id}} deleted successfully',
        },
        statusCode: {
          type: 'number',
          example: HttpStatus.OK,
        },
      },
    },
  })
  @ApiCustomNotFoundResponse('Note', 'id')
  deleteNoteById(@Param('id') id: string): Promise<DefaultResponse<string>> {
    return this.notesService.deleteNoteById(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a note by ID',
    description: 'This endpoint allows to update a note by their ID',
  })
  @ApiOkResponse({
    description: 'Note updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Note {{id}} updated successfully',
        },
        statusCode: {
          type: 'number',
          example: HttpStatus.OK,
        },
        data: {
          type: 'object',
          $ref: getSchemaPath(Note),
        },
      },
    },
  })
  @ApiCustomNotFoundResponse('Note', 'id')
  updateNoteById(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<DefaultResponse<Note>> {
    return this.notesService.updateNote(id, updateNoteDto);
  }
}
