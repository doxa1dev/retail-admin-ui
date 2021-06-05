import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringPaymentsComponent } from './recurring-payments.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from '@ag-grid-community/angular';


const routes = [
  {
      path: 'direct-sales/recurring-payments',
      component: RecurringPaymentsComponent
  }
];

@NgModule({
  declarations: [RecurringPaymentsComponent],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    FuseSharedModule,
    MaterialModule,
    HttpClientModule,
    AgGridModule.withComponents([]),

],
exports: [RecurringPaymentsComponent]
})
export class RecurringPaymentsModule { }
