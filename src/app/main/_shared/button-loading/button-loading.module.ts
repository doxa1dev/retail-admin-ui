import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule} from 'app/main/angular-material/material.module'
import { CommonModule } from '@angular/common';
import { ButtonLoadingComponent} from './button-loading.component';
import { MatProgressButtonsModule } from 'mat-progress-buttons';

@NgModule({
    declarations: [
        ButtonLoadingComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        MatProgressButtonsModule,
        MaterialModule
    ],
    entryComponents: [
        ButtonLoadingComponent
    ],
    exports: [
        ButtonLoadingComponent
    ]
})
export class ButtonLoadingModule
{
}
