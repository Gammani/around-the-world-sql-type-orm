import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';

export type PublishedStatusType = 'all' | 'published' | 'notPublished';
export class QuestionInputModel {
  @Trim()
  @IsString()
  @Length(10, 500)
  @IsNotEmpty()
  body: string;

  @IsArray()
  @ArrayNotEmpty()
  @Transform(({ value }) => {
    return value.map((a) => a.toString().trim());
  })
  correctAnswers: string[];
}

export class PublishedInputModel {
  @IsBoolean()
  @IsNotEmpty()
  published: boolean;
}
