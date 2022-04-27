import * as nodemailer from 'nodemailer';
import { MailData, SmtpSettings } from '../model/mail.models';

export class SmtpMailSender {

    public static async sendMail(
        mailData: MailData,
        smtpSettings: SmtpSettings
    ): Promise<string> {
        const transporter = nodemailer.createTransport({
            host: smtpSettings.host,
            port: smtpSettings.port,
            secure: smtpSettings.secure,
            auth: {
                user: smtpSettings.username,
                pass: smtpSettings.password,
            },
        });

        const result = await transporter.sendMail({
            from: mailData.from,
            to: mailData.from,
            subject: mailData.subject,
            text: mailData.body,
        });

        return result.messageId;
    }
}
