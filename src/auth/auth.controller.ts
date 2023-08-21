import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { AuthResetDto } from './dto/auth-reset.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    ){}


  @Post('login')
  public async login(@Body() dto: AuthLoginDto) 
  {
    return await this.authService.login(dto);
    
  }

  @Post('register')
  public async register(@Body() dto: AuthRegisterDto)
  {
    return await this.authService.register(dto);

  }

  @Post('forget')
  public async forget(@Body() dto: AuthForgetDto)
  {
    return await this.authService.forget(dto);

  }

  @Post('reset')
  public async reset(@Body() dto: AuthResetDto)
  {

  }

  @UseGuards(AuthGuard)
  @Post('about-me')
  async aboutMe(@User() user)
  {
    return user;

  }



}
