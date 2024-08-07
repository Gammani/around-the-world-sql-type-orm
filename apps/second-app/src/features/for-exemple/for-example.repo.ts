import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';

@Injectable()
export class ForExampleRepo {
  constructor(private prisma: PrismaService) {}

  async getAllUser(): Promise<any> {
    return this.prisma.user.findMany();
  }

  async createUser(name: string, email: string) {
    return this.prisma.user.create({
      data: { email, name },
    });
  }
}
