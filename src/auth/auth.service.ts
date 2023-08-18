import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { AuthForgetDto } from './dto/auth-forget.dto';
import { AuthResetDto } from './dto/auth-reset.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    private issuer = 'login';
    private audience = 'users';

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UsersService,
    )
    {

    }

    async createToken(user: User) {
        return {
            accessToken: this.jwtService.sign(
                {
                    uuid: user.uuid,

                },
                {
                    expiresIn: "0.5h",
                    subject: user.uuid,
                    issuer: this.issuer,
                    audience: this.audience,
                })
            }
    }

    async checkToken(token: string)
    {
        try 
        {
            const verifiedToken = this.jwtService.verify(token, {
                issuer: this.issuer,
                audience: this.audience
            });

            return verifiedToken;
            
        } 
        catch (error)
        {
            throw new BadRequestException(error);
            
        }        

    }

    async isValidToken(token: string) : Promise<boolean>
    {
        try 
        {
            this.checkToken(token);
            return true;
        } 
        catch (error) 
        {
            return false;
        }
    }

    public async login(dto: AuthLoginDto) : Promise<{}>
    {
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
                password: dto.password
            }
        });

        if(!user)
        {
            throw new UnauthorizedException("Email and/or password incorrect!");
        }

        return this.createToken(user);

    }

    public async forget(dto: AuthForgetDto) : Promise<User>
    {
        const user = await this.prisma.user.findFirst({
            where: {
                email: dto.email
            }
        });

        if(!user)
        {
            throw new NotFoundException("Email not found!");
        }

        //TO DO: Send email
        return user;

    }

    public async reset(dto: AuthResetDto) : Promise<{}>
    {
        //TO DO: Validated token

        //TO DO: get uuid from token
        const uuid = '';

        const user = await this.prisma.user.update({
            where:{
                uuid
            },
            data:dto
        });

        return this.createToken(user);

    }

    public async register(dto: AuthRegisterDto) : Promise<{}>
    {
        const user = await this.userService.create(dto);
        return await this.createToken(user);
    }

}
