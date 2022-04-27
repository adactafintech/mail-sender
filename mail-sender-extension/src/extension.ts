import * as vscode from 'vscode';
import { MailSenderCommands } from './model/commands';
import { SmtpMailSender } from './services/smtp-mail-sender.service';
import { MailSenderConfiguration } from './util/mail-sender-configuration';

export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Mail Sender Activated');

    context.subscriptions.push(
        vscode.commands.registerCommand(MailSenderCommands.Show, async () => {
            await sendMail();
        })
    );
}

async function sendMail(): Promise<void> {
    try {
        const mailData = {
            from: 'nenad.maricic@mailer.com',
            to: 'test@mailer.com',
            subject: `msg ${new Date()}`,
            body: '',
        };
        const smtpSettings = MailSenderConfiguration.smtpSettings;

        const msgId = await SmtpMailSender.sendMail(mailData, smtpSettings);

        vscode.window.showInformationMessage(`Mail sent, message id ${msgId}`);
    } catch (err) {
        vscode.window.showErrorMessage(`Error while sending mail: ${err}`);
    }
}
