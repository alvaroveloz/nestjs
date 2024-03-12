import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';

import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const fakeUser = {
    id: 10,
    email: 'test-user@test.com',
    password: '123456789',
  };

  beforeEach(async () => {
    // Create fake copy of Users service
    fakeUsersService = {
      findOne: () => Promise.resolve(null),
      findOneByEmail: () => Promise.resolve(null),
      create: ({ email, password }: { email: string; password: string }) => {
        return Promise.resolve({ id: 10, name: 'Test User', email, password });
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
});
