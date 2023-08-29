import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { userServiceMock } from '../testing/users/users-service.mock';
import { AuthGuard } from '../guards/auth.guard';
import { genericGuardMock } from '../testing/guards/generic-guard.mock';
import { RoleGuard } from '../guards/role.guard';
import { fakeUserCreateDTO } from '../testing/users/users-create-dto.mock';
import { fakeUsers } from '../testing/users/users-fake-repository.mock';
import { fakeUserUpdateDto } from '../testing/users/users-update-dto.mock';


// npm test src/users/users.controller.spec.ts
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [userServiceMock],
    })
    .overrideGuard(AuthGuard)
    .useValue(genericGuardMock)
    .overrideGuard(RoleGuard)
    .useValue(genericGuardMock)
    .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

  });

  it('should be defined', () => {
    
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  
  });

  describe('create', () => {
    
    it('testing if creating users works', async () => {
      const result = await controller.create(fakeUserCreateDTO);

      expect(result).toEqual(fakeUsers[0]);

    });

  });

  describe('read', () => {
    
    it('testing if findAll users works', async () => {
      const result = await controller.findAll();

      expect(result).toEqual(fakeUsers);
      
    });

    it('testing if findOne users works', async () => {
      const result = await controller.findOne(fakeUsers[0].uuid);

      expect(result).toEqual(fakeUsers[0]);
      
    });

  });

  describe('update', () => {
    
    it('testing if updating users works', async () => {
      const result = await controller.update(fakeUsers[0].uuid, fakeUserUpdateDto);

      expect(result).toEqual(fakeUsers[0]);

    });

  });


  describe('delete', () => {
    
    it('testing if deleting users works', async () => {
      
      const result = await controller.remove(fakeUsers[0].uuid);

      expect(result).toEqual(`User ${fakeUsers[0].uuid} removed!`);

    });

  });


  describe('testing guard in this controller', () => {
    
    it('should be defined 2 guards', async () => {
      
      const guards: Array<any> = Reflect.getMetadata('__guards__', UsersController);

      expect(guards.length).toEqual(2);
      expect(new guards[0]).toBeInstanceOf(AuthGuard);
      expect(new guards[1]).toBeInstanceOf(RoleGuard);

    });

  });


});
