import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal:true
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            global: true,
            useFactory: (configService:ConfigService) => ({
                secret: configService.get("JWT_KEY"),
                signOptions: {
                    expiresIn: '1h'
                }
            }),
            inject:[ConfigService]
        })
    ],
    exports:[]
})

export class CoreModule{}