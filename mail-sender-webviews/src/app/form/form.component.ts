import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MailData } from '../model/mail.models';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnChanges {
  @Input() public data: any;
  @Output() public sendMail: EventEmitter<any> = new EventEmitter();

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

  reactiveForm: FormGroup;

  userToValidationWarning: string = 'Email is not in valid form';
  subjectValidationWarning: string = 'Subject is required';
  mailContentValidationWarning: string = 'Mail content is required';

  constructor(private fb: FormBuilder) {
    this.reactiveForm = new FormGroup({
      userFrom: new FormControl({ value: null, disabled: true }),
      usersTo: new FormControl([], [Validators.email, Validators.required]),
      newEmail: new FormControl(null, [Validators.email, Validators.required]),
      subject: new FormControl(null, Validators.required),
      mailContent: new FormControl(null, Validators.required),
    });
  }
  
  public ngOnChanges(changes: SimpleChanges): void {
    this.reactiveForm.patchValue({
      userFrom: changes['data'].currentValue.mailFrom,
    });
  }

  submitMail() {
    const mail: MailData = {
      from: this.reactiveForm.get('userFrom')?.value, to: this.reactiveForm.get('usersTo')?.value,
      subject: this.reactiveForm.get('subject')?.value, body: this.reactiveForm.get('mailContent')?.value,
    };
    this.sendMail.emit(mail);
  }

  resetReactiveForm(): void {
    this.reactiveForm.get('usersTo')?.reset();
    this.reactiveForm.get('newEmail')?.reset();
    this.reactiveForm.get('subject')?.reset();
    this.reactiveForm.get('mailContent')?.reset();
  }

  isFormValid(): boolean | undefined {
    return this.reactiveForm.get('usersTo')?.value.length > 0 && this.reactiveForm.get('subject')?.valid && this.reactiveForm.get('mailContent')?.valid;
  }
}
