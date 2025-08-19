import { Module } from '@nestjs/common';
import { PostController } from './posts.controller';
import { PrismaService } from 'src/commons/prisma/prisma.service';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostController],
  providers: [PostsService, PrismaService],
  exports: [PostsService, PrismaService],
})
export class PostsModule {}
