import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { CommonDialogComponent } from './common-dialog.component';

@NgModule({
    declarations: [
        CommonDialogComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule
    ],
    entryComponents: [
        CommonDialogComponent
    ],
})
export class CommonDialogModule
{
}
