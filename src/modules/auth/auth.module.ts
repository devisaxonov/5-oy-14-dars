import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OptService } from './otp.service';
import { SmsService } from './sms.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService,OptService,SmsService],
})
export class AuthModule {}
