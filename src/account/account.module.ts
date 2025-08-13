import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserService } from './user/user.service';
import { PrismaService } from 'src/database/prisma.service';
import { PasswordRecoveryModule } from './handle_password/password_recovery.module';
import { PostsModule } from 'src/database/entities/posts/posts.module';

@Module({
    imports: [ AuthModule, PostsModule, PasswordRecoveryModule , UserModule],
    providers: [UserService, PrismaService]
})
export class AccountModule {}
