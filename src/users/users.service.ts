import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = this.prisma.user.create({ data });
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
