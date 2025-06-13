import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, SendOtpDto } from './dto/create-auth.dto';
import { Response } from 'express';
import { verifyOtpDto } from './dto/verify';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  
  @Post('send-otp')
  async sendOtpUser(@Body() data: SendOtpDto) {
    const response = await this.authService.sendOtpUser(data)
    return response;
  }
  
  @Post('login')
  async login() { }

  @Post('verify-otp')
  async verifyOtp(@Body() data: verifyOtpDto) {    
    return await this.authService.verifyOtp(data)
  }
  
  @Post('register')
  async register(@Body() data: RegisterDto,@Res({passthrough:true}) res: Response) {
    const token = await this.authService.register(data);
    res.cookie(
      'token', token, {
        maxAge: 1 * 3600 * 1000,
        httpOnly:true
      }
    )
    return token
  }
}
