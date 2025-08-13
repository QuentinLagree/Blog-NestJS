import { Module } from "@nestjs/common";
import { PasswordRecoveryController } from "./password_recovery.controller";
import { AuthService } from "../auth/auth.service";
import { PrismaService } from "src/database/prisma.service";
import { UserService } from "../user/user.service";
import { TokenService } from "src/usecases/token/token.service";
import { MailService } from "src/usecases/mailer/mailer.service";

@Module({
    controllers: [PasswordRecoveryController],
    providers: [AuthService, PrismaService, UserService, TokenService, MailService],
    exports: [AuthService, PrismaService, UserService, TokenService, MailService]
})

export class PasswordRecoveryModule {}