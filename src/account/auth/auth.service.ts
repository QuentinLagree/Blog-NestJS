import { Session } from '@fastify/secure-session';
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare } from 'bcryptjs';
import { UserLoginCredentials, UserSession } from '../../database/entities/user/user.dto';
import { PrismaService } from '../../database/prisma.service';
import { PasswordNotMatchException } from '../../usecases/utils/errors/PasswordNotMatchException.error';
import { UserAlreadyActiveSession } from '../../usecases/utils/errors/UserAlreadyActiveSession.error';
import { PasswordNotSameException } from 'src/usecases/utils/errors/PasswordNotSame.error';

@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async login(logginDto: UserLoginCredentials): Promise<User> {
        try {
            const user = await this.prisma.user.findUnique({ where: { email: logginDto.email } })
            if (!user) throw new NotFoundException();

            let hasSamePassword: boolean = await this.comparePassword(logginDto.password, user.password);

            if (!hasSamePassword) throw new PasswordNotMatchException();

            return user
        } catch (error) {
            throw error;
        }
    }

    setUserSession(session: Session, user: UserSession): void {
        if (session.get('user')) {
            throw new UserAlreadyActiveSession();
        }
        session.set('user', user);
        return;
    }

    private async comparePassword(password: string, hash: string): Promise<boolean> {
        return await compare(password, hash);
    }

    public async throwAnNotSamePasswordExceptionIfNotSame(password: string, confirm_password: string): Promise<void> {
        console.log("Same password")
        if (password !== confirm_password) {
            throw new PasswordNotSameException();
        }
    }
}