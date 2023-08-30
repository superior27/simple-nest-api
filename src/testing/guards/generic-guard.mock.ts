import { CanActivate } from '@nestjs/common';

export const genericGuardMock: CanActivate = {
  canActivate: jest.fn(() => true),
};
