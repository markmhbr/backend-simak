import { AppService } from './app.service';
import { PrismaService } from './core/prisma/prisma.service';
import type { Request, Response } from 'express';
export declare class AppController {
    private readonly appService;
    private readonly prisma;
    constructor(appService: AppService, prisma: PrismaService);
    getHello(): string;
    redirectProfile(sekolahId: string, id: string, res: Response): Promise<void>;
    redirectProfileById(id: string, res: Response): Promise<void>;
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
