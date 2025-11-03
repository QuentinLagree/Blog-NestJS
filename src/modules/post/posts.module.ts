import { Module } from '@nestjs/common';
import { PostController } from './posts.controller';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { PostsService } from './posts.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [PostController],
  providers: [PostsService, PrismaService, UserService],
  exports: [PostsService, PrismaService, UserService],
})
export class PostsModule {}
