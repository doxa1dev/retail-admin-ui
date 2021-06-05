import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { NewsInsightComponent } from './news-insight.component'
import { AgGridModule } from '@ag-grid-community/angular';
import { InsightDetaiiComponent } from './insight-detaii/insight-detaii.component';
import { LineChartModule } from '../chart/line-chart/line-chart.module';
import { BarChartModule } from '../chart/bar-chart/bar-chart.module';
import { CalendarModule } from 'primeng/calendar';
import { SingleBarChartModule } from '../chart/single-bar-chart/single-bar-chart.module';
import { ChartSingleModule } from '../chart/chart-single/chart-single.module';
import { WeeklyReachesComponent } from '../chart/weekly-reaches/weekly-reaches.component';
import { WeeklyViewsComponent } from '../chart/weekly-views/weekly-views.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
const routes = [
    {
        path: 'direct-sales/news/insight',
        component: NewsInsightComponent
    },
    {
        path: 'direct-sales/news/insight-detail',
        component: InsightDetaiiComponent
    }
];

@NgModule({
    declarations: [
        NewsInsightComponent,
        InsightDetaiiComponent,
        WeeklyReachesComponent,
        WeeklyViewsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AgGridModule,
        LineChartModule,
        BarChartModule,
        CalendarModule,
        SingleBarChartModule,
        ChartSingleModule,

        NgbModule,
        MatCarouselModule.forRoot(),
    ],
    exports: [
        NewsInsightComponent,
    ]
})

export class NewsInsightModule
{
}
