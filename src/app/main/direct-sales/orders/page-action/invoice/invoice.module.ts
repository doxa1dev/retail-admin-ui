import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../angular-material/material.module';
import { AgGridModule } from '@ag-grid-community/angular';

import { FuseSharedModule } from '@fuse/shared.module';

import { InvoiceComponent } from './invoice.component';


const routes = [
  {
    path: 'direct-sales/orders/invoice',
    component: InvoiceComponent
  },
];

@NgModule({
  declarations: [
    InvoiceComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    TranslateModule,
    MaterialModule,
    FuseSharedModule,
  ],
  exports: [
    InvoiceComponent
  ]
})
export class InvoiceModule {
}
