import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../../../../angular-material/material.module';
import { DeliveryAddressComponent } from './delivery-address.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    declarations: [
        DeliveryAddressComponent
    ],
    imports: [
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        CalendarModule
    ],
    exports: [
        DeliveryAddressComponent,
    ]
})

export class DeliveryAddressModule
{
}
