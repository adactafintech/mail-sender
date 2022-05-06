import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MailStatus } from '../mail-form/mail-form.component';
import { MailData } from '../model/mail.models';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss', '../mail-form/mail-form.component.scss']
})
export class FormComponent implements OnChanges {
  @Input() public data: any;
  @Input() public mailStatus: MailStatus | undefined;
  @Output() public sendMail: EventEmitter<any> = new EventEmitter();

  public waiting = false;

  get emailsTo() {
    return this.reactiveForm.get('usersTo');
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && this.reactiveForm.get('newEmail')?.valid) {
      this.emailsTo?.value.push(value);

      event.chipInput!.clear();
      this.reactiveForm.get('newEmail')?.reset();
    }
  }

  remove(email: string): void {
    const index = this.emailsTo?.value.indexOf(email);

    if (index >= 0) {
      this.emailsTo?.value.splice(index, 1);
    }
  }

  public reactiveForm: FormGroup;

  public userToValidationWarning: string = 'Email is not in valid form';
  public subjectValidationWarning: string = 'Subject is required';
  public mailContentValidationWarning: string = 'Mail content is required';

  constructor() {
    this.reactiveForm = new FormGroup({
      userFrom: new FormControl({ value: null, disabled: true }),
      usersTo: new FormControl([], [Validators.email, Validators.required]),
      newEmail: new FormControl(null, [Validators.email, Validators.required]),
      subject: new FormControl(null, Validators.required),
      mailContent: new FormControl(null, Validators.required),
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.reactiveForm.patchValue({
        userFrom: changes.data.currentValue?.mailFrom,
      });
    }

    if (changes['mailStatus']?.currentValue === MailStatus.WAITING) {
      this.waiting = true;
      this.disableForm();
    }

    if (changes['mailStatus']?.currentValue === MailStatus.SUCCESS) {
      this.waiting = false;
      this.enableForm();
      this.resetReactiveForm();
    }

    if (changes['mailStatus']?.currentValue === MailStatus.FAIL) {
      this.waiting = false;
      this.enableForm();
    }
  }

  public submitMail() {
    const mail: MailData = {
      from: this.reactiveForm.get('userFrom')?.value, to: this.reactiveForm.get('usersTo')?.value,
      subject: this.reactiveForm.get('subject')?.value, body: this.reactiveForm.get('mailContent')?.value,
    };
    this.sendMail.emit(mail);
  }

  public resetReactiveForm(): void {
    this.reactiveForm.patchValue({
      usersTo: [],
    });
    this.reactiveForm.get('newEmail')?.reset();
    this.reactiveForm.get('subject')?.reset();
    this.reactiveForm.get('mailContent')?.reset();
  }

  public isFormValid(): boolean | undefined {
    return this.reactiveForm.get('usersTo')?.value.length > 0 && this.reactiveForm.get('subject')?.valid && this.reactiveForm.get('mailContent')?.valid;
  }

  private enableForm(): void {
    this.reactiveForm.get('usersTo')?.enable();
    this.reactiveForm.get('newEmail')?.enable();
    this.reactiveForm.get('subject')?.enable();
    this.reactiveForm.get('mailContent')?.enable();
  }

  private disableForm(): void {
    this.reactiveForm.disable();
  }
}
