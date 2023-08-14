import { Contains, IsEmail, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {


    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsEmail()
    @MaxLength(100)
    email: string;

    @IsStrongPassword({
        minLength: 6, 
        minNumbers: 1,
        minLowercase: 1,
        minSymbols: 1,
        minUppercase: 1       
    })
    password: string;

    


}
