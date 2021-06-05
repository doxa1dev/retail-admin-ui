import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentInProcessComponent } from './payment-in-process.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { AgGridModule } from '@ag-grid-community/angular';


const routes = [
  {
    path: 'direct-sales/recurring-payments/payment-in-process',
    component: PaymentInProcessComponent
  }
];

@NgModule({
  declarations: [PaymentInProcessComponent],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    MglTimelineModule,
    AgGridModule,

  ], 

  exports: [PaymentInProcessComponent]
})
export class PaymentInProcessModule { }
