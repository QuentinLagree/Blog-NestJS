import { ValidationError } from "@nestjs/common";
import { ApiProperty, OmitType, PartialType, PickType } from "@nestjs/swagger";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { IsBoolean, IsDefined, IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength, validate, ValidateIf } from "class-validator";
import { UserEntity } from "../../entities/user/user.entities";
import { Post } from "@prisma/client";
import { CreatePostDto } from "../posts/posts.dto";

export class UserDto extends OmitType(UserEntity, ["id", "updated_at", "created_at", "posts"] as const) {
    @IsDefined({
        message: "Le Nom de famille doit être défini."
    })
    @MinLength(1, { message: 'Le nom de famille doit contenir au moins 1 caractère.' })
    @MaxLength(50, { message: 'Le nom de famille doit contenir au maximum 50 caractères.' })
    nom: string;
    @IsDefined({
        message: "Le Prénom doit être défini."
    })
    
    @MinLength(2, { message: 'Le Prénom doit contenir au moins 2 caractères.' })
    @MaxLength(16, { message: 'Le Prénom doit contenir au maximum 16 caractères.' })
    @IsString()
    prenom: string;
    @IsNotEmpty()
    @IsString()
    @MinLength(2, { message: 'Le Pseudo doit contenir au moins 2 caractères.' })
    @MaxLength(16, { message: 'Le Pseudo doit contenir au maximum 16 caractères.' })
    pseudo: string;
    @IsNotEmpty({
        message: "L'email doit être défini."
    })
    
    @IsEmail({}, { message: "L'email n'est pas valide."})
    @MinLength(5, {
        message: "L'email doit avoir au minimum 5 caractères."
    })
    @MaxLength(255, { message: "L'email doit contenir au maximum 255 caractères." })
    email: string;
    @IsNotEmpty({
        message: "L'Adresse email doit être défini."
    })
    @MinLength(4 , {
        message: "Le mot de passe doit avoir 4 caractères minimum."
    })
    @IsString()
    @MaxLength(255, { message: "Le mot de passe doit contenir au maximum 255 caractères." })
    password: string;
    @IsString()
    @MaxLength(255, { message: "Le rôle doit contenir au maximum 255 caractères." })
    role: string
}

export class UserUpdateDto extends PartialType(UserEntity) {
  @IsOptional()
  @IsString()
//   @Length(3, 50)
  nom?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  prenom?: string;

  @IsOptional()
  @IsString()
  @Length(2, 16)
  pseudo?: string;

  
  @IsOptional()
  @IsString()
  @MinLength(4)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

export class UserLoginCredentials extends PickType(UserEntity, ['email', 'password'] as const) {
    @IsNotEmpty()
    @IsString()
    @IsEmail({}, {message: "L'email n'est pas valide !"})
    email: string
    @MinLength(4)
    @IsString()
    password: string
}

export type dto = UserDto | UserUpdateDto | UserLoginCredentials | UserEmail | UserPasswordFields | CreatePostDto

export class UserEmail extends PartialType(OmitType(UserLoginCredentials, ["password"] as const)) {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string
}

export class UserSession {
    id: number
    email: string
    role: string
}

export class UserPasswordFields{

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string
    
    @ApiProperty()
    @MinLength(4)
    @IsString()
    old_password: string
    @ApiProperty()
    @MinLength(4)
    @IsString()
    password: string
    @ApiProperty()
    @MinLength(4)
    @IsString() 
    confirm_password: string
}



export const dtoIsValid = async (dto: dto, tagetDto: ClassConstructor<dto> = UserDto): Promise<ValidationError[]> => {
    const errors: ValidationError[] = await validate(plainToInstance(tagetDto, dto))
    return errors
 }