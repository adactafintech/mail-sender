import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
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
      userFrom: new FormControl({ value: 'opsa', disabled: true }),
      usersTo: new FormControl([], [Validators.email, Validators.required]),
      newEmail: new FormControl(null, [Validators.email, Validators.required]),
      subject: new FormControl(null, Validators.required),
      mailContent: new FormControl(null, Validators.required),
    });
  }

  submitMail() {
    console.log('aa', this.reactiveForm.get('userTo')?.value);

  }

  resetReactiveForm(): void {
    this.reactiveForm.reset();
  }

  isFormValid(): boolean | undefined {
    return this.reactiveForm.get('userTo')?.valid && this.reactiveForm.get('subject')?.valid && this.reactiveForm.get('mailContent')?.valid;
  }
}
