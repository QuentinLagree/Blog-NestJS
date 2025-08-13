import { PartialType, OmitType } from "@nestjs/swagger";
import { Post, User } from "@prisma/client";
import { IsNotEmpty, Length, IsString, IsEmail, MinLength, IsBoolean, IsOptional, isNumber, IsNumber } from "class-validator";
import { PostsEntity } from "./posts.entities";

export class PostsDto extends PartialType(PostsEntity) {
    @IsNotEmpty()
        id: number;
        @IsNotEmpty()
        authorId: number;
        @IsNotEmpty()
        title: string;
        @IsNotEmpty()
        content: string;
        @IsNotEmpty()
        published: boolean;
        @IsNotEmpty()
        created_at: Date;
        @IsNotEmpty()
        updated_at: Date;
        @IsNotEmpty()
        author: User
}

export class CreatePostDto extends PartialType(OmitType(PostsEntity, ["id", "updated_at", "created_at"] as const) ) {

    @IsNotEmpty()
    @IsNumber()
    authorId: number;

    @IsNotEmpty()
    @IsString()
    @Length(5, 20)
    title: string;

    @IsNotEmpty()
    @IsString()
    content: string;

    published: boolean;
}
