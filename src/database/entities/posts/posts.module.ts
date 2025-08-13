import { Module } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { PostController } from "src/posts/posts.controller";
import { PostsService } from "src/posts/posts.service";

@Module({
    controllers: [PostController],
    providers: [PostsService, PrismaService],
    exports: [PostsService, PrismaService]
})

export class PostsModule {}