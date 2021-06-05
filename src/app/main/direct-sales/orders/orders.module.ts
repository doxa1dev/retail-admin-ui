import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../angular-material/material.module';
import { OrdersComponent} from './orders.component';

import { AgGridModule } from '@ag-grid-community/angular';
import { HttpClientModule } from '@angular/common/http';
import { InvoiceModule } from './page-action/invoice/invoice.module';
import { InputTextModule} from 'primeng/inputtext';

const routes = [
    {
        path: 'direct-sales/orders',
        component: OrdersComponent
    },
];

@NgModule({
    declarations: [
        OrdersComponent,

    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        HttpClientModule,
        AgGridModule.withComponents([]),
        InvoiceModule,
        InputTextModule
    ],
    exports: [
        OrdersComponent,
    ]
})

export class OrdersModule
{
}
