import { Injectable } from "@nestjs/common";
import ENDPOINTS from "src/common/constants/endpoints";
import axios from "axios";

@Injectable()
export class SmsService{
    private email: string = process.env.ESKIZ_EMAIL as string;
    private password: string = process.env.ESKIZ_PASSWORD as string;
    constructor() { }
    async getToken() {
        const url = ENDPOINTS.getEskizTokenUrl();
    }
}