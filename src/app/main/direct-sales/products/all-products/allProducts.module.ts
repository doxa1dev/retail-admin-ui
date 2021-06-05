import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { AllProductsComponent } from './allProducts.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { ProductComponent } from './product/product.component';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe } from '@angular/common';
import { DndDirective } from './product/dnd.directive';
import { ProgressComponent } from './product/progress/progress.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProductDetailComponent } from './product/product-detail.component';
import { TimeLineModule } from 'app/main/_shared/timeline/timeline.module';
const routes = [
  {
    path: 'direct-sales/products/all',
    component: AllProductsComponent
  },
  {
    path: 'direct-sales/products/add-product',
    component: ProductComponent
  },
  {
    path: 'direct-sales/products/product-detail',
    component: ProductDetailComponent
  }
];

@NgModule({
  declarations: [
    AllProductsComponent,
    ProductComponent,
    DndDirective,
    ProgressComponent,
    ProductDetailComponent
  ],
  providers: [
    CurrencyPipe
  ],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    FuseSharedModule,
    MaterialModule,
    AgGridModule.withComponents([]),
    EditorModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    //MatChipsModule,
    DragDropModule,
    MultiSelectModule,
    TimeLineModule

  ],
  exports: [
    AllProductsComponent,
  ]
})

export class AllProductsModule {
}
