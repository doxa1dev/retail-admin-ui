import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeightBasedShippingComponent } from './weight-based-shipping.component';
import { RouterModule } from '@angular/router';
import { TimeLineModule } from 'app/main/_shared/timeline/timeline.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressButtonsModule } from 'mat-progress-buttons';

const routes = [
  {
    path: 'direct-sales/products/weight-based-shipping',
    component: WeightBasedShippingComponent
  }
];

@NgModule({
  declarations: [WeightBasedShippingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TimeLineModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressButtonsModule
  ]
})
export class WeightBasedShippingModule { }
