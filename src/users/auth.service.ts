import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // Validate if email is in use
    const users = await this.usersService.findOneByEmail(email);
    if (users) {
      throw new BadRequestException('Email already in use');
    }
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the password + salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result with the user and save it
    const result = salt + '.' + hash.toString('hex');

    // Create a user and save it
    const user = await this.usersService.create({ email, password: result });
    return user;
  }

  signin() {}
}
