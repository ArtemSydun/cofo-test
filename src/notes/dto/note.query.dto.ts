import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { CommonQueryParams } from 'src/common/dto/common.query.dto';

export enum NoteOrderBy {
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

export class NoteQueryDto extends CommonQueryParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Sort by field',
    enum: NoteOrderBy,
  })
  @IsOptional()
  @IsEnum(NoteOrderBy)
  orderBy?: NoteOrderBy = NoteOrderBy.CreatedAt;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  toDate?: string;
}
