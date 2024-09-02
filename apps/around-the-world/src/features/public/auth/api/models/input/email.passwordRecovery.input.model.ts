import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';
// import { IsValidEmail } from '../../../../../../infrastructure/decorators/validate/email.isValid.decorator';

export class EmailPasswordRecoveryInputModel {
  @ApiProperty({
    description: 'email',
    example: 'string',
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  // @IsValidEmail()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
