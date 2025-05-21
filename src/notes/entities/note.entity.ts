import { randomUUID } from 'crypto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Schema({ timestamps: true, collection: 'notes' })
export class Note {
  @ApiProperty({
    description: 'Unique identifier for the note',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Prop({ default: () => randomUUID() })
  id: string;

  @ApiProperty({
    description: 'Note title',
    example: 'Breakfest',
    required: true,
  })
  @Prop({ required: true })
  title: string;

  @ApiPropertyOptional({
    description: 'Note title',
    example: 'Breakfest',
    required: true,
  })
  @Prop({ required: false })
  content?: string;

  @ApiPropertyOptional({
    description: 'Array of note tags',
    example: ['Music', 'Relax'],
    required: false,
  })
  @Prop({ required: false })
  tags?: string[];

  @ApiProperty({
    description: 'Date when the user was created',
    example: new Date(),
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Date when the user was last updated',
    example: new Date(),
  })
  updatedAt?: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
