import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTransferCheckComponent } from './data-transfer-check.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'app/main/angular-material/material.module';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { AgGridModule } from '@ag-grid-community/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';

const routes = [
  {
    path: "direct-sales/data-transfer-check",
    component: DataTransferCheckComponent
  }
]

@NgModule({
  declarations: [DataTransferCheckComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    MatProgressButtonsModule,
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule
  ]
})
export class DataTransferCheckModule { }
