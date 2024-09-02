import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../../../../infrastructure/decorators/transform/trim';
import { ApiProperty } from '@nestjs/swagger';

export class AuthInputModel {
  @ApiProperty({
    description: 'loginOrEmail',
    example: 'string',
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  loginOrEmail: string;

  @ApiProperty({
    description: 'password',
    example: 'string',
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  password: string;
}

export interface RequestWithUser extends Request {
  user: string; // предположим, что user имеет тип ObjectId
}

export interface RequestWithDeviceId extends Request {
  deviceId: string;
  cookies?: string;
}

export interface RequestWithUserId extends Request {
  user?: { userId: string | null };
}
