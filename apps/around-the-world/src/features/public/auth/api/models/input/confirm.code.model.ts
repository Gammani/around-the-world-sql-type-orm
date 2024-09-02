import { EmailCodeIsConfirm } from '../../../../../../infrastructure/decorators/validate/email-code-is-confirm-constraint.service';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmCodeModel {
  @ApiProperty({
    description: 'code',
    example: 'string',
  })
  @EmailCodeIsConfirm()
  code: string;
}
