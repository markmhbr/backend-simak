import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = this.configService.get<number>('SMTP_PORT');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    const from = this.configService.get<string>('SMTP_FROM') || 'no-reply@simak.com';
    try {
      await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      });
      this.logger.log(`Email successfully sent to ${to}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
      return false;
    }
  }

  async sendOTP(to: string, otp: string, name: string): Promise<boolean> {
    const subject = 'Verification Code - Reset 2FA';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #2563eb; text-align: center;">Reset 2FA Verification</h2>
        <p>Halo <strong>${name}</strong>,</p>
        <p>Kami menerima permintaan untuk menyetel ulang Autentikasi Dua Faktor (2FA) akun Anda di aplikasi <strong>SIMAK</strong>.</p>
        <p>Gunakan kode OTP di bawah ini untuk memverifikasi proses reset 2FA Anda:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a; background-color: #f3f4f6; padding: 10px 20px; border-radius: 8px; border: 1px dashed #cbd5e1;">
            ${otp}
          </span>
        </div>
        <p style="color: #ef4444; font-weight: bold;">Kode OTP ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapapun.</p>
        <p>Jika Anda tidak merasa mengajukan reset 2FA ini, abaikan email ini atau hubungi admin sekolah Anda.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">Ini adalah email otomatis, mohon tidak membalas email ini.</p>
      </div>
    `;
    return this.sendMail(to, subject, html);
  }
}
