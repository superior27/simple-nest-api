import { fakeUsers } from './users-fake-repository.mock';

export const userPrismaMock = {
  user: {
    create: jest.fn().mockResolvedValue(fakeUsers[0]),
    findMany: jest.fn().mockResolvedValue(fakeUsers),
    findUnique: jest.fn().mockResolvedValue(fakeUsers[0]),
    findFirst: jest.fn().mockResolvedValue(fakeUsers[0]),
    update: jest.fn().mockResolvedValue(fakeUsers[0]),
    delete: jest.fn(), // O método delete não retorna nada
  },
};
