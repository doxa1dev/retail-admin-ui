import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingHostGiftComponent } from './setting-host-gift/setting-host-gift.component';
import { RedemptionMonitoryComponent } from './redemption-monitory/redemption-monitory.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { TimeLineModule } from 'app/main/_shared/timeline/timeline.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ActiveSettingComponent } from './active-setting/active-setting.component';
import { CalendarModule } from 'primeng/calendar';

const routes = [
  {
    path: "direct-sales/setting-host-gift",
    component: SettingHostGiftComponent,
  },
  {
    path: "direct-sales/active-setting",
    component: ActiveSettingComponent,
  },
  {
    path: "direct-sales/redemption-monitor",
    component: RedemptionMonitoryComponent,
  }
]

@NgModule({
  declarations: [SettingHostGiftComponent, RedemptionMonitoryComponent, ActiveSettingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    MultiSelectModule,
    MatProgressButtonsModule,
    TimeLineModule,
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    DropdownModule,
    CalendarModule
  ]
})

export class HostGiftModule { }
