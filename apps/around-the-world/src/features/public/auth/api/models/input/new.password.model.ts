import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { IsValidPasswordRecoveryCode } from '../../../../../../infrastructure/decorators/validate/isValid.passwordRecoveryCode.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class NewPasswordModel {
  @ApiProperty({
    description: 'password',
    example: 'string',
  })
  @Trim()
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: 'code',
    example: 'string',
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsValidPasswordRecoveryCode()
  passwordRecoveryCode: string;
}
