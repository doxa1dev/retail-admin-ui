import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import {  ConfirmDialogComponent} from './confirm-dialog.component';

@NgModule({
    declarations: [
        ConfirmDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule
    ],
    entryComponents: [
        ConfirmDialogComponent
    ]
})
export class ConfirmDialogModule
{
}