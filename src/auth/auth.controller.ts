import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { AuthResetDto } from './dto/auth-reset.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../decorators/user.decorator';
import { FileService } from '../file/file.service';
import { AuthGuard } from '../guards/auth.guard';
import { User as UserPrima } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  public async login(@Body() dto: AuthLoginDto) {
    return await this.authService.login(dto);
  }

  @Post('register')
  public async register(@Body() dto: AuthRegisterDto) {
    return await this.authService.register(dto);
  }

  @Post('forget')
  public async forget(@Body() dto: AuthForgetDto) {
    return await this.authService.forget(dto);
  }

  @Post('reset')
  public async reset(@Body() dto: AuthResetDto) {
    return await this.authService.reset(dto);
  }

  @UseGuards(AuthGuard)
  @Post('about-me')
  async aboutMe(
    @User() user,
    @Req() { token },
  ): Promise<{ user: UserPrima; token: object }> {
    return { user, token };
  }

  @UseGuards(AuthGuard)
  @Post('send-image')
  @UseInterceptors(FileInterceptor('image'))
  async sendImage(
    @User() user,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1 * 1024 * 1024,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    image: Express.Multer.File,
  ) {
    try {
      await this.fileService.storage(image);
    } catch (error) {
      throw new BadRequestException(error);
    }

    return HttpStatus.ACCEPTED;
  }
}
