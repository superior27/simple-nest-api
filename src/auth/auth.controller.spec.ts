import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthGuard } from '../guards/auth.guard';
import { genericGuardMock } from '../testing/guards/generic-guard.mock';
import { authServiceMock } from '../testing/auth/auth-service.mock';
import { fileServiceMock } from '../testing/file/file-service.mock';
import { fakeAuthLoginDto } from '../testing/auth/auth-login-dto.mock';
import { accessToken } from '../testing/jwt/access-token.mock';
import { fakeAuthRegisterDTO } from '../testing/auth/auth-register-dto.mock';
import { fakeAuthForgetDto } from '../testing/auth/auth-forget-dto.mock';
import { fakeUsers } from '../testing/users/users-fake-repository.mock';
import { fakeAuthResetDto } from '../testing/auth/auth-reset-dto.mock';
import { getImage } from '../testing/file/get-image.mock';
import { HttpStatus } from '@nestjs/common';

// npm test src/auth/auth.controller.spec.ts
describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock, fileServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(genericGuardMock)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login flow', () => {
    it('should be login with success', async () => {
      const result = await controller.login(fakeAuthLoginDto);
      expect(result).toEqual({ accessToken: accessToken });
    });

    it('should be register a user with success', async () => {
      const result = await controller.register(fakeAuthRegisterDTO);
      expect(result).toEqual({ accessToken: accessToken });
    });

    it('should be register a user with success, and return this user', async () => {
      const result = await controller.forget(fakeAuthForgetDto);
      expect(result).toEqual(fakeUsers[0]);
    });

    it("should be reset a user's password, login this user, and return access token", async () => {
      const result = await controller.reset(fakeAuthResetDto);
      expect(result).toEqual({ accessToken: accessToken });
    });
  });

  describe('authenticated routes', () => {
    it('should be recive a user, and return this information', async () => {
      const result = await controller.aboutMe(fakeUsers[0], {
        token: accessToken,
      });
      expect(result).toEqual({ user: fakeUsers[0], token: accessToken });
    });

    it('should be recive a image, and storage this image', async () => {
      const image = await getImage();
      const result = await controller.sendImage(fakeUsers[0], image);
      expect(result).toEqual(HttpStatus.ACCEPTED);
    });
  });
});
