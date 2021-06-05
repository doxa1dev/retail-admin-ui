import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from "@fuse/shared.module";
import { CommonModule } from '@angular/common';
import { DialogChangePaymentTypeComponent} from './dialog-change-payment-type.component';
import { DropdownModule } from "primeng/dropdown";
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
    declarations: [
      DialogChangePaymentTypeComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        DropdownModule,
        FuseSharedModule,
        MatFormFieldModule
    ],
    entryComponents: [
      DialogChangePaymentTypeComponent
    ]
})
export class DialogChangePaymentTypeModule
{
}
