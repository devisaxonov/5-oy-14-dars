import { BadRequestException, Injectable } from "@nestjs/common";
import { RedisService } from "src/core/database/redis.service";
import {generate} from 'otp-generator'
@Injectable()
export class OptService{
    constructor(private redisService: RedisService) { }

    generateOtp() {
        const otp = generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            specialChars: false,
            upperCaseAlphabets:false
        })
        return otp
    }

    async sendOtp(phone_number: string) {
        await this.checkOtpExisted(`user:${phone_number}`)
        const tempOtp = this.generateOtp();
        const responseRedis = await this.redisService.setOtp(phone_number, tempOtp);
        if (responseRedis == 'OK') {
            return true
        }
    }

    async checkOtpExisted(key: string) {
        const checkOtp = await this.redisService.getOtp(key);
        if (checkOtp) {
            const ttl = await this.redisService.getTTL(key);
            throw new BadRequestException(`Please try again later after ${ttl} seconds`);
        }
    }

    async verifyOtpSendedUser(key:string,code:string) {
        const otp = await this.redisService.getOtp(key);
        if (!otp || otp !== code) throw new BadRequestException("Invalid kod");
    }
    
}