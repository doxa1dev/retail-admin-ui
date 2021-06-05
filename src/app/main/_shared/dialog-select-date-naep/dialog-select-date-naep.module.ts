import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DialogSelectDateNaepComponent } from './dialog-select-date-naep.component';
import { MaterialModule } from '../../angular-material/material.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms'
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    declarations: [
      DialogSelectDateNaepComponent,
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
        CalendarModule
    ],
    entryComponents: [
      DialogSelectDateNaepComponent
    ],
    exports: [
      DialogSelectDateNaepComponent
    ]
})
export class DialogSelectDateNaepModule
{
}
