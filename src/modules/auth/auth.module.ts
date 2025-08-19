import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from 'src/commons/token/token.service';
import { PrismaService } from 'src/commons/prisma/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, TokenService],
  exports: [AuthService, PrismaService, UserService, TokenService],
})
export class AuthModule {}
