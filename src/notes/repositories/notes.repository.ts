import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DefaultPaginatedResponse } from 'src/common/interfaces/responses';

import { CreateNoteDto } from '../dto/create-note.dto';
import { NoteOrderBy, NoteQueryDto } from '../dto/note.query.dto';
import { Note } from '../entities/note.entity';

@Injectable()
export class NotesRepository {
  constructor(
    @InjectModel(Note.name)
    private NoteModel: Model<Note>,
  ) {}

  public async bulkUpdateNotes(operations: any[]): Promise<any> {
    return await this.NoteModel.bulkWrite(operations);
  }

  public async findOneByTitle(title: string): Promise<Note> {
    return await this.NoteModel.findOne({ title }).lean().exec();
  }

  public async findOneById(id: string): Promise<Note> {
    return await this.NoteModel.findOne({ id }).lean().exec();
  }

  public async existsByTitle(title: string): Promise<boolean> {
    const note = await this.NoteModel.findOne({ title }).lean().exec();
    return note !== null;
  }

  public async updateById(
    id: string,
    updateData: Partial<Note>,
  ): Promise<Note> {
    const updatedNote = await this.NoteModel.findOneAndUpdate(
      { id },
      { $set: updateData },
      { new: true, lean: true },
    ).exec();

    return updatedNote;
  }

  public async create(note: CreateNoteDto): Promise<Note> {
    return await this.NoteModel.create(note);
  }

  public async delete(id: string): Promise<void> {
    return await this.NoteModel.findOneAndDelete({ id });
  }

  public async getAll(
    filters: NoteQueryDto,
  ): Promise<DefaultPaginatedResponse<Note>> {
    const {
      order = 'desc',
      orderBy = NoteOrderBy.CreatedAt,
      limit = 10,
      page = 1,
      title,
      content,
      tag,
      date,
      fromDate,
      toDate,
    } = filters;
    const perPage = limit; // Elements per page
    const offset = (page - 1) * perPage; // Calculate skip amount

    const query: any = {};

    if (title) query.title = { $regex: title, $options: 'i' };
    if (content) query.title = { $regex: content, $options: 'i' };
    if (tag) query.tags = { $in: [tag] };

    if (date && (fromDate || toDate)) {
      query[date] = {}; // Dynamically assign the date field
      if (fromDate) query[date].$gte = new Date(fromDate);
      if (toDate) query[date].$lte = new Date(toDate);
    }

    // Define sorting
    const sortOrder = order === 'asc' ? 1 : -1;

    // Get total query count
    const total = await this.NoteModel.countDocuments(query);

    // Fetch paginated results
    const notes = await this.NoteModel.find(query)
      .sort({ [orderBy]: sortOrder })
      .skip(offset)
      .limit(perPage)
      .lean();

    return {
      total,
      totalPages: Math.ceil(total / perPage),
      limitPerPage: +perPage,
      currentPage: +page,
      data: notes,
    };
  }

  public async getTotal(): Promise<number> {
    return await this.NoteModel.countDocuments();
  }
}
