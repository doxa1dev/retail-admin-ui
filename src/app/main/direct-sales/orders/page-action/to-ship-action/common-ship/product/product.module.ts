
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../../../angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { ProductComponent } from './product.component';

import { NumberDirective } from './serial-number.directive';
import { ButtonLoadingModule } from 'app/main/_shared/button-loading/button-loading.module';
import { DebounceClickDirective } from './single-click.directive';

// const routes = [
//     {
//         path: 'order-summary',
//         component: OrderSummaryComponent
//     }
// ];

@NgModule({
  declarations: [
    ProductComponent,
    NumberDirective,
    DebounceClickDirective
  ],
  imports: [

    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    ButtonLoadingModule,

  ],
  exports: [
    ProductComponent,
  ]
})

export class ProductModule {
}
