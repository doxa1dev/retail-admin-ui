import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FuseSharedModule } from "@fuse/shared.module";
import { MaterialModule } from "../../angular-material/material.module";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { AgGridModule } from "@ag-grid-community/angular";
import { CustomersComponent } from "./customers.component"

const routes = [
  {
    path: "direct-sales/customers",
    component: CustomersComponent,
  }
];

@NgModule({
  declarations: [CustomersComponent],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    FuseSharedModule,
    MaterialModule,
    DropdownModule,
    CalendarModule,
    AgGridModule.withComponents([])
  ],
  exports: [CustomersComponent],
})
export class CustomersModule {}
