import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note } from 'src/notes/entities/note.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<Note>,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  private async seedDatabase() {
    try {
      console.log('Seeding database...');

      const note = {
        title: 'Grocery List',
        content: 'Milk, Eggs, Bread',
        tags: ['home', 'shopping'],
      };

      const existingNotes = await this.noteModel.find({
        title: note.title,
      });

      console.log(existingNotes);
      if (existingNotes.length === 0) {
        console.log('Seeding default note...');

        await this.noteModel.create({
          ...note,
        });
        console.log(`Note ${note.title} created.`);
      } else {
        console.log(`Note ${note.title} already exist.`);
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
}
