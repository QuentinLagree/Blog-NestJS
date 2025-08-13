import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AccountModule } from './account/account.module';
import { DatabaseModule } from './database/database.module';
import { LoggerService } from './usecases/handle_log/logger.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [AccountModule, DatabaseModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: 2525,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      }
    })
  ],
  providers: [LoggerService],
  controllers: [AppController],
})
export class AppModule { }
