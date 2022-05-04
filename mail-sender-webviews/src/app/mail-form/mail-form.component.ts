import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MailData } from '../model/mail.models';
import { ExternalMessage } from '../model/message.models';
import { MessagingService } from '../services/messaging.service';

@Component({
    selector: 'app-mail-form',
    templateUrl: './mail-form.component.html',
    styles: [],
})
export class MailFormComponent implements OnInit, OnDestroy {
    public initialData: any;
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

    public send(): void {
      this._messaging.postMessage('sendMail', this.mail);
    }

    private msgReceivedHandler = (msg: ExternalMessage<any>): void => {
        if (msg?.command === 'initialData') {
          this.initialData = msg.data;
        }
    };
}
