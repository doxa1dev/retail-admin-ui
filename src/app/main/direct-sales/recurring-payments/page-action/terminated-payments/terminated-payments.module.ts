import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminatedPaymentsComponent } from './terminated-payments.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { AgGridModule } from '@ag-grid-community/angular';



const routes = [
  {
    path: 'direct-sales/recurring-payments/terminated-payments',
    component: TerminatedPaymentsComponent
  }
];

@NgModule({
  declarations: [TerminatedPaymentsComponent],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    MglTimelineModule,
    AgGridModule,
  ], 
  exports: [TerminatedPaymentsComponent]
})
export class TerminatedPaymentsModule { }
