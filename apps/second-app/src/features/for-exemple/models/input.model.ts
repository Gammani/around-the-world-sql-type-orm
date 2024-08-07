import { Trim } from '../../../infrastructure/decorators/transform/trim';

export class UserCreateModel {
  @Trim()
  name: string;

  @Trim()
  email: string;
}
