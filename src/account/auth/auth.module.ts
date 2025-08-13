import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from 'src/usecases/token/token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, TokenService],
  exports: [AuthService, PrismaService, UserService, TokenService]
})
export class AuthModule {}
