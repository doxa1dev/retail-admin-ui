import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import {  DialogConfirmComponent} from './dialog-confirm.component';

@NgModule({
    declarations: [
        DialogConfirmComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule
    ],
    entryComponents: [
        DialogConfirmComponent
    ],
})
export class DialogConfirmModule
{
}
