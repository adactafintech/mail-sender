import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { MailFormComponent } from './mail-form/mail-form.component';
import { MatChipsModule } from '@angular/material/chips';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'

@NgModule({
    declarations: [AppComponent, MailFormComponent, FormComponent],
    imports: [BrowserModule, FormsModule, CommonModule, ReactiveFormsModule, MatChipsModule, NoopAnimationsModule, MatFormFieldModule, MatIconModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
