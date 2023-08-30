import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from '@prisma/client';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { AuthResetDto } from './dto/auth-reset.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly mailer: MailerService,
  ) {}

  createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          uuid: user.uuid,
        },
        {
          expiresIn: '0.5h',
          subject: user.uuid,
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const verifiedToken = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });

      return verifiedToken;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  isValidToken(token: string): boolean {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async login(dto: AuthLoginDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email and/or password incorrect!');
    }

    if (!(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Email and/or password incorrect!');
    }

    return this.createToken(user);
  }

  async forget(dto: AuthForgetDto): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Email not found!');
    }

    const token = this.createToken(user);

    await this.mailer.sendMail({
      subject: 'Forget Password',
      template: 'forget',
      to: 'lucas.fsl.92@gmail.com',
      context: {
        name: user.name,
        token: token.accessToken,
      },
    });
    return user;
  }

  public async reset(dto: AuthResetDto): Promise<{ accessToken: string }> {
    try {
      const data = this.checkToken(dto.token);
      const password = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.update({
        where: {
          uuid: data.uuid,
        },
        data: {
          password: password,
          updated_at: new Date(),
        },
      });

      return this.createToken(user);
    } catch (error) {
      throw new UnauthorizedException('Token is invalid!');
    }

    //TO DO: get uuid from token
  }

  public async register(
    dto: AuthRegisterDto,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.create(dto);
    console.log(user);
    return await this.createToken(user);
  }
}
