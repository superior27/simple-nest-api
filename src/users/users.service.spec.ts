import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { userPrismaMock } from '../testing/users/users-prisma.mock';
import { fakeUserCreateDTO } from '../testing/users/users-create-dto.mock';

// npm test src/users/users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: userPrismaMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be create a user', async () => {
      const response = await service.create(fakeUserCreateDTO);

      // expect(response).toBe(fakeUsers[0]);
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      // expect(prisma.user.create).toHaveBeenCalledWith({
      //   data: fakeUsers[0],
      // });
    });
  });
});
