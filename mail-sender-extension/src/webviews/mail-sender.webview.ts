import * as fs from 'fs';
import * as vscode from 'vscode';
import { MailData, SmtpSettings } from '../model/mail.models';
import { ExternalMessage } from '../model/message.model';
import { SmtpMailSender } from '../services/smtp-mail-sender.service';
import { MailSenderConfiguration } from '../util/mail-sender-configuration';

export class MailSenderWebview {
    public static currentInstance: MailSenderWebview | undefined;

    private readonly _panel: vscode.WebviewPanel;
    private readonly _context: vscode.ExtensionContext;

    public static createOrShow(context: vscode.ExtensionContext) {
        if (MailSenderWebview.currentInstance) {
            MailSenderWebview.currentInstance._panel.reveal();
        } else {
            const panel = vscode.window.createWebviewPanel(
                'mail-sender-webview',
                'Mail Sender',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [
                        this.getMediaWebviewsPath(context.extensionUri),
                    ],
                }
            );

            MailSenderWebview.currentInstance = new MailSenderWebview(
                panel,
                context,
            );
        }
    }

    private static getMediaWebviewsPath(extensionUri: vscode.Uri): vscode.Uri {
        return vscode.Uri.joinPath(
            extensionUri,
            'out',
            'media',
            'mail-sender-webviews'
        );
    }

    private constructor(
        panel: vscode.WebviewPanel,
        context: vscode.ExtensionContext,
    ) {
        this._panel = panel;
        this._context = context;

        this.updateContent();

        this._panel.onDidDispose(this.onDidDispose);
        this._panel.webview.onDidReceiveMessage(this.onDidReceiveMessage);
    }

    private onDidDispose = (): void => {
        MailSenderWebview.currentInstance = undefined;
        this._panel.dispose();
    };

    private onDidReceiveMessage = async (message: any) => {
        switch (message?.command) {
            case 'formReady':
                this.sendInitialData();
                break;
            case 'sendMail':
                await this.sendMail(message.data);
                break;
            default:
                break;
        }
    };

    private postMessage(message: any): void {
        this._panel.webview.postMessage(message);
    }

    private updateContent() {
        this._panel.webview.html = this.getHtmlForWebview();
    }

    private sendInitialData = (): void => {
        const msg: ExternalMessage<any> = {
            command: 'initialData',
            data: {
                mailFrom: 'test@example.com',
            },
        };

        this.postMessage(msg);
    };

    private sendMail = async (mailData: MailData): Promise<void> => {
        try {
            // send message waiting
            const message: ExternalMessage<any> = {
                command: 'waiting'
            };

            this.postMessage(message);

            const smtpSettings: SmtpSettings =
                MailSenderConfiguration.smtpSettings;

            const msgid = await SmtpMailSender.sendMail(mailData, smtpSettings);

            const msg: ExternalMessage<any> = {
                command: 'successfullySentEmail'
            };

            this.postMessage(msg);

            vscode.window.showInformationMessage(`Mail sent, msg id ${msgid}.`);
        } catch (err) {

            const msg: ExternalMessage<any> = {
                command: 'failSendingEmail'
            };

            this.postMessage(msg);

            vscode.window.showErrorMessage(`Error sending mail, err: ${err}.`);
        }
    };

    private getHtmlForWebview(): string {
        let html: string;

        const mediaUri = MailSenderWebview.getMediaWebviewsPath(
            this._context.extensionUri
        );

        const indexFilePath = vscode.Uri.joinPath(
            mediaUri,
            'index.html'
        ).fsPath;

        if (fs.existsSync(indexFilePath)) {
            html = fs.readFileSync(indexFilePath, 'utf8');

            const mediaWebviewUri = this._panel.webview.asWebviewUri(mediaUri);

            html = html.replace(
                '<base href="/">',
                `<base href="${mediaWebviewUri.toString()}/">`
            );
        } else {
            html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mail Sender Error</title>
            </head>
            <body>
                <h1>Mail Sender</h1>
            </body>
            </html>`;
        }

        return html;
    }
}
