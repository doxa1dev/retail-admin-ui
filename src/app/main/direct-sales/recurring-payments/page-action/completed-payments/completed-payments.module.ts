import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompletedPaymentsComponent } from './completed-payments.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { AgGridModule } from '@ag-grid-community/angular';

const routes = [
  {
    path: 'direct-sales/recurring-payments/completed-payments',
    component: CompletedPaymentsComponent
  }
];

@NgModule({
  declarations: [CompletedPaymentsComponent],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    MglTimelineModule,
    AgGridModule,

  ], 
  exports: [CompletedPaymentsComponent],
})
export class CompletedPaymentsModule { }
