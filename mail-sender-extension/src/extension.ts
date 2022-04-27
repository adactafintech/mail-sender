import * as vscode from 'vscode';
import { MailSenderCommands } from './model/commands';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage('Mail Sender Activated');

    context.subscriptions.push(
        vscode.commands.registerCommand(MailSenderCommands.Show, () => {
            vscode.window.showInformationMessage('Mail Sender Should Show.');
        })
    );
}
