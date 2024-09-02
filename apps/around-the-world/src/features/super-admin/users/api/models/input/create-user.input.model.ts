import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { LoginIsExist } from '../../../../../../infrastructure/decorators/validate/login.isExist.decorator';
import { EmailIsExist } from '../../../../../../infrastructure/decorators/validate/email.isExist.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateModel {
  @ApiProperty({
    description: 'Unique login for the user',
    example: 'HZTfbj1p0A',
  })
  @Trim()
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsString()
  @Length(3, 10)
  @IsNotEmpty()
  @LoginIsExist()
  login: string;

  @ApiProperty({
    description: 'password',
    example: 'string',
  })
  @Trim()
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'email',
    example: 'example@example.com',
  })
  @Trim()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmpty()
  @EmailIsExist()
  email: string;
}

export type UserCreateModelType = {
  login: string;
  password: string;
  email: string;
};
