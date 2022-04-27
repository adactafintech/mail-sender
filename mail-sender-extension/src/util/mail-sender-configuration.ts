import * as vscode from 'vscode';
import { SmtpSettings } from '../model/mail.models';

export class MailSenderConfiguration {
    protected static getMailSenderSection(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration('mailSender'); // section name
    }

    public static get smtpSettings(): SmtpSettings {
        const section = this.getMailSenderSection();
        return {
            host: section.get('host') || '',
            port: section.get<number>('port') || NaN,
            secure: section.get<boolean>('secure') || false,
            username: section.get('username') || '',
            password: section.get('password') || '',
        };
    }
}
