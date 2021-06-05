import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DialogInputComponent } from './dialog-input.component';
import { MaterialModule } from '../../angular-material/material.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'

@NgModule({
    declarations: [
        DialogInputComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        MaterialModule,
        MatRadioModule,
        MatFormFieldModule,

    ],
    entryComponents: [
        DialogInputComponent
    ],
})
export class DialogInputModule
{
}
