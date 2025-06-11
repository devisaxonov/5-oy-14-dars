import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OptService } from './otp.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService,OptService],
})
export class AuthModule {}
