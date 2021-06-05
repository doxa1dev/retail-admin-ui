import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FuseSharedModule } from "@fuse/shared.module";
import { MaterialModule } from "../../../angular-material/material.module";
import { CustomerInformationComponent } from "./customer-information.component";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { AgGridModule } from "@ag-grid-community/angular";
import { TimeLineModule } from 'app/main/_shared/timeline/timeline.module';
import { IdNumberDirective } from '../advisor-id-number.directive';
import { ButtonLoadingModule } from 'app/main/_shared/button-loading/button-loading.module';

const routes = [
  {
    path: "direct-sales/customers/details",
    component: CustomerInformationComponent,
  },
];

@NgModule({
  declarations: [CustomerInformationComponent, IdNumberDirective],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    FuseSharedModule,
    MaterialModule,
    DropdownModule,
    CalendarModule,
    AgGridModule,
    TimeLineModule,
    ButtonLoadingModule
  ],
  exports: [CustomerInformationComponent],
})
export class CustomerInformationModule {}
