import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FuseSharedModule } from "@fuse/shared.module";
import { MaterialModule } from "../../angular-material/material.module";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { AgGridModule } from "@ag-grid-community/angular";
import { NewNaepComponent } from "./new-naep.component";
import { NaepTypesComponent } from './naep-types/naep-types.component';
import { NaepProcessComponent } from './naep-process/naep-process.component';
import { NaepPackagesComponent } from './naep-packages/naep-packages.component';
import { CreateNaepTypesComponent } from './naep-types/create-naep-types/create-naep-types.component'
import { TimeLineModule } from 'app/main/_shared/timeline/timeline.module';
import { CreateNaepProcessComponent } from './naep-process/create-naep-process/create-naep-process.component';
import { CreateNaepPackagesComponent } from './naep-packages/create-naep-packages/create-naep-packages.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditButtonRenderComponent } from './naep-types/edit-button-render/edit-button-render.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { NaepRolesComponent } from './naep-roles/naep-roles.component';
import { OptionalCheckboxComponent } from './naep-roles/optional-checkbox/optional-checkbox.component';
import { ImportDataComponent } from './import-data/import-data.component';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import { DndDirective } from "./naep-packages/create-naep-packages/dnd.directive";

const routes = [
  {
    path: "direct-sales/configuration/new-naep",
    component: NewNaepComponent,
  },
  {
    path: "direct-sales/configuration/naep-types",
    component: NaepTypesComponent,
  },
  {
    path: "direct-sales/configuration/naep-process",
    component: NaepProcessComponent,
  },
  {
    path: "direct-sales/configuration/naep-packages",
    component: NaepPackagesComponent,
  },
  {
    path: "direct-sales/configuration/naep-roles",
    component: NaepRolesComponent,
  },
  {
    path: "direct-sales/configuration/create-naep-type",
    component: CreateNaepTypesComponent,
  },
  {
    path: "direct-sales/configuration/create-naep-process",
    component: CreateNaepProcessComponent,
  },
  {
    path: "direct-sales/configuration/create-naep-packages",
    component: CreateNaepPackagesComponent,
  },
  {
    path: "direct-sales/configuration/import-data",
    component: ImportDataComponent,
  },

];

@NgModule({
  declarations: [NewNaepComponent,
        NaepTypesComponent, NaepProcessComponent,
        NaepPackagesComponent, CreateNaepTypesComponent,
        CreateNaepProcessComponent,
        CreateNaepPackagesComponent,
        EditButtonRenderComponent,
        NaepRolesComponent,
        OptionalCheckboxComponent,
        ImportDataComponent,
        DndDirective
      ],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    FuseSharedModule,
    MaterialModule,
    DropdownModule,
    CalendarModule,
    AgGridModule.withComponents([]),
    MaterialModule,
    TimeLineModule,
    MultiSelectModule,
    InputNumberModule,
    MatProgressButtonsModule
  ],
  exports: [NewNaepComponent],
})
export class NewNaepModule {}
