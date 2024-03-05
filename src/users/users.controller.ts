import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dtos/createUser.dto';
import { AuthService } from './auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersService.findOneByEmail(email);
  }
}
