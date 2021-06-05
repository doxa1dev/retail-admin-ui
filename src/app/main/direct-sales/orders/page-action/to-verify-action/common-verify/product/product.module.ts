import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../../../angular-material/material.module';
import { FuseSharedModule } from '@fuse/shared.module';

import { ProductComponent } from './product.component';

// const routes = [
//     {
//         path: 'order-summary',
//         component: OrderSummaryComponent
//     }
// ];

@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [

    TranslateModule,
    MaterialModule,
    FuseSharedModule
  ],
  exports: [
    ProductComponent
  ]
})

export class ProductModule {
}
