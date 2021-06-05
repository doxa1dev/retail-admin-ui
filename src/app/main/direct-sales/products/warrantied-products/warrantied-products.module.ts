import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { WarrantiedProductsComponent } from './warrantied-products.component';
import { SingleBarChartModule } from '../../news/chart/single-bar-chart/single-bar-chart.module'
import { AgGridModule } from '@ag-grid-community/angular';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { WarrantiedProductDetailComponent } from './warrantied-product-detail/warrantied-product-detail.component';

const routes = [
    {
        path: 'direct-sales/products/warrantied-products/detail',
        component: WarrantiedProductDetailComponent
    },
    {
        path: 'direct-sales/products/warrantied-products',
        component: WarrantiedProductsComponent
    }
];

@NgModule({
    declarations: [
      WarrantiedProductsComponent,
      WarrantiedProductDetailComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        CalendarModule,
        HttpClientModule,
        SingleBarChartModule,
        AgGridModule.withComponents([])
    ],
    exports: [
      WarrantiedProductsComponent,
    ]
})

export class WarrantiedProductsModule
{
}
