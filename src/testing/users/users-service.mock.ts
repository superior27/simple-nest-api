import { UsersService } from "../../users/users.service";
import { fakeUsers } from "./users-fake-repository.mock";

export const userServiceMock = {
  provide: UsersService,
  useValue: {
    create: jest.fn().mockResolvedValue(fakeUsers[0]),
    findAll: jest.fn().mockResolvedValue(fakeUsers),
    findOne: jest.fn().mockResolvedValue(fakeUsers[0]),
    update: jest.fn().mockResolvedValue(fakeUsers[0]),
    remove: jest.fn(),
  },
};