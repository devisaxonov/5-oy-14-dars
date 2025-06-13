import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto, SendOtpDto } from './dto/create-auth.dto';
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
  async sendOtpUser(data: SendOtpDto) {
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
    const sessionToken = await this.otpService.verifyOtpSendedUser(key, data.code,data.phone_number);
    return {
      message: 'success',
      status: 200,
      session_token: sessionToken
    };
  }

  async register(data: RegisterDto) {
      const findUser = await this.db.prisma.user.findUnique({
      where: {
        phone_number: data.phone_number,
      },
    });

    if (findUser) throw new ConflictException('Phone number already exists!');
    const key = `sessionToken:${data.phone_number}`
    await this.otpService.checkSessionTokenUser(key, data.session_token);

    const hashedPass = await bcrypt.hash(data.password, 12);

    const user = await this.db.prisma.user.create({
      data: {
        phone_number: data.phone_number,
        password: hashedPass
      }
    });

    const token = this.jwt.sign({ userId: user.id });
    await this.redis.delKey(key);

    return token 
  }
  async login() {}
}
