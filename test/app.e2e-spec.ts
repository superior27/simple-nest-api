import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { fakeAuthRegisterDTO } from '../src/testing/auth/auth-register-dto.mock';
import { fakeAuthLoginDto } from '../src/testing/auth/auth-login-dto.mock';
import { Role } from '../src/enums/role.enum';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let admin;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('should be register a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(fakeAuthRegisterDTO);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
  });

  it('should be login with user created in previous test', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(fakeAuthLoginDto);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');

    accessToken = response.body.accessToken;
  });

  it('should be return about me from user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/about-me')
      .set('Authorization', `bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.user.id).toEqual('number');
    expect(response.body.user.role).toEqual(Role.USER);
  });

  it('should not be list all user', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(403);
    expect(response.body.error).toEqual('Forbidden');
  });

  it('should be create a user role to admin', async () => {
    const prisma = new PrismaService();

    admin = await prisma.user.create({
      data: {
        name: 'Admin Fodão',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('123456', 10),
        role: 2,
      },
    });

    expect(Object.keys(admin).length).toBeGreaterThanOrEqual(1);
    expect(admin.role).toEqual(Role.ADMIN);
  });

  it('should be list all user, because user is admin', async () => {
    const responseToken = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: admin.email, password: '123456' });

    const newAccessToken = responseToken.body.accessToken;

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `bearer ${newAccessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});
