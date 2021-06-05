import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentSettingComponent } from './component-setting/component-setting.component';
import { RedemptionTrackerComponent } from './redemption-tracker/redemption-tracker.component';
import { GuestTrackerComponent } from './guest-tracker/guest-tracker.component';
import { RedemptionTrackerDetailComponent } from './redemption-tracker-detail/redemption-tracker-detail.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { TimeLineModule } from 'app/main/_shared/timeline/timeline.module';
import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DialogDropdownTextareaModule } from 'app/main/_shared/dialog-dropdown-textarea/dialog-dropdown-textarea.module';

const routes = [
  {
    path: "direct-sales/just-host/component-setting",
    component: ComponentSettingComponent,
  },
  {
    path: "direct-sales/just-host/redemption-tracker",
    component: RedemptionTrackerComponent,
  },
  {
    path: "direct-sales/just-host/guest-tracker",
    component: GuestTrackerComponent,
  },
  {
    path: "direct-sales/just-host/redemption-tracker-detail",
    component: RedemptionTrackerDetailComponent,
  },
]

@NgModule({
  declarations: [ComponentSettingComponent, RedemptionTrackerComponent, GuestTrackerComponent, RedemptionTrackerDetailComponent],
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
    CalendarModule,
    DialogDropdownTextareaModule
  ]
})
export class JustHostModule { }
