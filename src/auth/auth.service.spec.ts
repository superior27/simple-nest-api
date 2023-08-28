import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { userPrismaMock } from '../testing/users/users-prisma.mock';
import { jwtServiceMock } from '../testing/jwt/jwt-service.mock';
import { userServiceMock } from '../testing/users/users-service.mock';
import { mailerServiceMock } from '../testing/mail/mailer-service.mock';
import { fakeUsers } from '../testing/users/users-fake-repository.mock';
import { accessToken } from '../testing/jwt/access-token.mock';
import { jwtTokenPayload } from '../testing/jwt/jwt-token-payload.mock';
import { fakeAuthLoginDto } from '../testing/auth/auth-login-dto.mock';
import { fakeAuthForgetDto } from '../testing/auth/auth-forget-dto.mock';
import { fakeAuthResetnDto } from '../testing/auth/auth-reset-dto.mock';
import { fakeAuthRegisterDTO } from '../testing/auth/auth-register-dto.mock';

// npm test src/auth/auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        //refatorar esse cara
        {
          provide: PrismaService, useValue: userPrismaMock
        },
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe('token', () => {
    it('should be create a token', () => {
      const result = service.createToken(fakeUsers[0]);
      expect(result).toEqual({accessToken: accessToken});

    });

    it('should be verify a token', () => {
      const result = service.checkToken(accessToken);
      expect(result).toEqual(jwtTokenPayload);

    });

    it('should be check if a token is valid', () => {
      const result = service.isValidToken(accessToken);
      expect(result).toEqual(true);

    });

  });


  describe('auth', () => {
   

    it('should be login', async () => {
      const result = await service.login(fakeAuthLoginDto);
      expect(result).toEqual({accessToken: accessToken});

    });

    it('should be return true if is a valid email', async () => {
      const result = await service.forget(fakeAuthForgetDto);
      expect(result).toEqual(fakeUsers[0]);

    });


    it('should be recive a valid token and new password and return a new access-token', async () => {
      const result = await service.reset(fakeAuthResetnDto);
      expect(result).toEqual({accessToken: accessToken});

    });


    it('should be register a user and return a token', async () => {
      const result = await service.register(fakeAuthRegisterDTO);
      expect(result).toEqual({accessToken: accessToken});

    });

  });

});
