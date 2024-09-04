import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';

export class CommentInputModel {
  @ApiProperty({
    description: 'content',
    example: 'stringstringstringst',
  })
  @Trim()
  @IsString()
  @Length(20, 300)
  @IsNotEmpty()
  content: string;
}
