import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FuseSharedModule } from "@fuse/shared.module";
import { MaterialModule } from "../../angular-material/material.module";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { AgGridModule } from "@ag-grid-community/angular";
import { TimeLineModule } from 'app/main/_shared/timeline/timeline.module';
// import { AdvisoryProductModule } from "./advisory-product/advisory-product.module";
import { HierarchyRankingComponent } from './hierarchy-ranking.component';
import { SaleMonitorComponent } from './sale-monitor/sale-monitor.component';
import { PeriodConfigComponent } from './period-config/period-config.component';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { CreatePeriodConfigComponent } from "./period-config/create-period-config/create-period-config.component";
import { EditButtonPeriodComponent } from "./period-config/edit-button-period/edit-button-period.component";
import { SaleMonitorDetailComponent } from './sale-monitor/sale-monitor-detail/sale-monitor-detail.component';

import { MultiSelectModule } from 'primeng/multiselect';
import { AdvisoryProductComponent } from "./advisory-product/advisory-product.component";

const routes = [
  {
    path: "direct-sales/hierarchy-ranking/sale-monitor",
    component: SaleMonitorComponent,
  },
  {
    path: "direct-sales/hierarchy-ranking/sale-monitor/detail",
    component: SaleMonitorDetailComponent,
  },
  {
    path: "direct-sales/hierarchy-ranking/period-config",
    component: PeriodConfigComponent,
  },
  {
    path: "direct-sales/hierarchy-ranking/advisory-product",
    component: AdvisoryProductComponent,
  },

  {  path: "direct-sales/hierarchy-ranking/create-period-config",
    component: CreatePeriodConfigComponent,
  }
];

@NgModule({

  declarations: [
    HierarchyRankingComponent,
    SaleMonitorComponent,
    PeriodConfigComponent,
    CreatePeriodConfigComponent,
    EditButtonPeriodComponent,
    HierarchyRankingComponent,
    AdvisoryProductComponent,
    SaleMonitorDetailComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    FuseSharedModule,
    MaterialModule,
    DropdownModule,
    CalendarModule,
    MultiSelectModule,
    AgGridModule.withComponents([]),
    MaterialModule,
    TimeLineModule,
    MatProgressButtonsModule
  ],
  exports: [HierarchyRankingComponent],
})
export class HierarchyRankingModule {}
