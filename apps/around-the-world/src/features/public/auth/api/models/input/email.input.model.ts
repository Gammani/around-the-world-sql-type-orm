import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { EmailIsConfirmed } from '../../../../../../infrastructure/decorators/validate/email.isConfirmed.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailInputModel {
  @ApiProperty({
    description: 'email',
    example: 'string',
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @EmailIsConfirmed()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
