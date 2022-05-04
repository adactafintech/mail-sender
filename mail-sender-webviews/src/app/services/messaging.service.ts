declare let vscode: any;

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ExternalMessage } from '../model/message.models';

@Injectable({
    providedIn: 'root',
})
export class MessagingService {
    private _vscode: any = vscode;
    private _externalMessageSubject: Subject<any> = new Subject();

    constructor() {
        window.addEventListener('message', this.processIncomingMessage);
    }

    public onMessageReceived(): Observable<any> {
        return this._externalMessageSubject.asObservable();
    }

    public postMessage(command: string, data?: any): void {
        const message: ExternalMessage<any> = {
            command,
            data,
        };

        this._vscode?.postMessage(message);
    }

    protected processIncomingMessage = (e: any): void => {
        const message: ExternalMessage<any> = e.data;

        if (message.command) {
            this._externalMessageSubject.next(message);
        }
    };
}
