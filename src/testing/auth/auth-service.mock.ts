import { AuthService } from '../../auth/auth.service';
import { accessToken } from '../jwt/access-token.mock';
import { jwtTokenPayload } from '../jwt/jwt-token-payload.mock';
import { fakeUsers } from '../users/users-fake-repository.mock';

export const authServiceMock = {
  provide: AuthService,
  useValue: {
    createToken: jest.fn().mockReturnValue({ accessToken: accessToken }),
    checkToken: jest.fn().mockReturnValue(jwtTokenPayload),
    isValidToken: jest.fn().mockResolvedValue(true),
    login: jest.fn().mockResolvedValue({ accessToken: accessToken }),
    register: jest.fn().mockResolvedValue({ accessToken: accessToken }),
    forget: jest.fn().mockResolvedValue(fakeUsers[0]),
    reset: jest.fn().mockResolvedValue({ accessToken: accessToken }),
    aboutMe: jest
      .fn()
      .mockResolvedValue({ user: fakeUsers[0], token: jwtTokenPayload }),
  },
};
