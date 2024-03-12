import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
// import { UsersService } from './users.service';

describe('AuthService', () => {
  it('can create an instance of auth service', async () => {
    // Create fake copy of Users service
    const fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as UserDto);
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

    const service = module.get(AuthService);
    expect(service).toBeDefined();
  });
});
