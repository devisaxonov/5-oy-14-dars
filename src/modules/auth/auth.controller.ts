import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Response } from 'express';
import { verifyOtpDto } from './dto/verify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post('send-otp')
  async register(@Body() data: CreateAuthDto) {
    const response = await this.authService.register(data)
    return response;
  }
  
  @Post('login')
  async login() { }

  @Post('verify-otp')
  async verifyOtp(@Body() data:verifyOtpDto , @Res() res:Response) {
    return await this.authService.verifyOtp(data)
  }
  
}
