import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: `3m=gC]58vZSJf%J'eAMKrQ_>;d89eUhjTx("&)q=5qs8<pN:){gm%g$rZe}TYB@*`
  }),
    UsersModule,
    PrismaModule,
],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
