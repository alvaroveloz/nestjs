import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';

import { UsersService } from './users.service';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const fakeUser = {
    id: 10,
    name: 'Test User',
    email: 'test-user@test.com',
    password: '123456789',
  };

  beforeEach(async () => {
    // Create fake copy of Users service
    const users: User[] = [];
    fakeUsersService = {
      findOne: (id: string) => {
        const filteredUsers = users.filter((user) => user.id === parseInt(id));
        return Promise.resolve(filteredUsers[0]);
      },
      findOneByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers[0]);
      },
      create: ({ email, password }: { email: string; password: string }) => {
        const newUser = {
          id: new Date().getTime(),
          email,
          password,
          name: 'Test User',
        };
        users.push(newUser);
        return Promise.resolve(newUser);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });
  it('can create an instance of auth service', () => {
    expect(service).toBeDefined();
  });
  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup(fakeUser.email, fakeUser.password);
    expect(user.password).not.toEqual(fakeUser.password);
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if signup with email that is in use', async () => {
    // fakeUsersService.findOneByEmail = () => Promise.resolve(fakeUser);
    await service.signup(fakeUser.email, fakeUser.password);
    await expect(
      service.signup(fakeUser.email, fakeUser.password),
    ).rejects.toThrow(BadRequestException);
  });
  it('throws an error if signin is called with an unused email', async () => {
    await expect(
      service.signin(fakeUser.email, fakeUser.password),
    ).rejects.toThrow(NotFoundException);
  });
  it('returns an user if correct password', async () => {
    await service.signup(fakeUser.email, fakeUser.password);
    const user = await service.signin(fakeUser.email, fakeUser.password);
    expect(user).toBeDefined();
  });
});
