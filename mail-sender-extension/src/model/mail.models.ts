export interface MailData {
    from: string;
    to: string;
    subject: string;
    body: string;
}

export interface SmtpSettings {
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
}