import { IsJWT, IsStrongPassword } from "class-validator";

export class AuthResetDto {
    
    @IsStrongPassword({
        minLength: 6, 
        minNumbers: 1,
        minLowercase: 1,
        minSymbols: 1,
        minUppercase: 1       
    })
    password: string;


    @IsJWT()
    token: string;

}