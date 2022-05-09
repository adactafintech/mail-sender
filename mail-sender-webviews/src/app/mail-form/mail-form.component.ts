import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MailData } from '../model/mail.models';
import { ExternalMessage } from '../model/message.models';
import { MessagingService } from '../services/messaging.service';

export enum MailStatus {
    WAITING = 'waiting',
    SUCCESS = 'successfullySentEmail',
    FAIL = 'failSendingEmail',
}
@Component({
    selector: 'app-mail-form',
    templateUrl: './mail-form.component.html',
    styleUrls: ['./mail-form.component.scss'],
})
export class MailFormComponent implements OnInit, OnDestroy {
    public initialData: any;
    public mailStatus: MailStatus | undefined;
    public mail: MailData = {};
    private _msgReceivedSubscription: Subscription;

    constructor(private _messaging: MessagingService) {
        this._msgReceivedSubscription = _messaging
            .onMessageReceived()
            .subscribe(this.msgReceivedHandler);
    }

    public ngOnDestroy(): void {
        this._msgReceivedSubscription?.unsubscribe();
    }

    public ngOnInit() {
        this._messaging.postMessage('formReady');
    }

    public send(data: MailData): void {
        this._messaging.postMessage('sendMail', data);
        this.mailStatus = MailStatus.WAITING;
    }

    private msgReceivedHandler = (msg: ExternalMessage<any>): void => {
        switch (msg?.command) {            
            case 'initialData':
                this.initialData = msg.data;
                break;
            case 'successfullySentEmail':
                this.mailStatus = MailStatus.SUCCESS;
                break;
            case 'failSendingEmail':
                this.mailStatus = MailStatus.FAIL;
                break;
            default:
                break;
        }
    };
}
