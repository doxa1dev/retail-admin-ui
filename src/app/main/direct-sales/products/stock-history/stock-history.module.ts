import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { StockHistoryComponent } from './stock-history.component';
import { SingleBarChartModule } from '../../news/chart/single-bar-chart/single-bar-chart.module'
import { AgGridModule } from '@ag-grid-community/angular';

import { HttpClientModule } from '@angular/common/http';
import { StockCardDetailComponent } from './stock-card-detail/stock-card-detail.component';
import { CalendarModule } from 'primeng/calendar';

const routes = [
    {
        path: 'direct-sales/products/stock-history',
        component: StockHistoryComponent
    },
    {
      path: 'direct-sales/products/stock-history/detail',
      component: StockCardDetailComponent
    }
];

@NgModule({
    declarations: [
        StockHistoryComponent,
        StockCardDetailComponent,
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
        StockHistoryComponent,
    ]
})

export class StockHistoryModule
{
}
