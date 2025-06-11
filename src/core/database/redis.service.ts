import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
@Injectable()
export class RedisService{
    private redis: Redis;
    private duration:number = 180;
    constructor() {
        this.redis = new Redis({
            port: +(process.env.REDIS_PORT as string),
            host: process.env.REDIS_HOST as string
        });
        this.redis.on('connect', () => {
            console.log('Redis connected');
        })
        this.redis.on('error', () => {
            console.log('Redis connecting error');
            this.redis.quit();
        })
    }

    async setOtp(phone_number:string,otp:string) {
        const key = `user:${phone_number}`;
        const res = await this.redis.setex(key, this.duration, otp);
        return res
    }

    async getOtp(key: string) {
        const otp = await this.redis.get(key);
        return otp
    }

    async getTTL(key:string) {
        const ttl = await this.redis.ttl(key);
        return ttl
    }
}