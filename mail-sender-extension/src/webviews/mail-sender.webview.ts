import * as fs from 'fs';
import * as vscode from 'vscode';

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
                context
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
        context: vscode.ExtensionContext
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

    private onDidReceiveMessage = (message: any) => {
        console.log(message);
    };

    private postMessage(message: any): void {
        this._panel.webview.postMessage(message);
    }

    private updateContent() {
        this._panel.webview.html = this.getHtmlForWebview();
    }

    private getHtmlForWebview() {
        let html: string;

        const indexFilePath = vscode.Uri.joinPath(
            MailSenderWebview.getMediaWebviewsPath(this._context.extensionUri),
            'index.html'
        ).fsPath;

        if (fs.existsSync(indexFilePath)) {
            html = fs.readFileSync(indexFilePath, 'utf8');
        } else {
            html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Mail Sender Error</title>
			</head>
			<body>
				<h1>Mail Sender Media Not Found</h1>
			</body>
			</html>`;
        }

        return html;
    }
}
