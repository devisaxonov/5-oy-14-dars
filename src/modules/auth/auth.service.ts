import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { verifyOtpDto } from './dto/verify';
import PrismaService from 'src/core/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/core/database/redis.service';
import bcrypt from 'bcrypt';
import { OptService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
    private redis: RedisService,
    private otpService: OptService,
  ) {}
  async register(data: CreateAuthDto) {
    const findUser = await this.db.prisma.user.findUnique({
      where: {
        phone_number: data.phone_number,
      },
    });

    if (findUser) throw new ConflictException('Phone number already exists!');
    const res = await this.otpService.sendOtp(data.phone_number);
    if (!res) throw new InternalServerErrorException('server error');
    return {
      message: 'code sended',
    };
  }
  async verifyOtp(data: verifyOtpDto) {
    const key = `user:${data.phone_number}`;
    await this.otpService.verifyOtpSendedUser(key, data.code);
    return {
      message: 'success',
      status:200
    }
  }
  async login() {}
}
