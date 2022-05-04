import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MailFormComponent } from './mail-form/mail-form.component';

@NgModule({
    declarations: [AppComponent, MailFormComponent],
    imports: [BrowserModule, FormsModule, CommonModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
