import { AppService } from './app.service';
import type { Request } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getProtectedData(req: Request): {
        message: string;
        app_info: {
            id: any;
            nama_app: any;
            sekolah_id: any;
            key_api: any;
        };
    };
}
